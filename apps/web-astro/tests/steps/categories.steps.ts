import { Then, expect } from "../fixtures/base.fixture";

Then(
  "they should see articles for the {string} category",
  async ({ page }, category: string) => {
    // Check for some category indicator in the UI
    await expect(page.locator("h1")).toContainText(new RegExp(category, "i"));
  }
);
