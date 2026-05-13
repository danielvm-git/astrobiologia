import { Then, expect } from "../fixtures/base.fixture";

Then("I should see the main navigation", async ({ page }) => {
  await expect(page.locator("nav")).toBeVisible();
});

Then("I should see at least one article card", async ({ page }) => {
  await page.locator("article").first().waitFor({ timeout: 10000 });
  const count = await page.locator("article").count();
  expect(count).toBeGreaterThanOrEqual(1);
});
