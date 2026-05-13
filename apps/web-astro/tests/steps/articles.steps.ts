import { When, Then, expect } from "../fixtures/base.fixture";

When("they click on the first article card", async ({ page }) => {
  await page.locator("article a").first().click();
});

Then("they should see the article content", async ({ page }) => {
  await expect(page.locator(".prose")).toBeVisible();
});
