import { Given, When, Then, expect } from "../fixtures/base.fixture";

Given("the user is on the homepage", async ({ page }) => {
  await page.goto("/");
});

Given("the user navigates to {string}", async ({ page }, url: string) => {
  await page.goto(url);
});

When("they navigate to {string}", async ({ page }, url: string) => {
  await page.goto(url);
});

Given("the user is logged in as admin", async ({ page }) => {
  // TODO: Implement actual login logic once auth is migrated
  await page.goto("/admin/login");
});

Then(
  "the page title should contain {string}",
  async ({ page }, title: string) => {
    await expect(page).toHaveTitle(new RegExp(title));
  }
);
