import { test, expect } from "@playwright/test";

const BUTTON = 'section[aria-label="Companies"] button[aria-pressed]';
const TRACK = 'section[aria-label="Companies"] ul';

test("the company marquee can be paused and resumed (WCAG 2.2.2)", async ({ page }, info) => {
  test.skip(info.project.name === "reduced-motion");
  await page.addInitScript(() => sessionStorage.setItem("redzy:loaded", "1"));
  await page.goto("/");
  const button = page.locator(BUTTON);
  await button.scrollIntoViewIfNeeded();
  await expect(button).toHaveAttribute("aria-pressed", "false");
  const box = (await button.boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
  const playState = () => page.locator(TRACK).evaluate((el) => getComputedStyle(el).animationPlayState);
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-pressed", "true");
  expect(await playState()).toBe("paused");
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "false");
  await expect.poll(playState).toBe("running");
  if (info.project.name === "desktop") {
    await page.locator(TRACK).hover({ force: true }); // the track is always moving, so never "stable"
    await expect.poll(playState).toBe("paused");
  }
});

test("reduced motion: the strip is static and has no pause control", async ({ page }, info) => {
  test.skip(info.project.name !== "reduced-motion");
  await page.goto("/");
  await expect(page.locator(BUTTON)).toBeHidden();
  expect(await page.locator(TRACK).evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
});
