import { When, Then, expect } from "../fixtures/base.fixture";

Then("the login form should be visible", async ({ page }) => {
  await expect(page.locator("input[type='email']")).toBeVisible();
  await expect(page.locator("input[type='password']")).toBeVisible();
});

When("they submit the login form with valid credentials", async ({ page }) => {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || !password)
    throw new Error(
      "E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD must be set for auth tests"
    );
  await page.locator("input[type='email']").fill(email);
  await page.locator("input[type='password']").fill(password);
  await page.getByRole("button", { name: /entrar/i }).click();
});

Then("they should be redirected to the admin dashboard", async ({ page }) => {
  await page.waitForURL("**/admin", { timeout: 10000 });
  await expect(page.getByRole("heading", { name: /painel/i })).toBeVisible();
});

When(
  "they submit the login form with invalid credentials",
  async ({ page }) => {
    await page.locator("input[type='email']").fill("invalid@test.com");
    await page.locator("input[type='password']").fill("wrongpassword123");
    await page.getByRole("button", { name: /entrar/i }).click();
  }
);

Then("they should see a login error", async ({ page }) => {
  await expect(page.getByTestId("login-error")).toBeVisible({ timeout: 5000 });
});
