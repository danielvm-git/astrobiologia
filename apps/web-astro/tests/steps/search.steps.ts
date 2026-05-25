import { When, Then, expect } from "../fixtures/base.fixture";

When("they search for {string}", async ({ page }, query: string) => {
  await page.getByPlaceholder(/pesquisar/i).fill(query);
  await Promise.all([
    page.waitForURL((url) => url.searchParams.has("q")),
    page.keyboard.press("Enter"),
  ]);
});

Then("they should see relevant results", async ({ page }) => {
  await expect(page.locator("article").first()).toBeVisible({ timeout: 10000 });
  const count = await page.locator("article").count();
  expect(count).toBeGreaterThanOrEqual(1);
});

Then("they should see a no-results message", async ({ page }) => {
  await expect(page.getByTestId("no-results")).toBeVisible({
    timeout: 10000,
  });
});
