import { test, expect } from "@playwright/test";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname, basename } from "node:path";
const secret = "a-long-test-password";
async function en(page: any, path: string) {
  await page.goto(path);
  await page.locator(".header-language [role=combobox]").click();
  await page.getByRole("option", { name: /English/ }).click();
}
test("QR, limited link creation, explicit retrieval and decryption form a complete flow", async ({
  page,
}) => {
  await en(page, "/studio");
  await page.getByPlaceholder("Start here…").fill("share this privately");
  await page.getByLabel("Package password", { exact: true }).fill(secret);
  await page.getByRole("button", { name: "Create encrypted package" }).click();
  await expect(page.getByLabel("Portable package")).toBeVisible();
  await page.getByRole("button", { name: "QR & link" }).click();
  await expect(page.getByRole("dialog").locator("img")).toBeVisible();
  await page
    .getByRole("button", { name: "Upload encrypted package & create link" })
    .click();
  const link = page.getByLabel("Share link");
  await expect(link).toBeVisible();
  const url = await link.inputValue();
  await page.goto(url);
  await expect(
    page.getByRole("heading", { name: "Ready to receive?" }),
  ).toBeVisible();
  await page.reload();
  await page
    .getByRole("button", { name: "Retrieve encrypted package" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Package received." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Open in studio" }).click();
  await page.getByLabel("Package password", { exact: true }).fill(secret);
  await page
    .getByRole("button", { name: "Decrypt package", exact: true })
    .click();
  await expect(page.locator(".recovered-text")).toHaveValue(
    "share this privately",
  );
  await page.goto(url);
  await page
    .getByRole("button", { name: "Retrieve encrypted package" })
    .click();
  await expect(page.getByRole("alert")).toContainText("download limit");
});
test("encrypted vault backups initialize a different device and item search/favorites work", async ({
  page,
  browser,
}) => {
  await en(page, "/vault");
  await page.getByLabel("Vault password", { exact: true }).fill(secret);
  await page.getByLabel("Confirm password").fill(secret);
  await page.getByRole("button", { name: "Create vault", exact: true }).click();
  await expect(page.getByText("UNLOCKED", { exact: true })).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Cipher studio" })
    .click();
  await page.getByPlaceholder("Start here…").fill("backup content");
  await page.getByLabel("Package password", { exact: true }).fill(secret);
  await page.getByRole("button", { name: "Create encrypted package" }).click();
  await page
    .getByRole("button", { name: "Save to vault", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByLabel("Title", { exact: true })
    .fill("Backup item");
  await page
    .getByRole("dialog")
    .getByLabel("Tags, separated by commas")
    .fill("holiday");
  await page.getByRole("button", { name: "Save encrypted" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "My vault" })
    .click();
  await page.getByRole("button", { name: "Toggle favorite" }).click();
  await expect(page.locator(".starred")).toBeVisible();
  await page.getByPlaceholder("Search titles and tags…").fill("holiday");
  await expect(
    page.getByRole("heading", { name: "Backup item" }),
  ).toBeVisible();
  const event = page.waitForEvent("download");
  await page.getByRole("button", { name: "Backup", exact: true }).click();
  const dl = await event;
  const path = (await dl.path())!;
  const other = await browser.newContext({ baseURL: "http://127.0.0.1:8788" });
  try {
    const p = await other.newPage();
    await en(p, "/vault");
    await p.locator(".backup-import input[type=file]").setInputFiles(path);
    await p.getByLabel("Backup password", { exact: true }).fill(secret);
    await p.getByRole("button", { name: "Verify & import" }).click();
    await expect(p.getByRole("dialog")).toHaveCount(0);
    await p.getByLabel("Vault password", { exact: true }).fill(secret);
    await p.getByRole("button", { name: "Unlock vault", exact: true }).click();
    await expect(p.getByRole("heading", { name: "Backup item" })).toBeVisible();
    await expect(p.locator(".starred")).toBeVisible();
  } finally {
    await other.close();
  }
});
test("folder paths, duplicate rejection and ZIP recovery preserve original structure", async ({
  page,
}) => {
  const folder = await mkdtemp(join(tmpdir(), "pimx-folder-"));
  await writeFile(join(folder, "note.txt"), "folder contents");
  await writeFile(join(folder, "binary.bin"), Buffer.from([1, 0, 254]));
  await en(page, "/studio");
  await page
    .getByRole("button", { name: "Files & folders", exact: true })
    .click();
  await page.locator("input[type=file]").nth(1).setInputFiles(folder);
  await expect(page.locator(".file-queue")).toContainText("note.txt");
  await expect(page.locator(".file-queue")).toContainText("binary.bin");
  await page.locator("input[type=file]").nth(1).setInputFiles(folder);
  await expect(page.getByRole("alert")).toContainText("Duplicate file paths");
  await page.getByLabel("Package password", { exact: true }).fill(secret);
  await page.getByRole("button", { name: "Create encrypted package" }).click();
  const p = await page.getByLabel("Portable package").inputValue();
  await page.getByRole("button", { name: "Decrypt", exact: true }).click();
  await page.getByLabel("Paste your encrypted package").fill(p);
  await page.getByLabel("Package password", { exact: true }).fill(secret);
  await page
    .getByRole("button", { name: "Decrypt package", exact: true })
    .click();
  await expect(page.locator(".recovered")).toContainText("note.txt");
  await expect(page.locator(".recovered")).toContainText("pimx-folder-");
  if (
    dirname(resolve(folder)) !== resolve(tmpdir()) ||
    !basename(folder).startsWith("pimx-folder-")
  )
    throw new Error("Unexpected fixture path");
  await rm(folder, { recursive: true, force: true });
});
test("admin browser session, consent analytics, preferences, mobile layouts and light theme", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await en(page, "/settings");
  await page
    .getByRole("checkbox", { name: /^Optional visit analytics/ })
    .check();
  await expect
    .poll(async () => {
      const r = await page.request.get("/api/health");
      return r.status();
    })
    .toBe(200);
  await page.getByRole("combobox", { name: "Theme", exact: true }).click();
  await page.getByRole("option", { name: /^Light/ }).click();
  await expect(page.locator(".brand-gold-preview")).toContainText("PIMX gold");
  await page.getByRole("checkbox", { name: /^Animations/ }).uncheck();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "false");
  await page.goto("/pimxwideadmin");
  await page
    .getByLabel("Admin password", { exact: true })
    .fill("disposable-test-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByText("Recorded visits", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Visit trend", { exact: true })).toBeVisible();
  await page.screenshot({
    path: "test-results/admin-light.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Administrator sign-in" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of [
    "/studio",
    "/vault",
    "/passwords",
    "/settings",
    "/privacy",
    "/about",
    "/share",
  ]) {
    await page.goto(path);
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
  }
  await page.goto("/passwords");
  await page.getByRole("button", { name: "Passphrase", exact: true }).click();
  await expect(page.locator("output")).toContainText("-");
  await page.screenshot({
    path: "test-results/password-mobile-light.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
