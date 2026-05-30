import { Given, When, Then, expect } from "../fixtures/base.fixture";
import {
  ensureSeedPublishedArticle,
  unpublishAllArticles,
} from "../helpers/appwriteTestClient";
import { requireE2eAdminCredentials } from "../helpers/e2eEnv";

Given("the user is on the homepage", async ({ page }) => {
  await ensureSeedPublishedArticle();
  await page.goto("/");
});

Given("the user navigates to {string}", async ({ page }, url: string) => {
  if (url === "/artigos" || url === "/") {
    await ensureSeedPublishedArticle();
  }
  await page.goto(url);
});

When("they navigate to {string}", async ({ page }, url: string) => {
  await page.goto(url);
});

Given("the user is logged in as admin", async ({ page }) => {
  // Admin projects load storageState from auth.setup; verify session is valid.
  await page.goto("/admin");
  if (!page.url().includes("/admin/login")) return;

  const { email, password } = requireE2eAdminCredentials();
  await page.goto("/admin/login");
  const status = await page.evaluate(
    async ({ email: e, password: p }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e, password: p }),
      });
      return res.status;
    },
    { email, password }
  );
  if (status !== 200) {
    throw new Error(`Admin login failed with status ${status}`);
  }
});

Then(
  "the page title should contain {string}",
  async ({ page }, title: string) => {
    await expect(page).toHaveTitle(new RegExp(title));
  }
);

Given("the user is not logged in", async ({ page }) => {
  await page.context().clearCookies();
});

Then("they should be redirected to {string}", async ({ page }, url: string) => {
  await page.waitForURL(new RegExp(url.replace(/\//g, "\\/")), {
    timeout: 10000,
  });
});

Given("no articles are published", async () => {
  await unpublishAllArticles();
});

Then("they should see a not-found message", async ({ page }) => {
  // Check for 404 response or not-found indicator
  await expect(page.locator("body")).toContainText(/não encontrado/i);
});

Then("they should see an empty state message", async ({ page }) => {
  await expect(page.getByTestId("empty-state")).toBeVisible({ timeout: 10000 });
});

Then("they should see a validation error", async ({ page }) => {
  await expect(page.getByTestId("title-error")).toBeVisible({ timeout: 5000 });
});

Then(
  "they should see a validation prompt or all articles",
  async ({ page }) => {
    await expect(page.locator("body")).toContainText(/pesquisar/i);
  }
);
