import type { Page } from "@playwright/test";
import { E2E_RUNNER_AUTHOR_ID } from "./appwriteTestClient";
import { testRunId } from "./testRunId";

export type CreateArticlePayload = {
  title: string;
  slug?: string;
  content?: string;
  status?: "draft" | "published";
  translations?: Array<{
    language: string;
    title?: string;
    slug?: string;
    content?: string;
  }>;
};

function e2eArticleSlug(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);
  return `${base || "artigo"}-${testRunId()}-${Date.now().toString(36)}`;
}

async function readJsonBody(res: {
  json: () => Promise<unknown>;
  text: () => Promise<string>;
}): Promise<{ id?: string; error?: string }> {
  try {
    return (await res.json()) as { id?: string; error?: string };
  } catch {
    const text = await res.text();
    throw new Error(
      `Non-JSON API response: ${text.slice(0, 120)}${text.length > 120 ? "…" : ""}`
    );
  }
}

export async function createArticleViaApi(
  page: Page,
  payload: CreateArticlePayload
): Promise<string> {
  const slug = payload.slug ?? e2eArticleSlug(payload.title);
  const data = {
    ...payload,
    slug,
    authorId: E2E_RUNNER_AUTHOR_ID,
    authorName: "E2E Runner",
    featured: false,
    translations: (payload.translations ?? []).map((t) => ({
      ...t,
      slug: t.slug ?? (t.language === "pt-br" ? slug : `${slug}-${t.language}`),
    })),
  };
  if (data.translations.length === 0) {
    data.translations = [
      {
        language: "pt-br",
        title: payload.title,
        slug,
        content: payload.content ?? "Conteúdo de teste.",
      },
    ];
  }

  await page.goto("/admin/artigos");
  const res = await page.request.post("/api/admin/articles", { data });
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Create failed: ${res.status()} ${text.slice(0, 200)}`);
  }
  const responseBody = await readJsonBody(res);
  if (!responseBody.id) throw new Error("Create response missing article id");
  return responseBody.id;
}
