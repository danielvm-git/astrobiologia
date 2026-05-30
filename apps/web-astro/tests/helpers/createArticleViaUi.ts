import { expect, type Page } from "@playwright/test";

type CreateArticleViaUiOptions = {
  title: string;
  content?: string;
  waitForEditPage?: boolean;
};

export type SaveArticleMethod = "POST" | "PUT" | "auto";

export type SaveArticleResponse = {
  id?: string;
  success?: boolean;
  error?: string;
};

function isArticleSaveResponse(value: unknown): value is SaveArticleResponse {
  return typeof value === "object" && value !== null;
}

export async function clickSaveArticleButton(
  page: Page,
  method: SaveArticleMethod = "auto"
): Promise<SaveArticleResponse> {
  const savedPromise = page.waitForResponse(
    (r) => {
      if (!r.url().includes("/api/admin/articles") || !r.ok()) return false;
      const requestMethod = r.request().method();
      if (method === "POST") return requestMethod === "POST";
      if (method === "PUT") {
        return (
          requestMethod === "PUT" &&
          /\/api\/admin\/articles\/[^/]+$/.test(r.url())
        );
      }
      return (
        requestMethod === "POST" ||
        (requestMethod === "PUT" &&
          /\/api\/admin\/articles\/[^/]+$/.test(r.url()))
      );
    },
    { timeout: 30000 }
  );
  await page.getByRole("button", { name: /confirmar e salvar/i }).click();
  const response = await savedPromise;
  const body: unknown = await response.json();
  if (!isArticleSaveResponse(body)) {
    throw new Error("Unexpected article save response shape");
  }
  return body;
}

export async function createArticleViaUi(
  page: Page,
  createdArticleIds: string[],
  options: CreateArticleViaUiOptions
): Promise<void> {
  await page.goto("/admin/artigos/new");
  await page.getByTestId("article-title").waitFor({ timeout: 10000 });
  await page.getByTestId("article-title").fill(options.title);
  await page.getByTestId("article-title").blur();

  const editor = page.getByTestId("article-editor");
  await editor.locator('[contenteditable="true"]').click();
  await editor
    .locator('[contenteditable="true"]')
    .fill(options.content ?? "Conteúdo de teste.");

  const body = await clickSaveArticleButton(page, "POST");
  if (body.id) createdArticleIds.push(body.id);

  if (options.waitForEditPage !== false) {
    await page.waitForURL(/\/admin\/artigos\/.+\/edit/, { timeout: 10000 });
    await page.getByTestId("article-title").waitFor({ timeout: 10000 });
  }
}

export async function expectArticleEditorTitleLoaded(
  page: Page
): Promise<void> {
  await expect(page.getByTestId("article-title")).not.toHaveValue("", {
    timeout: 15000,
  });
}

export async function expectArticleSaveSuccess(page: Page): Promise<void> {
  await expect(page.getByTestId("toast-success")).toBeVisible({
    timeout: 15000,
  });
}

export async function expectLocaleTabActive(
  page: Page,
  locale: string
): Promise<void> {
  await expect(page.getByTestId(`locale-tab-${locale}`)).toHaveAttribute(
    "aria-pressed",
    "true",
    { timeout: 5000 }
  );
}
