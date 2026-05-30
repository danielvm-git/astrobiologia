import { Client, Databases, Query } from "node-appwrite";

export const E2E_AUTHOR_ID = "e2e-system";
export const E2E_RUNNER_AUTHOR_ID = "e2e-runner";

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
    const patch: Record<string, unknown> = {};
    if ((doc as Record<string, unknown>)["status"] !== "published") {
      patch.status = "published";
    }
    // Never promote seed to homepage hero — it has no featured image.
    if ((doc as Record<string, unknown>)["featured"] === true) {
      patch.featured = false;
    }
    if (Object.keys(patch).length > 0) {
      await db.updateDocument(dbId, artColId, SEED_ARTICLE_ID, patch);
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
      featured: false,
      authorId: E2E_AUTHOR_ID,
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

function isE2eArticle(doc: Record<string, unknown>): boolean {
  const authorId = String(doc.authorId ?? "");
  if (authorId === E2E_RUNNER_AUTHOR_ID) return true;
  const title = String(doc.title ?? "");
  const slug = String(doc.slug ?? "");
  return (
    /e2e-/i.test(title) ||
    /e2e-/i.test(slug) ||
    /artigo de teste/i.test(title) ||
    /artigo para tradu/i.test(title) ||
    /novo artigo de teste/i.test(title) ||
    /existing article/i.test(title)
  );
}

async function deleteArticleWithTranslations(
  db: Databases,
  dbId: string,
  artColId: string,
  transColId: string,
  articleId: string
): Promise<void> {
  for (;;) {
    const translations = await db.listDocuments(dbId, transColId, [
      Query.equal("article_id", articleId),
      Query.limit(100),
    ]);
    if (translations.documents.length === 0) break;
    for (const t of translations.documents) {
      await db.deleteDocument(dbId, transColId, t.$id);
    }
    if (translations.documents.length < 100) break;
  }
  await db.deleteDocument(dbId, artColId, articleId);
}

/** Remove E2E artifacts from Appwrite so test runs don't pollute the live site. */
export async function cleanupE2eArtifacts(): Promise<void> {
  const db = createAppwriteTestClient();
  const dbId = process.env.DATABASE_ID!;
  const artColId = process.env.ARTICLES_COLLECTION_ID!;
  const transColId = process.env.ARTICLE_TRANSLATIONS_COLLECTION_ID!;

  // Unpublish seed — keep document for next run but hide from public site.
  try {
    await db.updateDocument(dbId, artColId, SEED_ARTICLE_ID, {
      status: "draft",
      featured: false,
    });
  } catch {
    // seed may not exist
  }

  const res = await db.listDocuments(dbId, artColId, [Query.limit(100)]);
  for (const doc of res.documents) {
    const record = doc as unknown as Record<string, unknown>;
    if (record.$id === SEED_ARTICLE_ID) continue;
    if (!isE2eArticle(record)) continue;
    await deleteArticleWithTranslations(
      db,
      dbId,
      artColId,
      transColId,
      String(record.$id)
    );
  }
}

export async function deleteE2eArticleById(articleId: string): Promise<void> {
  if (!articleId || articleId === SEED_ARTICLE_ID) return;
  const db = createAppwriteTestClient();
  const dbId = process.env.DATABASE_ID!;
  const artColId = process.env.ARTICLES_COLLECTION_ID!;
  const transColId = process.env.ARTICLE_TRANSLATIONS_COLLECTION_ID!;
  try {
    await deleteArticleWithTranslations(
      db,
      dbId,
      artColId,
      transColId,
      articleId
    );
  } catch (err: unknown) {
    const code = (err as { code?: number }).code;
    if (code === 404) return;
    throw err;
  }
}
