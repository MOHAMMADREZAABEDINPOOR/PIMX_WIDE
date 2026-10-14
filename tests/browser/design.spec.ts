import { test, expect } from "@playwright/test";
import { portable, seal, utf8 } from "../../services/crypto";
const secret = "a-long-test-password";
test("all public pages fit 300px through large desktops, in both directions and themes", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const routes = [
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
  ];
  for (const lang of ["fa", "en"])
    for (const theme of ["dark", "light"]) {
      await page.goto("/");
      await page.evaluate(
        ({ lang, theme }) =>
          localStorage.setItem(
            "pimx:preferences",
            JSON.stringify({ lang, theme, motion: false }),
          ),
        { lang, theme },
      );
      for (const width of [300, 390, 768, 1440, 2560, 3840]) {
        await page.setViewportSize({ width, height: 900 });
        for (const route of routes) {
          await page.goto(route);
          await expect(page.locator("html")).toHaveAttribute("lang", lang);
          await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            `${route}, ${lang}, ${theme}, ${width}px`,
          ).toBe(true);
          const outside = await page
            .locator(
              "main button:not(.dimension-card), header button, main input:not(.sr-only), main textarea, .select-trigger",
            )
            .evaluateAll((elements) =>
              elements
                .filter((el) => {
                  const r = el.getBoundingClientRect();
                  return (
                    r.width > 0 &&
                    r.height > 0 &&
                    (r.left < -0.6 || r.right > innerWidth + 0.6)
                  );
                })
                .map((el) => ({
                  tag: el.tagName,
                  text: el.textContent?.slice(0, 50),
                })),
            );
          expect(outside, `controls outside ${route} / ${width}px`).toEqual([]);
        }
      }
    }
  expect(errors).toEqual([]);
});
test("styled selects support keyboard, selected state, viewport positioning and Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 300, height: 650 });
  await page.goto("/settings");
  const idle = page.getByRole("combobox", {
    name: "قفل پس از بی‌کاری",
    exact: true,
  });
  await idle.scrollIntoViewIfNeeded();
  await idle.click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await expect(idle).toHaveAttribute("aria-expanded", "true");
  const box = await page.getByRole("listbox").boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(300);
  await page.screenshot({ path: "test-results/select-300-fa.png" });
  await idle.press("End");
  await idle.press("Enter");
  await expect(idle).toContainText("30");
  await expect(idle).toHaveAttribute("aria-expanded", "false");
  await idle.press("ArrowDown");
  await idle.press("Home");
  await idle.press("Enter");
  await expect(idle).toContainText("1");
  await idle.click();
  await idle.press("Escape");
  await expect(page.getByRole("listbox")).toHaveCount(0);
  await page.reload();
  await expect(idle).toContainText("1");
  expect(
    await page.evaluate(() => localStorage.getItem("pimx:preferences")),
  ).toContain('"idle":1');
});
test("FAQ height, route transitions, toasts and reduced motion behave coherently", async ({
  page,
}) => {
  await page.goto("/");
  const question = page.getByRole("button", { name: /آیا متن و فایل من/ });
  await question.scrollIntoViewIfNeeded();
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#faq-answer-0")).toBeVisible();
  await expect(page.locator("#faq-answer-0")).toContainText(
    "رمز عبور و متن اصلی",
  );
  await question.click();
  await expect(page.locator("#faq-answer-0")).toHaveCount(0);
  await page
    .getByRole("contentinfo")
    .getByRole("button", { name: "حریم خصوصی", exact: true })
    .click();
  await expect(page.locator(".relay-art")).toBeVisible();
  await expect(page.locator(".privacy-record")).toHaveCount(5);
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "تنظیمات", exact: true })
    .click();
  await expect(page.locator(".settings-experience")).toBeVisible();
  await page.getByRole("checkbox", { name: /انیمیشن‌ها/ }).uncheck();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "false");
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "رمزساز", exact: true })
    .click();
  await page.getByRole("button", { name: "کپی رمز", exact: true }).click();
  await expect(page.locator(".toast-card")).toBeVisible();
  await page
    .getByRole("status")
    .getByRole("button", { name: "بستن", exact: true })
    .click();
  await expect(page.locator(".toast-card")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect
    .poll(() =>
      page
        .locator(".cube-3d")
        .first()
        .evaluate((el) => getComputedStyle(el).animationName),
    )
    .toBe("none");
});
test("300px studio tabs, processing, file lists and modal selects remain usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 300, height: 780 });
  await page.goto("/studio");
  await page.getByRole("button", { name: "فایل و پوشه", exact: true }).click();
  await expect(page.locator(".drop-zone")).toBeVisible();
  await page.getByRole("button", { name: "متن", exact: true }).click();
  await page.getByPlaceholder("از اینجا شروع کن…").fill("پیام خصوصی");
  await page.getByLabel("رمز عبور بسته", { exact: true }).fill(secret);
  await page
    .getByRole("button", { name: "بسته رمز‌شده بساز", exact: true })
    .click();
  await expect(page.getByLabel("بسته قابل‌انتقال")).toBeVisible();
  await page.getByRole("button", { name: "QR و لینک", exact: true }).click();
  const lifetime = page.getByRole("combobox", {
    name: "اعتبار لینک",
    exact: true,
  });
  await lifetime.scrollIntoViewIfNeeded();
  await lifetime.click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.getByRole("option", { name: "۷ روز", exact: true }).click();
  await expect(lifetime).toContainText("۷ روز");
  await page
    .getByRole("combobox", { name: "تعداد دریافت", exact: true })
    .click();
  await page.getByRole("option", { name: "3 دریافت", exact: true }).click();
  await expect(
    page.getByRole("combobox", { name: "تعداد دریافت", exact: true }),
  ).toContainText("3");
  await page.screenshot({ path: "test-results/share-modal-300-fa.png" });
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "بستن", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("scenes are visible, animate only in view, and redesigned pages have complete content", async ({
  page,
}) => {
  await page.goto("/");
  const sculpture = page.locator(".cube-3d").first();
  await sculpture.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      sculpture
        .locator('xpath=ancestor::div[contains(@class,"scene-3d")]')
        .getAttribute("data-visible"),
    )
    .toBe("true");
  await page.getByRole("button", { name: /رمز عبور شما/ }).click();
  await expect(page.locator(".layer-description")).toContainText("salt تصادفی");
  for (const route of ["/privacy", "/about", "/terms", "/settings"]) {
    await page.goto(route);
    await expect(
      page.locator(
        route === "/settings"
          ? ".story-art .scene-3d"
          : route === "/privacy"
            ? ".privacy-art .system-visual"
            : ".information-art",
      ),
    ).toBeVisible();
    await page.screenshot({
      path: `test-results/redesign-${route.slice(1)}-desktop.png`,
      fullPage: true,
      animations: "disabled",
    });
  }
  await page.setViewportSize({ width: 300, height: 780 });
  await page.goto("/settings");
  await page.screenshot({
    path: "test-results/redesign-settings-300.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.goto("/");
  await page.screenshot({
    path: "test-results/redesign-home-300.png",
    fullPage: true,
    animations: "disabled",
  });
});
