import { expect, type Page } from "@playwright/test";
import { createArticleViaApi } from "./adminApiSession";

type CreateArticleViaUiOptions = {
  title: string;
  content?: string;
  waitForEditPage?: boolean;
  useApiSetup?: boolean;
  status?: "draft" | "published";
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
  const matchesSave = (r: {
    url: () => string;
    request: () => { method: () => string };
    ok: () => boolean;
  }) => {
    const url = r.url();
    if (!url.includes("/api/admin/articles")) return false;
    const requestMethod = r.request().method();
    if (method === "POST") {
      return requestMethod === "POST" && /\/api\/admin\/articles\/?$/.test(url);
    }
    if (method === "PUT") {
      return (
        requestMethod === "PUT" && /\/api\/admin\/articles\/[^/]+$/.test(url)
      );
    }
    return (
      (requestMethod === "POST" && /\/api\/admin\/articles\/?$/.test(url)) ||
      (requestMethod === "PUT" && /\/api\/admin\/articles\/[^/]+$/.test(url))
    );
  };

  const [response] = await Promise.all([
    page.waitForResponse((r) => matchesSave(r) && r.ok(), { timeout: 30000 }),
    page.getByRole("button", { name: /confirmar e salvar/i }).click(),
  ]);

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    const text = await response.text();
    throw new Error(
      `Non-JSON save response (HTTP ${response.status()}): ${text.slice(0, 200)}`
    );
  }
  if (!response.ok()) {
    const err =
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof (body as { error: unknown }).error === "string"
        ? (body as { error: string }).error
        : `HTTP ${response.status()}`;
    throw new Error(err);
  }
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
  if (options.useApiSetup !== false) {
    const id = await createArticleViaApi(page, {
      title: options.title,
      content: options.content ?? "Conteúdo de teste.",
      status: options.status ?? "draft",
      translations: [
        {
          language: "pt-br",
          title: options.title,
          content: options.content ?? "Conteúdo de teste.",
        },
      ],
    });
    createdArticleIds.push(id);
    if (options.waitForEditPage !== false) {
      await page.goto(`/admin/artigos/${id}/edit`);
      await page.getByTestId("article-title").waitFor({ timeout: 10000 });
    }
    return;
  }

  await page.goto("/admin/artigos/new");
  await page.getByTestId("article-title").waitFor({ timeout: 10000 });
  await page.getByTestId("article-title").fill(options.title);
  await page.getByTestId("article-title").blur();
  await page.getByTestId("article-slug").waitFor({ timeout: 5000 });

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
