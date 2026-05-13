import { Then, expect } from "../fixtures/base.fixture";

Then("I should see the main navigation", async ({ page }) => {
  await expect(page.locator("nav")).toBeVisible();
});

Then("I should see at least one article card", async ({ page }) => {
  await expect(page.locator("article")).toHaveCount({ min: 1 });
});
