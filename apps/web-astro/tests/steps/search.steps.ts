import { When, Then, expect } from "../fixtures/base.fixture";

When("they search for {string}", async ({ page }, query: string) => {
  await page.getByPlaceholder(/pesquisar/i).fill(query);
  await page.keyboard.press("Enter");
});

Then("they should see relevant results", async ({ page }) => {
  await expect(page.locator("article")).toHaveCount({ min: 1 });
});
