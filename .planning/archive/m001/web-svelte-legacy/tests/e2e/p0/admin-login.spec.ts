/**
 * E2E Regression: Admin Login → Dashboard Redirect
 *
 * Guards against: session cookie race condition after login.
 * The cookie set by the login server action MUST be committed before the
 * dashboard SSR runs. This test catches any regression where the user sees
 * a blank dashboard or is bounced back to the login page.
 *
 * Requirements:
 *   - Dev server running: pnpm dev
 *   - Valid admin credentials in ADMIN_EMAIL / ADMIN_PASSWORD env vars
 *     (falls back to .env values if not set)
 */
import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@astrobiologia.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "secure_password_here";

test.describe("[P0] Admin login → dashboard redirect", () => {
  test("lands on dashboard after successful email/password login", async ({
    page,
  }) => {
    // Arrange — start from the login page with no session
    await page.goto("/admin/login");
    await expect(page).toHaveURL(/admin\/login/);

    // Act — fill credentials using the placeholders visible in the UI
    await page.getByPlaceholder("E-mail Administrativo").fill(ADMIN_EMAIL);
    await page.getByPlaceholder("Chave de Acesso").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /Entrar no Sistema/i }).click();

    // Assert — full-page navigation lands on the dashboard, not back on login
    // Using a generous timeout to allow for the full-page reload + SSR
    await expect(page).toHaveURL(/admin\/dashboard/, { timeout: 15_000 });

    // Guard: the dashboard content is rendered (not a blank page or error)
    await expect(
      page.locator('h1, [data-testid="dashboard"]').first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("stays on login page after failed login", async ({ page }) => {
    // Arrange
    await page.goto("/admin/login");

    // Act — use clearly wrong credentials
    await page
      .getByPlaceholder("E-mail Administrativo")
      .fill("hacker@example.com");
    await page.getByPlaceholder("Chave de Acesso").fill("wrong-password");
    await page.getByRole("button", { name: /Entrar no Sistema/i }).click();

    // Assert — stays on login, error message shown, no cookie leak
    await expect(page).toHaveURL(/admin\/login/, { timeout: 10_000 });
    await expect(page.locator("text=/Login falhou|credenciais/i")).toBeVisible({
      timeout: 5_000,
    });
  });

  test("[P1] already-authenticated user visiting /admin/login is redirected to dashboard", async ({
    page,
    context,
  }) => {
    // Arrange — simulate a logged-in session by setting the cookie
    // (We use the real login flow to get a valid cookie, then verify the redirect)
    await page.goto("/admin/login");
    await page.getByPlaceholder("E-mail Administrativo").fill(ADMIN_EMAIL);
    await page.getByPlaceholder("Chave de Acesso").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /Entrar no Sistema/i }).click();
    await expect(page).toHaveURL(/admin\/dashboard/, { timeout: 15_000 });

    // Act — try to navigate back to login
    await page.goto("/admin/login");

    // Assert — hooks.server.ts redirects back to dashboard
    await expect(page).toHaveURL(/admin\/dashboard/, { timeout: 10_000 });
  });
});
