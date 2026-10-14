import { test } from "node:test";
import assert from "node:assert/strict";
import {
  authorized,
  sessionCookie,
  hashPassword,
  sameOrigin,
  Env,
} from "../functions/lib/server";
const env = {
  SESSION_SECRET: "a-disposable-test-secret-over-32-characters",
} as Env;
test("signed admin session accepts original and rejects altered, absent and expired cookies", async () => {
  const token = await sessionCookie(env);
  const request = (cookie: string) =>
    new Request("https://example.test/api/visits", {
      headers: { Cookie: cookie },
    });
  assert.equal(await authorized(request("pimx_session=" + token), env), true);
  assert.equal(
    await authorized(
      request(
        "pimx_session=" +
          token.slice(0, -1) +
          (token.endsWith("a") ? "b" : "a"),
      ),
      env,
    ),
    false,
  );
  assert.equal(await authorized(request(""), env), false);
  assert.equal(
    await authorized(request("pimx_session=1:expired." + "f".repeat(64)), env),
    false,
  );
  assert.equal(
    sameOrigin(
      new Request("https://example.test/api/session", {
        headers: { Origin: "https://evil.test" },
      }),
    ),
    false,
  );
});
test("administrator hashes use a salt and preserve password whitespace", async () => {
  const one = await hashPassword(" pass ", "salt-one");
  assert.notEqual(one, await hashPassword("pass", "salt-one"));
  assert.notEqual(one, await hashPassword(" pass ", "salt-two"));
});
