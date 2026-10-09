import { test, expect } from "@playwright/test";

test("CV page renders and links the PDF", async ({ page }) => {
  await page.goto("/cv/");
  await expect(page.locator("h1")).toHaveText("Rijad Kuloglija");
  const pdf = page.getByRole("link", { name: "Download PDF" });
  await expect(pdf).toHaveAttribute("href", "/Rijad-Kuloglija-CV.pdf");
  const res = await page.request.get("/Rijad-Kuloglija-CV.pdf");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("pdf");
});
