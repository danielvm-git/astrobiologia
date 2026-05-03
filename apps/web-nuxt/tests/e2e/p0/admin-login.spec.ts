import { expect, test } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@astrobiologia.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "secure_password_here";
const hasRealAdminCredentials =
  ADMIN_EMAIL !== "admin@astrobiologia.com" ||
  ADMIN_PASSWORD !== "secure_password_here";

test.describe("@p0 Admin login", () => {
  test("[P0] lands on dashboard after successful email/password login", async ({
    page,
  }) => {
    test.skip(
      !hasRealAdminCredentials,
      "Set ADMIN_EMAIL/ADMIN_PASSWORD to run authenticated scenario"
    );

    await page.goto("/admin/login");
    await expect(page).toHaveURL(/admin\/login/);

    await page.getByPlaceholder("E-mail Administrativo").fill(ADMIN_EMAIL);
    await page.getByPlaceholder("Chave de Acesso").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /Entrar no Sistema/i }).click();

    await expect(page).toHaveURL(/admin\/dashboard/, { timeout: 15_000 });
    await expect(
      page.getByRole("heading", { level: 1, name: /Painel de controle/i })
    ).toBeVisible();
  });

  test("[P0] stays on login page after failed login", async ({ page }) => {
    await page.goto("/admin/login");

    await page
      .getByPlaceholder("E-mail Administrativo")
      .fill("hacker@example.com");
    await page.getByPlaceholder("Chave de Acesso").fill("wrong-password");
    await page.getByRole("button", { name: /Entrar no Sistema/i }).click();

    await expect(page).toHaveURL(/admin\/login/, { timeout: 10_000 });
    await expect(
      page.locator("text=/Login falhou|credenciais|Invalid credentials/i")
    ).toBeVisible({
      timeout: 5_000,
    });
  });
});
