import { test, expect } from "@playwright/test";

/**
 * P0 — Public home (default locale `pt-br` has no `/en/` prefix).
 * Uses copy from `messages/pt-br.json` (`hero_title`).
 */
test.describe("@p0 Home", () => {
  test("[P0] loads hero and primary navigation", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Explorando a Vida no Universo/i,
      })
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: /ASTROBIOLOGIA/i }).first()
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { level: 2, name: /Últimas Reportagens/i })
    ).toBeVisible();
  });
});
