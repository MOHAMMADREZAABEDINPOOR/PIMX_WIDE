import { test, expect } from "@playwright/test";

test("data paths, project modules and reading checklist respond to user choices", async ({
  page,
}) => {
  await page.goto("/privacy");
  for (let i = 0; i < 5; i++) {
    await page.locator(".map-controls button").nth(i).click();
    await expect(page.locator(`#path-detail .path-art-${i}`)).toBeVisible();
    await expect(page.locator("#path-detail .privacy-path-art")).toHaveCount(1);
  }
  const analytics = page.getByRole("button", { name: /آمار بازدید/ });
  await analytics.click();
  await expect(analytics).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#path-detail")).toContainText(
    "آمار روی این دستگاه خاموش است",
  );
  await page.locator("#path-detail a").click();
  await expect(page).toHaveURL(/\/settings$/);
  await page.getByRole("checkbox", { name: /آمار اختیاری بازدید/ }).check();
  await page.goto("/privacy");
  await page.getByRole("button", { name: /آمار بازدید/ }).click();
  await expect(page.locator("#path-detail")).toContainText(
    "آمار روی این دستگاه روشن است",
  );
  await page.goto("/about");
  await page.getByRole("button", { name: /کارگاه رمزها/ }).click();
  await expect(page.locator("#module-detail h3")).toHaveText("کارگاه رمزها");
  await expect(page.locator("#module-detail .visual-key")).toBeVisible();
  await page.getByRole("link", { name: "بازکردن ابزار" }).click();
  await expect(page).toHaveURL(/\/passwords$/);
  await page.goto("/terms");
  await page.emulateMedia({ reducedMotion: "reduce" });
  const contents = page.getByRole("navigation", {
    name: "فهرست شرایط استفاده",
  });
  await contents.getByRole("link").last().click();
  await expect(contents.getByRole("link").last()).toHaveAttribute(
    "aria-current",
    "location",
  );
  for (const checkbox of await page.locator(".clause-check input").all())
    await checkbox.check();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "4",
  );
  await expect(page.locator(".terms-end h2")).toHaveText("مرور تو کامل شد.");
  await page.reload();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "0",
  );
});

test("legacy accent preferences migrate to gold and custom illustrations respect reduced motion", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem(
      "pimx:preferences",
      JSON.stringify({ accent: "violet", motion: true }),
    ),
  );
  await page.goto("/about");
  await expect(page.locator("html")).toHaveAttribute("data-accent", "gold");
  await expect
    .poll(() => page.locator(".engine-art").getAttribute("data-visible"))
    .toBe("true");
  await page.locator(".workshop-exit").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator(".engine-art .information-art-object")
        .evaluate((el) => getComputedStyle(el).animationPlayState),
    )
    .toBe("paused");
  await page.locator(".engine-art").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator(".engine-art .information-art-object")
        .evaluate((el) => getComputedStyle(el).animationPlayState),
    )
    .toBe("running");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() =>
      page
        .locator(".engine-art .information-art-object")
        .evaluate((el) => getComputedStyle(el).animationName),
    )
    .toBe("none");
  await expect
    .poll(() => page.locator(".engine-art").getAttribute("data-visible"))
    .toBe("false");
});
