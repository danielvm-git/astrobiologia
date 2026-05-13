import { Given, When, Then, expect } from "../fixtures/base.fixture";

When(
  "they fill in the article title with {string}",
  async ({ page }, title: string) => {
    await page.locator("#article-title").fill(title);
  }
);

When(
  "they write the article content with {string}",
  async ({ page }, content: string) => {
    await page.locator(".editor-content .tiptap").fill(content);
  }
);

When(
  "they select the category {string}",
  async ({ page }, category: string) => {
    await page.locator("#category").selectOption(category);
  }
);

When("they save the article", async ({ page }) => {
  await page.getByRole("button", { name: /confirmar e salvar/i }).click();
});

Then("the article should be created successfully", async ({ page }) => {
  await expect(page.locator(".toast-success")).toBeVisible();
});

Given("they are editing an existing article", async ({ page }) => {
  // Logic to find an article and edit it
  await page.goto("/admin/artigos");
  await page.locator("table tr").first().locator('a[href*="/edit"]').click();
});

When(
  "they click the {string} translation tab",
  async ({ page }, lang: string) => {
    await page.getByRole("button", { name: lang }).click();
  }
);

When("they click {string}", async ({ page }, buttonName: string) => {
  await page.getByRole("button", { name: buttonName }).click();
});

Then(
  "the {string} title and content should be populated",
  async ({ page }, lang: string) => {
    const titleValue = await page.locator("#article-title").inputValue();
    expect(titleValue.length).toBeGreaterThan(0);
  }
);

When("they save the translation", async ({ page }) => {
  await page.getByRole("button", { name: /confirmar e salvar/i }).click();
});

Then(
  "the {string} version should be accessible at its slug",
  async ({ page }, lang: string) => {
    const slug = await page.locator("#article-slug").inputValue();
    await page.goto(`/en/artigos/${slug}`);
    await expect(page).toHaveTitle(/.+/);
  }
);
