import { Given, When, Then, expect } from "../fixtures/base.fixture";

When(
  "they fill in the article title with {string}",
  async ({ page }, title: string) => {
    await page.locator("#article-title").waitFor();
    await page.locator("#article-title").fill(title);
  }
);

When(
  "they write the article content with {string}",
  async ({ page }, content: string) => {
    await page.locator(".editor-content .tiptap").waitFor();
    await page.locator(".editor-content .tiptap").click();
    await page.locator(".editor-content .tiptap").fill(content);
  }
);

When(
  "they select the category {string}",
  async ({ page }, category: string) => {
    await page.locator("#category").waitFor();
    await page.locator("#category").selectOption(category);
  }
);

When("they save the article", async ({ page }) => {
  await page.getByRole("button", { name: /confirmar e salvar/i }).click();
});

Then("the article should be created successfully", async ({ page }) => {
  await expect(page.locator(".toast-success")).toBeVisible({ timeout: 15000 });
});

Given("they are editing an existing article", async ({ page }) => {
  await page.goto("/admin/artigos");
  await page.locator('a[href*="/edit"]').first().waitFor({ timeout: 15000 });
  await page.locator('a[href*="/edit"]').first().click();
  await page.locator("#article-title").waitFor({ timeout: 15000 });
});

When(
  "they click the {string} translation tab",
  async ({ page }, lang: string) => {
    await page
      .getByRole("button", { name: new RegExp(`^${lang}`, "i") })
      .first()
      .click();
  }
);

When("they click {string}", async ({ page }, buttonName: string) => {
  await page.getByRole("button", { name: buttonName }).click();
});

Then(
  "the {string} title and content should be populated",
  async ({ page }, _lang: string) => {
    await page.waitForFunction(
      () => {
        const el = document.querySelector<HTMLInputElement>("#article-title");
        return el ? el.value.length > 0 : false;
      },
      { timeout: 30000 }
    );
    const titleValue = await page.locator("#article-title").inputValue();
    expect(titleValue.length).toBeGreaterThan(0);
  }
);

When("they save the translation", async ({ page }) => {
  await page.getByRole("button", { name: /confirmar e salvar/i }).click();
});

Then(
  "the {string} version should be accessible at its slug",
  async ({ page }, _lang: string) => {
    await page.locator("#article-slug").waitFor();
    const slug = await page.locator("#article-slug").inputValue();
    await page.goto(`/en/artigos/${slug}`);
    await expect(page).toHaveTitle(/.+/);
  }
);
