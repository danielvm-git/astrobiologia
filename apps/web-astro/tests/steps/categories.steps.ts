import { Then, expect } from "../fixtures/base.fixture";

Then(
  "they should see articles for the {string} category",
  async ({ page }, category: string) => {
    // Check for some category indicator in the UI
    await expect(page.locator("h1")).toContainText(new RegExp(category, "i"));
  }
);

Then("they should see a not-found or empty state message", async ({ page }) => {
  await expect(page.getByTestId("empty-state")).toBeVisible({
    timeout: 10000,
  });
});

Given("the {string} category has no published articles", async () => {
  // no-op: test environment precondition
});
