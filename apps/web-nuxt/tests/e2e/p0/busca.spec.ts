import { expect, test } from "@playwright/test";

test.describe("@p0 Busca", () => {
  test("[P0] search page renders form and heading", async ({ page }) => {
    await page.goto("/busca");

    await expect(
      page.getByRole("heading", { level: 1, name: "Busca Global" })
    ).toBeVisible();
    await expect(page.getByPlaceholder(/exoplanetas/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "Buscar" })).toBeVisible();
  });

  test("[P0] empty query shows no results section copy", async ({ page }) => {
    await page.goto("/busca");

    await expect(page.getByText(/Digite um termo/i)).toBeVisible();
  });
});
