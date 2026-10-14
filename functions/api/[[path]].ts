import {
  Env,
  authorized,
  boundedBody,
  equal,
  hashPassword,
  json,
  rateLimit,
  sameOrigin,
  sessionCookie,
} from "../lib/server";
export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const path = new URL(request.url).pathname,
    method = request.method;
  if (path === "/api/health" && method === "GET") {
    try {
      await env.PIMX_DB.prepare("SELECT 1 FROM shares LIMIT 1").first();
      return json({
        database: true,
        sharing: true,
        admin: !!env.ADMIN_PASSWORD_HASH && !!env.SESSION_SECRET,
      });
    } catch {
      return json({ database: false, sharing: false, admin: false }, 503);
    }
  }
  if (!env.PIMX_DB) return json({ error: "Service is not configured" }, 503);
  if (method === "POST" && !sameOrigin(request))
    return json({ error: "Invalid origin" }, 403);
  try {
    if (path === "/api/session" && method === "GET")
      return json({ authenticated: await authorized(request, env) });
    if (path === "/api/session" && method === "DELETE") {
      if (!sameOrigin(request)) return json({ error: "Invalid origin" }, 403);
      return json({ ok: true }, 200, {
        "Set-Cookie":
          "pimx_session=; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=0",
      });
    }
    if (path === "/api/session" && method === "POST") {
      if (
        !env.ADMIN_PASSWORD_HASH ||
        !env.SESSION_SECRET ||
        env.SESSION_SECRET.length < 32
      )
        return json({ error: "Admin is not configured" }, 503);
      if (!(await rateLimit(request, env, "login", 10)))
        return json({ error: "Too many attempts" }, 429);
      const body = await boundedBody(request, 2048),
        [salt, expected] = env.ADMIN_PASSWORD_HASH.split(":");
      if (
        typeof body.password !== "string" ||
        body.password.length > 256 ||
        !salt ||
        !expected
      )
        return json({ error: "Invalid credentials" }, 401);
      if (!equal(await hashPassword(body.password, salt), expected))
        return json({ error: "Invalid credentials" }, 401);
      return json({ ok: true }, 200, {
        "Set-Cookie": `pimx_session=${await sessionCookie(env)}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=3600`,
      });
    }
    if (path === "/api/visits" && method === "POST") {
      if (!(await rateLimit(request, env, "visit", 30)))
        return json({ error: "Rate limit" }, 429);
      const ua = request.headers.get("User-Agent") || "",
        device = /iPad|Tablet/i.test(ua)
          ? "Tablet"
          : /Mobi|Android/i.test(ua)
            ? "Mobile"
            : "Desktop";
      const country = (request.cf?.country as string) || "Unknown";
      await env.PIMX_DB.prepare(
        "INSERT INTO visits (ts,device,country) VALUES (?,?,?)",
      )
        .bind(Date.now(), device, country)
        .run();
      await env.PIMX_DB.batch([
        env.PIMX_DB.prepare("DELETE FROM visits WHERE ts < ?").bind(
          Date.now() - 90 * 86400000,
        ),
        env.PIMX_DB.prepare("DELETE FROM rate_limits WHERE expires < ?").bind(
          Date.now(),
        ),
        env.PIMX_DB.prepare(
          "DELETE FROM shares WHERE expires < ? OR remaining <= 0",
        ).bind(Date.now()),
      ]);
      return json({ ok: true });
    }
    if (path === "/api/visits" && method === "GET") {
      if (!(await authorized(request, env)))
        return json({ error: "Unauthorized" }, 401);
      const days = Math.min(
          90,
          Math.max(
            1,
            Number(new URL(request.url).searchParams.get("days")) || 7,
          ),
        ),
        since = Date.now() - days * 86400000;
      const [daily, devices, countries, total] = await env.PIMX_DB.batch([
        env.PIMX_DB.prepare(
          "SELECT strftime('%Y-%m-%d',ts/1000,'unixepoch','+3 hours','+30 minutes') AS day, count(*) AS count FROM visits WHERE ts>=? GROUP BY day ORDER BY day",
        ).bind(since),
        env.PIMX_DB.prepare(
          "SELECT device, count(*) AS count FROM visits WHERE ts>=? GROUP BY device",
        ).bind(since),
        env.PIMX_DB.prepare(
          "SELECT country, count(*) AS count FROM visits WHERE ts>=? GROUP BY country ORDER BY count DESC LIMIT 10",
        ).bind(since),
        env.PIMX_DB.prepare(
          "SELECT count(*) AS count FROM visits WHERE ts>=?",
        ).bind(since),
      ]);
      return json({
        daily: daily.results,
        devices: devices.results,
        countries: countries.results,
        total: (total.results[0] as any)?.count || 0,
      });
    }
    if (path === "/api/shares" && method === "POST") {
      if (!(await rateLimit(request, env, "share-create", 20)))
        return json({ error: "Rate limit" }, 429);
      const body = await boundedBody(request, 510000);
      if (
        typeof body.payload !== "string" ||
        body.payload.length > 500000 ||
        !body.payload.startsWith("PIMX2.") ||
        ![1, 24, 168].includes(body.hours) ||
        ![1, 3, 5, 10].includes(body.views)
      )
        return json({ error: "Invalid share" }, 400);
      let e;
      try {
        e = JSON.parse(atob(body.payload.slice(6)));
      } catch {
        return json({ error: "Invalid package" }, 400);
      }
      if (
        e.version !== 2 ||
        e.algorithm !== "AES-256-GCM" ||
        e.kdf !== "PBKDF2-SHA256" ||
        e.iterations !== 600000 ||
        !["text", "archive"].includes(e.kind) ||
        typeof e.cipherText !== "string" ||
        typeof e.salt !== "string" ||
        typeof e.iv !== "string" ||
        atob(e.iv).length !== 12 ||
        atob(e.salt).length !== 16 ||
        atob(e.cipherText).length < 16
      )
        return json({ error: "Invalid package" }, 400);
      if (
        Object.keys(e).some(
          (k) =>
            ![
              "version",
              "algorithm",
              "kdf",
              "iterations",
              "kind",
              "cipherText",
              "salt",
              "iv",
            ].includes(k),
        )
      )
        return json({ error: "Unexpected package fields" }, 400);
      const id = Array.from(crypto.getRandomValues(new Uint8Array(24)), (n) =>
        n.toString(16).padStart(2, "0"),
      ).join("");
      await env.PIMX_DB.batch([
        env.PIMX_DB.prepare(
          "DELETE FROM shares WHERE expires < ? OR remaining <= 0",
        ).bind(Date.now()),
        env.PIMX_DB.prepare(
          "INSERT INTO shares (id,payload,expires,remaining) VALUES (?,?,?,?)",
        ).bind(id, body.payload, Date.now() + body.hours * 3600000, body.views),
      ]);
      return json({ id }, 201);
    }
    if (/^\/api\/shares\/[a-f0-9]{48}$/.test(path) && method === "POST") {
      if (!(await rateLimit(request, env, "share-read", 60)))
        return json({ error: "Rate limit" }, 429);
      // D1 runs this statement atomically: concurrent readers cannot overspend the download count.
      const row = await env.PIMX_DB.prepare(
        "UPDATE shares SET remaining=remaining-1 WHERE id=? AND remaining>0 AND expires>? RETURNING payload,remaining",
      )
        .bind(path.split("/").pop(), Date.now())
        .first<{ payload: string; remaining: number }>();
      if (!row) return json({ error: "Expired or unavailable" }, 410);
      if (row.remaining === 0)
        await env.PIMX_DB.prepare(
          "DELETE FROM shares WHERE id=? AND remaining=0",
        )
          .bind(path.split("/").pop())
          .run();
      return json({ payload: row.payload });
    }
    return json({ error: "Not found" }, 404);
  } catch {
    return json({ error: "Request failed or storage unavailable" }, 400);
  }
};
