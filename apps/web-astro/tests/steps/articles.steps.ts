import { When, Then, expect } from "../fixtures/base.fixture";

When("they click on the first article card", async ({ page }) => {
  await page
    .getByTestId("article-card")
    .first()
    .getByRole("link")
    .first()
    .click();
});

Then("they should see the article content", async ({ page }) => {
  await expect(page.getByTestId("article-body")).toBeVisible();
});
