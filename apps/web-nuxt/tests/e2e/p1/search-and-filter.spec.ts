import { expect, test } from "@playwright/test";

test.describe("@p1 search flow", () => {
  test("user can type a query and submit search", async ({ page }) => {
    await page.goto("/busca");
    await page.getByPlaceholder(/exoplanetas/i).fill("astro");
    await page.getByRole("button", { name: "Buscar" }).click();
    await expect(page).toHaveURL(/q=astro/);
  });

  test("search with a query shows result count line", async ({ page }) => {
    await page.goto("/busca?q=terra");
    await expect(page.getByText(/Resultados para:/i)).toBeVisible();
  });
});
