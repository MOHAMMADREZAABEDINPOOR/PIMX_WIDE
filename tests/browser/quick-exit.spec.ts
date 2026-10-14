import { test, expect } from "@playwright/test";

test("quick lock clears session and terminates the worker before replacing the current page with Google", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "pimx:preferences",
      JSON.stringify({ lang: "en", motion: false }),
    );
    let locked = false;
    window.addEventListener("pimx:lock", () => {
      locked = true;
    });
    const NativeWorker = window.Worker;
    window.Worker = class extends NativeWorker {
      terminate() {
        localStorage.setItem("test:worker-terminated", "true");
        super.terminate();
      }
    };
    window.addEventListener("beforeunload", () => {
      localStorage.setItem(
        "test:quick-exit",
        JSON.stringify({
          locked,
          covered: !!document.querySelector(".privacy-overlay"),
          cleared: [
            ...document.querySelectorAll<
              HTMLInputElement | HTMLTextAreaElement
            >("main input, main textarea"),
          ].every((input) => !input.value),
          outputRemoved: !document.querySelector(".recovered-text"),
        }),
      );
    });
  });
  let referrer: string | undefined;
  await page.route("https://www.google.com/**", (route) => {
    referrer = route.request().headers().referer;
    return route.fulfill({
      contentType: "text/html",
      body: "<title>Google fixture</title>",
    });
  });
  await page.goto("/studio");
  await expect(page.locator("#startup-loader")).toHaveCount(0);
  await page.getByPlaceholder("Start here…").fill("Private session content");
  await page
    .getByLabel("Package password", { exact: true })
    .fill("a-long-test-password");
  await page.getByRole("button", { name: "Create encrypted package" }).click();
  await expect(page.getByLabel("Portable package")).toBeVisible();
  const length = await page.evaluate(() => history.length);
  await page.getByRole("button", { name: "Quick lock", exact: true }).click();
  await expect(page).toHaveURL("https://www.google.com/");
  expect(await page.evaluate(() => history.length)).toBe(length);
  expect(referrer).toBeUndefined();
  await page.goto("/studio");
  const result = await page.evaluate(() => ({
    exit: JSON.parse(localStorage.getItem("test:quick-exit") || "{}"),
    worker: localStorage.getItem("test:worker-terminated"),
  }));
  expect(result.exit).toEqual({
    locked: true,
    covered: false,
    cleared: true,
    outputRemoved: true,
  });
  expect(result.worker).toBe("true");
  await expect(page.getByPlaceholder("Start here…")).toHaveValue("");
});

test("the quick lock keyboard shortcut opens Google", async ({ page }) => {
  await page.route("https://www.google.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<title>Google fixture</title>",
    }),
  );
  await page.goto("/");
  await expect(page.locator("#startup-loader")).toHaveCount(0);
  await page.keyboard.press("Control+Shift+l");
  await expect(page).toHaveURL("https://www.google.com/");
});

test("slow Google navigation never displays the lock screen or private content", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.addEventListener("beforeunload", () => {
      localStorage.setItem(
        "test:slow-exit",
        JSON.stringify({
          locked: !!document.querySelector(".privacy-overlay"),
          content: document.getElementById("root")?.innerHTML,
        }),
      );
    });
  });
  await page.route("https://www.google.com/**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3100));
    await route.fulfill({
      contentType: "text/html",
      body: "<title>Google fixture</title>",
    });
  });
  await page.goto("/");
  await expect(page.locator("#startup-loader")).toHaveCount(0);
  await page.locator(".privacy-button").click();
  await expect(page).toHaveURL("https://www.google.com/");
  await page.goto("/");
  const outgoing = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("test:slow-exit") || "{}"),
  );
  expect(outgoing).toEqual({ locked: false, content: "" });
});

test("automatic idle locking covers the app without navigating away", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "pimx:preferences",
      JSON.stringify({ lang: "en", motion: false, idle: 1 }),
    ),
  );
  await page.clock.install();
  await page.goto("/");
  await expect(page.locator("#startup-loader")).toHaveCount(0);
  await page.clock.fastForward(70000);
  await expect(page.locator(".privacy-overlay")).toBeVisible();
  await expect(page).not.toHaveURL(/google\.com/);
});
