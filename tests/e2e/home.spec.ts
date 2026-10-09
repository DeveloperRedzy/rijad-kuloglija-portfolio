import { test, expect } from "@playwright/test";

test("navbar anchors reach their sections", async ({ page }, info) => {
  test.skip(info.project.name === "mobile", "desktop navigation is hidden on mobile; the mobile menu is covered manually");
  await page.goto("/");
  // #work is several viewports tall (stacked chapters), so a smaller visible fraction counts as "reached".
  for (const [name, id, ratio] of [["Work", "work", 0.1], ["About", "about", 0.2], ["Experience", "experience", 0.2], ["Contact", "contact", 0.2]] as const) {
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name, exact: true }).click();
    await expect(page.locator(`#${id}`)).toBeInViewport({ ratio });
  }
});

test("alias anchors #projects and #skills scroll to their targets", async ({ page }) => {
  await page.goto("/#projects");
  await expect(page.locator("#work")).toBeInViewport({ ratio: 0.1 });
  await page.goto("/#skills");
  await expect(page.locator("#skills")).toBeInViewport({ ratio: 0.5 });
});

test("work chapters stack on desktop and flow on mobile", async ({ page }, info) => {
  await page.goto("/");
  const first = page.locator("[data-chapter='liblynx']");
  const position = await first.evaluate((el) => getComputedStyle(el).position);
  expect(position).toBe(info.project.name === "mobile" ? "static" : "sticky");
});

test("email button copies to clipboard", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium", "clipboard permissions are chromium-only");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#contact");
  await page.getByRole("link", { name: /rkuloglija@gmail.com/ }).click();
  await expect(page.getByRole("status")).toHaveText(/Copied to clipboard/);
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("rkuloglija@gmail.com");
});

test("experience expands to all roles", async ({ page }) => {
  await page.goto("/#experience");
  await expect(page.locator("#experience [data-row]")).toHaveCount(5);
  await page.getByRole("button", { name: /Show all/ }).click();
  await expect(page.locator("#experience [data-row]")).toHaveCount(10);
});
