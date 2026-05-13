import { Given, When, Then, expect } from "../fixtures/base.fixture";

When(
  "they fill in the article title with {string}",
  async ({ page }, title: string) => {
    await page.getByTestId("article-title").waitFor();
    await page.getByTestId("article-title").fill(`${title} ${Date.now()}`);
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

When("they save the article", async ({ page, createdArticleIds }) => {
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
});

Then("the article should be created successfully", async ({ page }) => {
  await expect(page.getByTestId("toast-success")).toBeVisible({
    timeout: 15000,
  });
});

Given("they are editing an existing article", async ({ page }) => {
  const listLoaded = page.waitForResponse(
    (r) =>
      r.url().includes("/api/admin/articles") &&
      r.request().method() === "GET" &&
      r.ok()
  );
  await page.goto("/admin/artigos");
  await listLoaded;

  const articleLoaded = page.waitForResponse(
    (r) =>
      /\/api\/admin\/articles\/[^/]+$/.test(r.url()) &&
      r.request().method() === "GET" &&
      r.ok()
  );
  await page.getByTestId("article-edit-link").first().click();
  await articleLoaded;
  await page.getByTestId("article-title").waitFor();
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
    await expect(page.getByTestId("article-title")).not.toHaveValue("", {
      timeout: 30000,
    });
  }
);

When("they save the translation", async ({ page }) => {
  await page.getByRole("button", { name: /confirmar e salvar/i }).click();
});

Then(
  "the {string} version should be accessible at its slug",
  async ({ page }, _lang: string) => {
    await page.getByTestId("article-slug").waitFor();
    const slug = await page.getByTestId("article-slug").inputValue();
    await page.goto(`/en/artigos/${slug}`);
    await expect(page.getByTestId("article-body")).toBeVisible();
  }
);
