import { Given, When, Then, expect } from "../fixtures/base.fixture";

When(
  "they fill in the article title with {string}",
  async ({ page }, title: string) => {
    const fullTitle = `${title} ${Date.now()} ${Math.floor(Math.random() * 10000)}`;
    await page.getByTestId("article-title").waitFor();
    await page.getByTestId("article-title").fill(fullTitle);
    await page.getByTestId("article-title").blur(); // Trigger autoSlug
    await expect(page.getByTestId("article-slug")).not.toHaveValue("", {
      timeout: 5000,
    });
  }
);

When(
  "they write the article content with {string}",
  async ({ page }, content: string) => {
    const editor = page.getByTestId("article-editor");
    await editor.locator('[contenteditable="true"]').click();
    await editor.locator('[contenteditable="true"]').fill(content);
  }
);

When(
  "they select the category {string}",
  async ({ page }, category: string) => {
    await page.getByTestId("category-select").waitFor();
    await page.getByTestId("category-select").selectOption(category);
  }
);

When(
  "they set the article status to {string}",
  async ({ page }, status: string) => {
    const value = status.toLowerCase() === "publicado" ? "published" : "draft";
    await page.getByTestId("status-select").selectOption(value);
  }
);

When("they save the article", async ({ page, createdArticleIds }) => {
  const savedPromise = page.waitForResponse(
    (r) =>
      r.url().includes("/api/admin/articles") &&
      r.request().method() === "POST" &&
      r.ok(),
    { timeout: 30000 }
  );
  await page.getByRole("button", { name: /confirmar e salvar/i }).click();
  const response = await savedPromise;
  const body = await response.json();
  if (body.id) createdArticleIds.push(body.id);
});

Then("the article should be created successfully", async ({ page }) => {
  await expect(page.getByTestId("toast-success")).toBeVisible({
    timeout: 15000,
  });
});

Given(
  "they are editing an existing article",
  async ({ page, createdArticleIds }) => {
    // Create a fresh article first to ensure we have one to edit and it gets cleaned up
    await page.goto("/admin/artigos/new");
    await page.getByTestId("article-title").waitFor({ timeout: 10000 });
    const title = `Artigo para Tradução ${Date.now()}`;
    await page.getByTestId("article-title").fill(title);
    await page.getByTestId("article-title").blur();

    const editor = page.getByTestId("article-editor");
    await editor.locator('[contenteditable="true"]').click();
    await editor
      .locator('[contenteditable="true"]')
      .fill("Conteúdo de teste para tradução.");

    const savedPromise = page.waitForResponse(
      (r) =>
        r.url().includes("/api/admin/articles") &&
        r.request().method() === "POST" &&
        r.ok()
    );
    await page.getByRole("button", { name: /confirmar e salvar/i }).click();
    const response = await savedPromise;
    const body = await response.json();
    if (body.id) createdArticleIds.push(body.id);

    // Wait for the post-save redirect to the edit page before proceeding
    await page.waitForURL(/\/admin\/artigos\/.+\/edit/, { timeout: 10000 });
    await page.getByTestId("article-title").waitFor({ timeout: 10000 });
    // Ensure the article data is loaded from the server
    await expect(page.getByTestId("article-title")).not.toHaveValue("", {
      timeout: 15000,
    });
  }
);

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
    await expect(page.getByTestId("article-title")).not.toHaveValue("", {
      timeout: 30000,
    });
  }
);

When("they save the translation", async ({ page }) => {
  const savedPromise = page.waitForResponse(
    (r) =>
      /\/api\/admin\/articles\/[^/]+$/.test(r.url()) &&
      r.request().method() === "PUT" &&
      r.ok(),
    { timeout: 30000 }
  );
  await page.getByRole("button", { name: /confirmar e salvar/i }).click();
  await savedPromise;
  await expect(page.getByTestId("toast-success")).toBeVisible();
});

const LANG_LOCALE: Record<string, string> = {
  english: "en",
  spanish: "es",
  japanese: "ja",
  dutch: "nl",
  chinese: "zh",
};

Then(
  "the {string} version should be accessible at its slug",
  async ({ page }, lang: string) => {
    const locale =
      LANG_LOCALE[lang.toLowerCase()] ?? lang.toLowerCase().slice(0, 2);
    const tabLabel = locale.toUpperCase();
    // Re-select the translation tab — editor may reset to PT-BR after save
    await page
      .getByRole("button", { name: new RegExp(`^${tabLabel}`, "i") })
      .first()
      .click();
    await expect(page.getByTestId("article-slug")).not.toHaveValue("", {
      timeout: 10000,
    });
    const slug = await page.getByTestId("article-slug").inputValue();
    await page.goto(`/${locale}/artigos/${slug}`);
    await expect(page.getByTestId("article-body")).toBeVisible({
      timeout: 20000,
    });
  }
);
