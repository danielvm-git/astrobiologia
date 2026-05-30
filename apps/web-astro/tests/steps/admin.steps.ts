import { Given, When, Then, expect } from "../fixtures/base.fixture";
import {
  createArticleViaUi,
  clickSaveArticleButton,
  expectArticleEditorTitleLoaded,
  expectArticleSaveSuccess,
  expectLocaleTabActive,
} from "../helpers/createArticleViaUi";

When(
  "they fill in the article title with {string}",
  async ({ page }, title: string) => {
    const fullTitle = `${title} ${Date.now()} ${Math.floor(Math.random() * 10000)}`;
    await page.getByTestId("article-title").waitFor();
    await page.getByTestId("article-title").fill(fullTitle);
    await page.getByTestId("article-title").blur();
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
  const body = await clickSaveArticleButton(page, "auto");
  if (body.id) createdArticleIds.push(body.id);
});

Then("the article should be created successfully", async ({ page }) => {
  await expectArticleSaveSuccess(page);
});

Given(
  "they are editing an existing article",
  async ({ page, createdArticleIds }) => {
    await createArticleViaUi(page, createdArticleIds, {
      title: `Artigo para Tradução ${Date.now()}`,
      content: "Conteúdo de teste para tradução.",
    });
    await expectArticleEditorTitleLoaded(page);
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
  await clickSaveArticleButton(page, "PUT");
  await expectArticleSaveSuccess(page);
});

When("they save the article without filling in the title", async ({ page }) => {
  await page.getByRole("button", { name: /confirmar e salvar/i }).click();
});

Then(
  "they should see a validation error for the title field",
  async ({ page }) => {
    await expect(page.getByTestId("title-error")).toBeVisible({
      timeout: 5000,
    });
  }
);

Then("the PT-BR translation tab should be active", async ({ page }) => {
  await expectLocaleTabActive(page, "pt-br");
});

Given("an existing article exists", async ({ page, createdArticleIds }) => {
  await createArticleViaUi(page, createdArticleIds, {
    title: `Existing Article ${Date.now()}`,
    content: "Conteúdo de teste.",
  });
});

When("they navigate to edit the article", async ({ page }) => {
  await page.goto("/admin/artigos");
  await page
    .getByTestId("article-edit-link")
    .first()
    .waitFor({ timeout: 10000 });
  await page.getByTestId("article-edit-link").first().click();
  await page.waitForURL(/\/admin\/artigos\/.+\/edit/, { timeout: 10000 });
  await page.getByTestId("article-title").waitFor({ timeout: 10000 });
});

When("they remember the article slug", async ({ page }) => {
  const slug = await page.getByTestId("article-slug").inputValue();
  await page.evaluate((value) => {
    sessionStorage.setItem("e2e-remembered-slug", value);
  }, slug);
});

When(
  "they update the article title with {string}",
  async ({ page }, newTitle: string) => {
    await page.getByTestId("article-title").fill(newTitle);
  }
);

Then("the article should be updated successfully", async ({ page }) => {
  await expectArticleSaveSuccess(page);
});

Then("the article slug should be unchanged", async ({ page }) => {
  const remembered = await page.evaluate(() =>
    sessionStorage.getItem("e2e-remembered-slug")
  );
  await expect(page.getByTestId("article-slug")).toHaveValue(remembered ?? "");
});

When("they clear the translation content", async ({ page }) => {
  const editor = page.getByTestId("article-editor");
  await editor.locator('[contenteditable="true"]').fill("");
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
