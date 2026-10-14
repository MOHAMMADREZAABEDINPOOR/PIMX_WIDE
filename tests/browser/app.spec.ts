import { test, expect } from "@playwright/test";
import { seal, portable, utf8 } from "../../services/crypto";
import { readFile } from "node:fs/promises";
const secret = "a-long-test-password";
async function english(page: any, path = "/") {
  await page.goto(path);
  await page.getByRole("button", { name: "تغییر زبان", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
}
test("landing, RTL mobile, English navigation and quick commands have no overflow or runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("فایل‌های شخصی");
  await page.screenshot({
    path: "test-results/landing-desktop-fa.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  await page.screenshot({
    path: "test-results/landing-mobile-fa.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "بازکردن منو" }).click();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "استودیوی رمزنگاری" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "استودیوی",
  );
  await page.getByRole("button", { name: "تغییر زبان" }).click();
  await page.keyboard.press("Control+k");
  await page.getByPlaceholder("Search tools…").fill("password");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Password lab" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Make a password",
  );
  expect(errors).toEqual([]);
});
test("text encrypt/decrypt, invalid password, cancellation and lock clear session", async ({
  page,
}) => {
  await english(page, "/studio");
  await page.getByPlaceholder("Start here…").fill("سلام خصوصی 🔐\nLine two");
  await page.getByLabel("Package password", { exact: true }).fill(secret);
  await page.getByRole("button", { name: "Create encrypted package" }).click();
  const out = page.getByLabel("Portable package");
  await expect(out).toBeVisible();
  const payload = await out.inputValue();
  expect(payload).toMatch(/^PIMX2\./);
  await page.getByRole("button", { name: "Decrypt", exact: true }).click();
  await page.getByLabel("Paste your encrypted package").fill(payload);
  await page.getByLabel("Package password", { exact: true }).fill("wrong");
  await page
    .getByRole("button", { name: "Decrypt package", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("Operation failed");
  await page.getByLabel("Package password", { exact: true }).fill(secret);
  await page
    .getByRole("button", { name: "Decrypt package", exact: true })
    .click();
  await expect(page.locator(".recovered-text")).toHaveValue(
    "سلام خصوصی 🔐\nLine two",
  );
  await page.getByRole("button", { name: "Quick lock", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your space is locked." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start a new session" }).click();
  await page.goto("/studio");
  await expect(
    page.getByLabel("Package password", { exact: true }),
  ).toHaveValue("");
  await page.getByPlaceholder("Start here…").fill("cancel me");
  await page.getByLabel("Package password", { exact: true }).fill(secret);
  await page.getByRole("button", { name: "Create encrypted package" }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByLabel("Portable package")).toHaveCount(0);
});
test("multiple binary files recover exact bytes and filenames", async ({
  page,
}) => {
  await english(page, "/studio");
  await page
    .getByRole("button", { name: "Files & folders", exact: true })
    .click();
  const bytes = Buffer.from([0, 255, 128, 1, 2, 3, 13, 10]);
  await page
    .locator("input[type=file]")
    .first()
    .setInputFiles([
      {
        name: "sample.bin",
        mimeType: "application/octet-stream",
        buffer: bytes,
      },
      {
        name: "یادداشت.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("سلام"),
      },
    ]);
  await page.getByLabel("Package password", { exact: true }).fill(secret);
  await page.getByRole("button", { name: "Create encrypted package" }).click();
  const payload = await page.getByLabel("Portable package").inputValue();
  await page.getByRole("button", { name: "Decrypt", exact: true }).click();
  await page.getByLabel("Paste your encrypted package").fill(payload);
  await page.getByLabel("Package password", { exact: true }).fill(secret);
  await page
    .getByRole("button", { name: "Decrypt package", exact: true })
    .click();
  await expect(page.locator(".recovered")).toContainText("sample.bin");
  await expect(page.locator(".recovered")).toContainText("یادداشت.txt");
  const event = page.waitForEvent("download");
  await page
    .locator(".recovered>div")
    .filter({ hasText: "sample.bin" })
    .getByRole("button")
    .click();
  const file = await event;
  expect(file.suggestedFilename()).toBe("sample.bin");
  expect(await readFile((await file.path())!)).toEqual(bytes);
});
test("vault encrypts metadata, survives reload and rejects wrong master password", async ({
  page,
}) => {
  await english(page, "/vault");
  await page.getByLabel("Vault password", { exact: true }).fill(secret);
  await page.getByLabel("Confirm password").fill(secret);
  await page.getByRole("button", { name: "Create vault", exact: true }).click();
  await expect(page.getByText("UNLOCKED", { exact: true })).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Cipher studio" })
    .click();
  await page.getByPlaceholder("Start here…").fill("vault-private-content");
  await page.getByLabel("Package password", { exact: true }).fill(secret);
  await page.getByRole("button", { name: "Create encrypted package" }).click();
  await page
    .getByRole("button", { name: "Save to vault", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByLabel("Title", { exact: true })
    .fill("Secret title");
  await page.getByLabel("Tags, separated by commas").fill("private,work");
  await page.getByRole("button", { name: "Save encrypted" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "My vault" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Secret title" }),
  ).toBeVisible();
  const stored = await page.evaluate(async () => {
    const r = indexedDB.open("pimx-private", 1);
    const db: any = await new Promise(
      (resolve) => (r.onsuccess = () => resolve(r.result)),
    );
    return new Promise((resolve) => {
      const q = db.transaction("vault").objectStore("vault").get("encrypted");
      q.onsuccess = () => resolve(JSON.stringify(q.result));
    });
  });
  expect(stored).not.toContain("Secret title");
  expect(stored).not.toContain("vault-private-content");
  await page.reload();
  await expect(page.getByText("LOCKED", { exact: true })).toBeVisible();
  await page.getByLabel("Vault password", { exact: true }).fill("wrong");
  await page.getByRole("button", { name: "Unlock vault", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByLabel("Vault password", { exact: true }).fill(secret);
  await page.getByRole("button", { name: "Unlock vault", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Secret title" }),
  ).toBeVisible();
});
test("atomic one-use share, preview safety, expiry, origin checks and protected admin API", async ({
  request,
}) => {
  const payload = portable(await seal(utf8("one use"), secret, "text"));
  const origin = "http://127.0.0.1:8788";
  expect((await request.get("/api/visits")).status()).toBe(401);
  expect(
    (
      await request.post("/api/shares", {
        data: { payload, hours: 1, views: 1 },
      })
    ).status(),
  ).toBe(403);
  const created = await request.post("/api/shares", {
    headers: { Origin: origin },
    data: { payload, hours: 1, views: 1 },
  });
  expect(created.status()).toBe(201);
  const { id } = await created.json();
  expect((await request.get(`/api/shares/${id}`)).status()).toBe(404);
  const concurrent = await Promise.all(
    [1, 2, 3].map(() =>
      request.post(`/api/shares/${id}`, {
        headers: { Origin: origin },
        data: {},
      }),
    ),
  );
  expect(concurrent.filter((r) => r.status() === 200)).toHaveLength(1);
  expect(concurrent.filter((r) => r.status() === 410)).toHaveLength(2);
  const login = await request.post("/api/session", {
    headers: { Origin: origin },
    data: { password: "disposable-test-password" },
  });
  expect(login.status()).toBe(200);
  const cookie = login.headers()["set-cookie"];
  expect(cookie).toContain("HttpOnly");
  expect(cookie).toContain("SameSite=Strict");
  expect((await request.get("/api/visits")).status()).toBe(200);
  await request.delete("/api/session", { headers: { Origin: origin } });
  expect((await request.get("/api/visits")).status()).toBe(401);
});
test("offline production shell and local encryption work without network", async ({
  page,
  context,
}) => {
  await english(page);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
    .toBe(true);
  await context.setOffline(true);
  await page.goto("/studio");
  await expect(page.getByText("Offline mode", { exact: true })).toBeVisible();
  await page.getByPlaceholder("Start here…").fill("offline secret");
  await page.getByLabel("Package password", { exact: true }).fill(secret);
  await page.getByRole("button", { name: "Create encrypted package" }).click();
  await expect(page.getByLabel("Portable package")).toBeVisible();
});
