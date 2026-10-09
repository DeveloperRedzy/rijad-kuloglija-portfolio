import { test, expect } from "@playwright/test";

const routes: Array<[string, RegExp]> = [
  ["/", /Software that keeps working after launch/],
  ["/work/liblynx/", /LibLynx report builder/],
  ["/work/din-solution/", /DIN Solution/],
  ["/work/neo-labs/", /Neo Labs/],
  ["/work/arkona/", /Arkona \+ GumaMax/],
  ["/work/nepa-invest/", /Nepa Invest/],
];

for (const [path, h1] of routes) {
  test(`${path} renders its H1`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(h1);
  });
}

test("case study links to next project and back to work", async ({ page }) => {
  await page.goto("/work/nepa-invest/");
  await expect(page.getByRole("link", { name: /Next · 01/ })).toHaveAttribute("href", "/work/liblynx/");
  await page.getByRole("link", { name: /All work/ }).first().click();
  await expect(page).toHaveURL(/\/#work$/);
});
