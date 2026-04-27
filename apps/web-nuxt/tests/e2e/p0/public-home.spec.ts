import { expect, test } from "@playwright/test";

test.describe("@p0 Home", () => {
  test("[P0] loads hero and primary navigation", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Explorando a Vida no Universo|Exploring Life in the Universe/i,
      })
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: /Todos|All/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: /Últimas Reportagens|Latest Stories/i,
      })
    ).toBeVisible();
  });
});
