import { test, expect } from "@playwright/test";

test.describe("Admin Login — invalid credentials", () => {
  test.skip("[P1] should show error on invalid credentials", async ({
    page,
  }) => {
    await page.goto("/admin/login");

    await page.getByPlaceholder("Email").fill("wrong@example.com");
    await page.getByPlaceholder("Senha").fill("wrongpass");
    await page.getByRole("button", { name: "Entrar com Email" }).click();

    const errorMsg = page.locator("div", {
      hasText: /E-mail ou senha incorretos/i,
    });
    await expect(errorMsg).toBeVisible();
  });
});
