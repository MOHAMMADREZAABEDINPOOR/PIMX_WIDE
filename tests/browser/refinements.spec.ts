import { test, expect } from "@playwright/test";

test("light artwork, page sculptures and real review checkboxes match the selected theme", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "تغییر تم", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator(".sealed-package")).toHaveCSS(
    "background-color",
    "rgb(223, 189, 122)",
  );
  await page.screenshot({
    path: "test-results/light-home.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.goto("/privacy");
  await expect(page.locator(".visual-privacy .window-front")).toHaveCSS(
    "background-color",
    "rgb(255, 253, 247)",
  );
  await page.screenshot({
    path: "test-results/light-privacy.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.goto("/about");
  await expect(page.locator(".engine-art img")).toHaveAttribute(
    "src",
    /pimx-engine-light\.svg$/,
  );
  for (const [i, kind] of ["cipher", "archive", "key", "relay"].entries()) {
    await page.locator(".bench-modules button").nth(i).click();
    await expect(page.locator(`#module-detail .visual-${kind}`)).toBeVisible();
    const framing = await page
      .locator(`#module-detail .visual-${kind}`)
      .evaluate((el) => {
        const frame = el.getBoundingClientRect(),
          object = el.querySelector(".system-object")!.getBoundingClientRect();
        return {
          top: object.top - frame.top,
          bottom: frame.bottom - object.bottom,
        };
      });
    expect(framing.top).toBeGreaterThanOrEqual(-1);
    expect(framing.bottom).toBeGreaterThanOrEqual(-1);
  }
  await page.screenshot({
    path: "test-results/light-about.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.goto("/terms");
  await expect(page.locator(".seal-art img")).toHaveAttribute(
    "src",
    /terms-seal-light\.svg$/,
  );
  const check = page.locator(".clause-check input").first();
  await check.check();
  const bounds = await check.evaluate((el) => {
    const parent = el.getBoundingClientRect(),
      tick = getComputedStyle(el, "::after");
    return {
      width: parent.width,
      left: parseFloat(tick.left),
      tickWidth: parseFloat(tick.width),
    };
  });
  expect(bounds.left + bounds.tickWidth).toBeLessThan(bounds.width);
  await expect(check).toHaveCSS("border-radius", "5px");
  await page.screenshot({
    path: "test-results/light-terms.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.goto("/studio");
  await expect(page.locator(".output-empty .visual-cipher")).toBeVisible();
  await expect(page.locator(".vault-scene")).toHaveCount(0);
  await page.goto("/vault");
  await expect(page.locator(".unlock-art .visual-archive")).toBeVisible();
  await expect(page.locator(".vault-scene")).toHaveCount(0);
});

test("mobile menu opens and closes smoothly and footer links stay usable at 300px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 300, height: 800 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "بازکردن منو", exact: true });
  const nav = page.locator("#main-navigation");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(nav).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(nav).toHaveCSS("opacity", "1");
  expect(
    await nav.evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toContain("0.35s");
  await page.screenshot({
    path: "test-results/mobile-menu-300.png",
    animations: "disabled",
  });
  await page.keyboard.press("Escape");
  await expect(nav).toBeHidden();
  await toggle.click();
  await nav
    .getByRole("button", { name: "استودیوی رمزنگاری", exact: true })
    .click();
  await expect(page).toHaveURL(/\/studio$/);
  await expect(nav).toBeHidden();
  await page.locator(".site-footer").scrollIntoViewIfNeeded();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(
    page
      .getByRole("contentinfo")
      .getByRole("link", { name: "تنظیمات", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/footer-mobile-300.png",
    fullPage: true,
    animations: "disabled",
  });
  await page
    .getByRole("contentinfo")
    .getByRole("button", { name: "حریم خصوصی", exact: true })
    .click();
  await expect(page).toHaveURL(/\/privacy$/);
});
