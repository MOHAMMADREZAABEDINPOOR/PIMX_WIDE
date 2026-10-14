import { test, expect } from "@playwright/test";

// Keep the service worker's background precache from bypassing module gates.
test.use({ serviceWorkers: "block" });

for (const lang of ["fa", "en"] as const) {
  for (const theme of ["dark", "light"] as const) {
    test(`startup loader uses saved ${lang}/${theme} before the application loads`, async ({
      page,
    }) => {
      await page.addInitScript(
        ({ lang, theme }) =>
          localStorage.setItem(
            "pimx:preferences",
            JSON.stringify({ lang, theme, motion: true }),
          ),
        { lang, theme },
      );
      let release!: () => void;
      const gate = new Promise<void>((resolve) => {
        release = resolve;
      });
      await page.route(/\/assets\/index-.*\.js$/, async (route) => {
        await gate;
        await route.continue();
      });
      await page.goto("/", { waitUntil: "commit" });
      await expect(page.locator("#startup-loader")).toBeVisible();
      const fingerprint = await page
        .locator("#startup-loader .loader-core svg")
        .first()
        .boundingBox();
      expect(fingerprint!.width).toBeGreaterThanOrEqual(50);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(
        page.locator(`#startup-message .loader-${lang}`),
      ).toBeVisible();
      await expect(page.locator("#startup-loader")).toHaveCSS(
        "background-color",
        theme === "dark" ? "rgb(16, 17, 18)" : "rgb(245, 243, 237)",
      );
      await page.screenshot({
        path: `test-results/loader-${lang}-${theme}.png`,
      });
      release();
      await expect(page.locator("#startup-loader")).toHaveCount(0);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("#root")).not.toHaveAttribute("inert", "");
    });
  }
}

test("route loader is shown while a page module loads, and respects reduced motion", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#startup-loader")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(/\/assets\/PasswordPage-.*\.js$/, async (route) => {
    await gate;
    await route.continue();
  });
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "رمزساز", exact: true })
    .click();
  await expect(page.locator(".route-loader")).toBeVisible();
  await expect(page.locator("#root")).toHaveAttribute("inert", "");
  await expect(page.locator(".route-loader .loader-orbit").first()).toHaveCSS(
    "animation-name",
    "none",
  );
  release();
  await expect(page.locator(".route-loader")).toHaveCount(0);
  await expect(page.locator("#root")).not.toHaveAttribute("inert", "");
  await expect(page.locator(".generated-value output")).not.toBeEmpty();
});

test("full width status bar, animated FAQ and gold themes work on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const bar = page.locator(".utility-bar");
  const bounds = await bar.boundingBox();
  expect(bounds!.x).toBe(0);
  expect(bounds!.width).toBe(390);
  await expect(bar).toContainText("رمزنگاری روی دستگاه شما");
  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim(),
    ),
  ).toBe("#dfbd7a");
  const question = page.getByRole("button", {
    name: "آیا متن و فایل من به سرور ارسال می‌شود؟",
    exact: true,
  });
  await question.click();
  await expect(page.locator("#faq-answer-0")).toBeVisible();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await question.click();
  await expect(page.locator("#faq-answer-0")).toHaveCount(0);
  await page.getByRole("button", { name: "تغییر تم", exact: true }).click();
  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim(),
    ),
  ).toBe("#896322");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    "content",
    "#f5f3ed",
  );
});

test("availability distinguishes browser connection from server health and handles offline", async ({
  page,
  context,
}) => {
  await page.goto("/sla");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "دسترسی به سرویس",
  );
  await expect(page.locator(".connection-server")).toContainText(
    "سرور هنوز بررسی نشده",
  );
  await page.getByRole("button", { name: "بررسی اتصال سرور" }).click();
  await expect(page.locator(".connection-server")).toContainText(
    "سرور اشتراک پاسخ می‌دهد",
  );
  await page.route("**/api/health", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: '{"database":false}',
    }),
  );
  await page.getByRole("button", { name: "بررسی اتصال سرور" }).click();
  await expect(page.locator(".connection-server")).toContainText(
    "سرور اشتراک در دسترس نیست",
  );
  await context.setOffline(true);
  await expect(
    page.getByRole("heading", { name: "مرورگر آفلاین است" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "بررسی اتصال سرور" }),
  ).toBeDisabled();
  await context.setOffline(false);
  await expect(
    page.getByRole("button", { name: "بررسی اتصال سرور" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "تغییر زبان", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Service availability",
  );
  await expect(page.locator(".availability-tool")).toHaveCount(4);
});
