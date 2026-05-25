import { When, Then, expect } from "../fixtures/base.fixture";

When("they select the {string} theme", async ({ page }, theme: string) => {
  await page.getByTestId(`theme-${theme}`).click();
});

When("they reload the page", async ({ page }) => {
  await page.reload();
});

Then(
  "the {string} theme radio should be selected",
  async ({ page }, theme: string) => {
    await expect(page.getByTestId(`theme-${theme}`)).toBeChecked();
  }
);

When("they fill in the account password form", async ({ page }) => {
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!password) throw new Error("E2E_ADMIN_PASSWORD must be set");
  await page.getByTestId("account-current-password").fill(password);
  await page.getByTestId("account-password").fill(password);
  await page.getByTestId("account-password-confirm").fill(password);
});

When("they save the account settings", async ({ page }) => {
  const savedPromise = page.waitForResponse(
    (r) =>
      r.url().includes("/api/admin/account/password") &&
      r.request().method() === "PATCH" &&
      r.ok(),
    { timeout: 15000 }
  );
  await page.getByTestId("account-save").click();
  await savedPromise;
});

When("they fill in the site metadata", async ({ page }) => {
  await page.getByTestId("settings-site-name").fill("Astrobiologia");
  await page
    .getByTestId("settings-tagline")
    .fill("Portal brasileiro de astrobiologia");
  await page
    .getByTestId("settings-description")
    .fill("Notícias e pesquisas sobre a vida no universo.");
});

When("they save the site metadata", async ({ page }) => {
  const savedPromise = page.waitForResponse(
    (r) =>
      r.url().includes("/api/admin/settings") &&
      r.request().method() === "PUT" &&
      r.ok(),
    { timeout: 15000 }
  );
  await page.getByTestId("settings-save").click();
  await savedPromise;
});

Then("they should see a success toast", async ({ page }) => {
  await expect(page.getByTestId("toast-success")).toBeVisible({
    timeout: 10000,
  });
});

When(
  "they fill in the password form with mismatched confirmation",
  async ({ page }) => {
    await page.getByTestId("account-current-password").fill("RealPass123!");
    await page.getByTestId("account-password").fill("NewPass456!");
    await page
      .getByTestId("account-password-confirm")
      .fill("DifferentPass789!");
  }
);

Then("they should see a password mismatch error", async ({ page }) => {
  await expect(page.getByTestId("account-error")).toBeVisible({
    timeout: 5000,
  });
  await expect(page.getByTestId("account-error")).toContainText(
    /não coincidem/i
  );
});
