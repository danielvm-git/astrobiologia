import { Client, Databases, Query } from "node-appwrite";

// Inline patch — test helpers run outside Vite and cannot import TS without extension.
const originalPrepare = (Client.prototype as any).prepareRequest;
(Client.prototype as any).prepareRequest = function (
  method: string,
  url: URL,
  headers: Record<string, string> = {},
  params: Record<string, unknown> = {}
) {
  const result = originalPrepare.call(this, method, url, headers, params);
  if (result?.options) {
    delete result.options.agent;
    delete result.options.dispatcher;
  }
  return result;
};

export function createAppwriteTestClient(): Databases {
  const endpoint = process.env.APPWRITE_ENDPOINT;
  const project = process.env.APPWRITE_PROJECT_ID;
  const key = process.env.APPWRITE_API_KEY;
  if (!endpoint || !project || !key) {
    throw new Error(
      "APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, and APPWRITE_API_KEY required for E2E DB setup"
    );
  }
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project)
    .setKey(key);
  return new Databases(client);
}

export async function unpublishAllArticles(): Promise<void> {
  const db = createAppwriteTestClient();
  const dbId = process.env.DATABASE_ID!;
  const articlesCol = process.env.ARTICLES_COLLECTION_ID!;
  const res = await db.listDocuments(dbId, articlesCol, [
    Query.equal("status", "published"),
    Query.limit(100),
  ]);
  for (const doc of res.documents) {
    await db.updateDocument(dbId, articlesCol, doc.$id, { status: "draft" });
  }
  const stillPublished = await db.listDocuments(dbId, articlesCol, [
    Query.equal("status", "published"),
    Query.limit(1),
  ]);
  if (stillPublished.total > 0) {
    throw new Error(
      `Failed to unpublish all articles (${stillPublished.total} still published)`
    );
  }
}

// Fixed IDs let us use upsert-style logic: create if missing, skip 409.
const SEED_ARTICLE_ID = "e2e-seed-article-v1";
const SEED_TRANS_ID = "e2e-seed-trans-ptbr-v1";

export async function ensureSeedPublishedArticle(): Promise<void> {
  const db = createAppwriteTestClient();
  const dbId = process.env.DATABASE_ID!;
  const artColId = process.env.ARTICLES_COLLECTION_ID!;
  const transColId = process.env.ARTICLE_TRANSLATIONS_COLLECTION_ID!;

  // Try to fetch the fixed seed document — already exists → republish if needed.
  try {
    const doc = await db.getDocument(dbId, artColId, SEED_ARTICLE_ID);
    if ((doc as Record<string, unknown>)["status"] !== "published") {
      await db.updateDocument(dbId, artColId, SEED_ARTICLE_ID, {
        status: "published",
      });
    }
    return;
  } catch (err: unknown) {
    // 404 — not yet created; fall through to create below.
    const isNotFound =
      (err as { code?: number }).code === 404 ||
      (err instanceof Error && err.message.includes("could not be found"));
    if (!isNotFound) throw err;
  }

  try {
    await db.createDocument(dbId, artColId, SEED_ARTICLE_ID, {
      title: "Artigo de Teste (Semeado)",
      slug: "e2e-seed-article",
      excerpt: "Este é um artigo gerado automaticamente para os testes E2E.",
      content:
        "<p>Conteúdo de teste para garantir que a página não esteja vazia.</p>",
      category: "noticias",
      tags: [],
      featuredImage: "",
      featuredImageAlt: "",
      status: "published",
      featured: true,
      authorId: "e2e-system",
      authorName: "System Test",
      publishedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    // 409 — another worker created it concurrently; that's fine.
    if ((err as { code?: number }).code !== 409) throw err;
  }

  try {
    await db.createDocument(dbId, transColId, SEED_TRANS_ID, {
      article_id: SEED_ARTICLE_ID,
      language: "pt-br",
      title: "Artigo de Teste (Semeado)",
      slug: "e2e-seed-article",
      excerpt: "Este é um artigo gerado automaticamente para os testes E2E.",
      content:
        "<p>Conteúdo de teste para garantir que a página não esteja vazia.</p>",
    });
  } catch (err: unknown) {
    if ((err as { code?: number }).code !== 409) throw err;
  }
}
