import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
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
  const authFile = path.join(process.cwd(), "tests/.auth/admin.json");

  if (existsSync(authFile)) {
    // Fast path: inject the session cookie saved by globalSetup (no network round-trip)
    const { cookies } = JSON.parse(readFileSync(authFile, "utf-8"));
    await page.context().addCookies(cookies);
    return;
  }

  // Fallback: per-test login (local dev without pre-seeded auth state)
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "Admin auth state not found. Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD so globalSetup can create tests/.auth/admin.json."
    );
  }
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
