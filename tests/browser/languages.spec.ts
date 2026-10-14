import { test, expect } from "@playwright/test";
import { languages, translate } from "../../data/i18n";

for (const language of languages) {
  test(`${language.english}: every page, saved preference, localized artwork and mobile layout`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(
      (code) =>
        localStorage.setItem(
          "pimx:preferences",
          JSON.stringify({ lang: code, motion: false }),
        ),
      language.code,
    );
    for (const route of [
      "/",
      "/studio",
      "/vault",
      "/passwords",
      "/settings",
      "/privacy",
      "/about",
      "/terms",
      "/sla",
      "/share",
      "/pimxwideadmin",
    ]) {
      await page.goto(route);
      await expect(page.locator("#startup-loader")).toHaveCount(0);
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        language.code === "zh" ? "zh-CN" : language.code,
      );
      await expect(page.locator("html")).toHaveAttribute(
        "dir",
        language.code === "fa" ? "rtl" : "ltr",
      );
      await expect(page).toHaveTitle(
        `PIMX WIDE | ${translate(language.code, "ابزارهای رمزنگاری محلی", "Local encryption tools")}`,
      );
      await expect(page.locator("h1")).toBeVisible();
      for (const width of [1440, 390, 300]) {
        await page.setViewportSize({ width, height: 900 });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${route}: ${width}px`,
        ).toBe(true);
        const menu = page.locator(".mobile-toggle");
        if (width < 650) {
          const box = await menu.boundingBox();
          expect(box).not.toBeNull();
          expect(box!.x).toBeGreaterThanOrEqual(0);
          expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        }
      }
      for (const image of await page.locator(".information-art img").all()) {
        await expect(image).toHaveJSProperty("complete", true);
        expect(
          await image.evaluate((image: HTMLImageElement) => image.naturalWidth),
        ).toBeGreaterThan(0);
        if (language.code !== "en")
          await expect(image).toHaveAttribute(
            "src",
            new RegExp(`-${language.code}\\.svg$`),
          );
      }
    }
    expect(errors).toEqual([]);
  });
}

test("language picker offers eight languages, works with the keyboard and persists after reload", async ({
  page,
}) => {
  await page.goto("/");
  const picker = page.locator(".header-language [role=combobox]");
  await expect(picker).toContainText("فارسی");
  await expect(picker.locator("img")).toHaveCount(0);
  expect((await picker.boundingBox())!.width).toBeLessThan(150);
  await picker.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("option")).toHaveCount(8);
  await expect(page.getByRole("option").locator("img")).toHaveCount(0);
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await page.goto("/settings");
  await expect(
    page.locator("#appearance [role=combobox]").last(),
  ).toContainText("한국어");
  await expect(page.locator("#startup-loader")).toHaveCount(0);
  await page.screenshot({
    path: "test-results/languages-mobile-ko.png",
    fullPage: true,
  });
});

test("disabled link service leaves downloads and QR available and explains the state", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "pimx:preferences",
      JSON.stringify({ lang: "en", motion: false }),
    ),
  );
  await page.route("**/api/health", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ sharing: false, database: false, admin: false }),
    }),
  );
  await page.goto("/studio");
  await expect(page.locator("#startup-loader")).toHaveCount(0);
  await page.getByPlaceholder("Start here…").fill("A private message");
  await expect(page.getByPlaceholder("Start here…")).toHaveValue(
    "A private message",
  );
  await page
    .getByLabel("Package password", { exact: true })
    .fill("a-long-test-password");
  await page.getByRole("button", { name: "Create encrypted package" }).click();
  await expect(page.getByLabel("Portable package")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Download", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "QR & link" }).click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("button", { name: "Upload encrypted package & create link" }),
  ).toBeDisabled();
  await expect(page.getByRole("dialog")).toContainText(
    "Link sharing is currently disabled.",
  );
  await expect(page.getByRole("button", { name: "Save QR" })).toBeEnabled();
});

test("new service worker replaces an old shell, cleans obsolete cache and supports offline routes", async ({
  page,
  context,
}) => {
  test.setTimeout(60000);
  await page.addInitScript(() =>
    localStorage.setItem(
      "pimx:preferences",
      JSON.stringify({ lang: "de", motion: false }),
    ),
  );
  await page.goto("/");
  await expect(page.locator("#startup-loader")).toHaveCount(0);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    await navigator.serviceWorker.register("/sw-old.js");
  });
  await expect
    .poll(() =>
      page.evaluate(async () =>
        (await caches.keys()).includes("pimx-obsolete"),
      ),
    )
    .toBe(true);
  await page.evaluate(async () => {
    await navigator.serviceWorker.register("/sw.js", {
      updateViaCache: "none",
    });
  });
  await expect
    .poll(
      () =>
        page.evaluate(async () =>
          (await caches.keys()).includes("pimx-obsolete"),
        ),
      { timeout: 30000 },
    )
    .toBe(false);
  await page.reload();
  await expect(page.locator("#startup-loader")).toHaveCount(0);
  await context.setOffline(true);
  await page.goto("/privacy");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await expect(page.locator("body")).not.toContainText("OLD DESIGN");
  await context.setOffline(false);
});
