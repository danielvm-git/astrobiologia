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
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD env vars are required for admin tests"
    );
  }
  await page.goto("/admin/login");
  const res = await page.request.post("/api/auth/login", {
    data: { email, password },
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok()) {
    throw new Error(`Admin login failed with status ${res.status()}`);
  }
});

Then(
  "the page title should contain {string}",
  async ({ page }, title: string) => {
    await expect(page).toHaveTitle(new RegExp(title));
  }
);
