import { test, expect } from "@playwright/test";

test("home sample encrypts and decrypts, tools navigate, FAQ and quick lock work", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "امتحان با پیام نمونه", exact: true })
    .click();
  await page.getByLabel("پیام نمونه").fill("قرار فردا ساعت ده");
  await page.getByRole("button", { name: "تبدیل به بسته رمز‌شده" }).click();
  await expect(page.locator(".demo-output pre")).toContainText("PIMX2.");
  await page.getByRole("button", { name: "حالا بازیابی کن" }).click();
  await expect(page.locator(".success-note")).toContainText(
    "قرار فردا ساعت ده",
  );
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "بستن", exact: true })
    .click();
  const faq = page.getByRole("button", {
    name: "آیا متن و فایل من به سرور ارسال می‌شود؟",
    exact: true,
  });
  await faq.click();
  await expect(faq).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#faq-answer-0")).toContainText(
    "رمز عبور و متن اصلی ارسال نمی‌شوند",
  );
  await faq.click();
  await expect(page.locator("#faq-answer-0")).toHaveCount(0);
  await page.locator(".shelf-tool").nth(2).click();
  await expect(page).toHaveURL(/\/passwords$/);
  await expect(page.locator(".generated-value output")).not.toBeEmpty();
  await page.route("https://www.google.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<title>Google fixture</title>",
    }),
  );
  await page.getByRole("button", { name: "قفل سریع", exact: true }).click();
  await expect(page).toHaveURL("https://www.google.com/");
});

test("redesigned pages fit mobile and desktop in both languages and themes", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const lang of ["fa", "en"]) {
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
      for (const width of [300, 390, 1440]) {
        await page.setViewportSize({ width, height: 960 });
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
        ]) {
          await page.goto(route);
          await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
          await expect(page.locator("html")).toHaveAttribute("lang", lang);
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            `${route} ${width}px ${lang} ${theme}`,
          ).toBe(true);
          const outside = await page
            .locator(
              "main button, main input:not(.sr-only), main textarea, header button",
            )
            .evaluateAll((elements) =>
              elements
                .filter((el) => {
                  const box = el.getBoundingClientRect();
                  return (
                    box.width > 0 &&
                    box.height > 0 &&
                    (box.left < -1 || box.right > innerWidth + 1)
                  );
                })
                .map((el) => el.textContent?.slice(0, 60)),
            );
          expect(
            outside,
            `controls outside ${route} ${width}px ${lang} ${theme}`,
          ).toEqual([]);
          if (route === "/" && width !== 300)
            await page.screenshot({
              path: `test-results/redesign-home-${lang}-${theme}-${width}.png`,
              fullPage: true,
            });
        }
      }
    }
  }
  expect(errors).toEqual([]);
});
