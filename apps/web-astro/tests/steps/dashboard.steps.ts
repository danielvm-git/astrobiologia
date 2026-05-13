import { Then, When, expect } from "../fixtures/base.fixture";

Then("the dashboard should show stat cards", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: /painel de controle/i })
  ).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("Total de Artigos")).toBeVisible();
  await expect(page.getByText("Publicados")).toBeVisible();
  await expect(page.getByText("Rascunhos")).toBeVisible();
  await expect(page.getByText("Categorias")).toBeVisible();
});

When(
  "they click the {string} quick action",
  async ({ page }, action: string) => {
    await page
      .getByRole("link", { name: new RegExp(action, "i") })
      .first()
      .click();
  }
);

Then("they should be on the new article page", async ({ page }) => {
  await page.waitForURL("**/artigos/new", { timeout: 5000 });
});
