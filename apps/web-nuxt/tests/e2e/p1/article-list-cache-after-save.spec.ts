import { expect, test } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@astrobiologia.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "secure_password_here";
const hasRealAdminCredentials =
  ADMIN_EMAIL !== "admin@astrobiologia.com" ||
  ADMIN_PASSWORD !== "secure_password_here";

async function loginAsAdmin(page: import("@playwright/test").Page) {
  await page.goto("/pt-br/admin/login");
  await page.getByPlaceholder("E-mail Administrativo").fill(ADMIN_EMAIL);
  await page.getByPlaceholder("Chave de Acesso").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /Entrar no Sistema/i }).click();
  await expect(page).toHaveURL(/admin\/dashboard/, { timeout: 15_000 });
}

/**
 * Regression: after saving an article the admin list page was showing stale
 * language-indicator data because Nuxt 3.21's useAsyncData caches results in
 * nuxtApp.payload.data["admin-articles"] and the save/redirect flow never
 * cleared that cache.  The delete flow had the same problem but worked around
 * it by calling refresh() explicitly.
 *
 * Fix: clearNuxtData("admin-articles") in edit.vue handleSave so that the
 * list page always re-fetches after a successful save.
 */
test.describe("@p1 Article list – language indicators after save", () => {
  test("[P1] articles list re-fetches after saving an edit (cache invalidation)", async ({
    page,
  }) => {
    test.skip(
      !hasRealAdminCredentials,
      "Set ADMIN_EMAIL/ADMIN_PASSWORD to run authenticated scenario"
    );

    await loginAsAdmin(page);

    // Navigate to articles list so the Nuxt payload cache is populated
    await page.goto("/pt-br/admin/artigos");
    await expect(page.getByRole("heading", { name: /ARTIGOS/i })).toBeVisible({
      timeout: 10_000,
    });

    // Find the target article row and click Edit
    const articleRow = page
      .locator("tr")
      .filter({ hasText: "O físico que construía pontes" });
    await expect(articleRow).toBeVisible({ timeout: 10_000 });
    await articleRow.getByTitle("Editar").click();

    // Wait for edit page
    await expect(page).toHaveURL(/admin\/artigos\/.+\/edit/, {
      timeout: 10_000,
    });
    await expect(
      page.getByRole("heading", { level: 1, name: /Editar Artigo/i })
    ).toBeVisible({ timeout: 10_000 });

    // Set up network watcher BEFORE triggering save so we don't miss it
    const listApiRefetch = page.waitForRequest(
      (req) =>
        req.url().includes("/api/admin/articles/list") &&
        req.method() === "GET",
      { timeout: 15_000 }
    );

    // Save without any changes
    await page.getByRole("button", { name: /Confirmar e Salvar/i }).click();

    // The list page MUST issue a fresh GET to /api/admin/articles/list –
    // if the Nuxt payload cache is stale this request will never happen and
    // the test will time out here.
    await listApiRefetch;

    // Verify we are back on the articles list
    await expect(page).toHaveURL(/admin\/artigos(?!\/)/, { timeout: 10_000 });
    await expect(page.getByRole("heading", { name: /ARTIGOS/i })).toBeVisible();
  });
});
