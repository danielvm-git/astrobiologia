import type { APIRoute } from "astro";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../../../../lib/appwrite";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sanitize(data: Record<string, unknown>): Record<string, unknown> {
  const forbidden = new Set(["updatedAt", "createdAt"]);
  return Object.fromEntries(
    Object.entries(data).filter(
      ([k, v]) => !k.startsWith("$") && !forbidden.has(k) && v !== undefined
    )
  );
}

type TranslationInput = Record<string, unknown> & { language: string };

export const ALL: APIRoute = async ({ locals, request, params }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  const { id } = params;
  if (!id) return json({ error: "Missing article id" }, 400);

  const { databases } = createAdminClient();
  const DB = import.meta.env.DATABASE_ID;
  const ARTICLES = import.meta.env.ARTICLES_COLLECTION_ID;
  const TRANS = import.meta.env.ARTICLE_TRANSLATIONS_COLLECTION_ID;

  if (request.method === "GET") {
    const article = await databases.getDocument(DB, ARTICLES, id);
    const translations = await databases.listDocuments(DB, TRANS, [
      Query.equal("article_id", id),
    ]);
    const translation =
      translations.documents.find(
        (d: Record<string, unknown>) => d["language"] === "pt-br"
      ) ||
      translations.documents[0] ||
      null;
    return json({ article, translation, translations: translations.documents });
  }

  if (request.method === "PUT") {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    await databases.updateDocument(
      DB,
      ARTICLES,
      id,
      sanitize({
        category: body["category"],
        tags: body["tags"],
        featuredImage: body["featuredImage"],
        featuredImageAlt: body["featuredImageAlt"],
        status: body["status"],
        featured: body["featured"],
        authorId: body["authorId"],
        authorName: body["authorName"],
        publishedAt: body["publishedAt"],
      })
    );

    const translationsInput = body["translations"] as
      | TranslationInput[]
      | undefined;
    if (!Array.isArray(translationsInput) || translationsInput.length === 0) {
      return json({ success: true });
    }

    const existing = await databases.listDocuments(DB, TRANS, [
      Query.equal("article_id", id),
      Query.limit(25),
    ]);
    const idByLanguage = new Map<string, string>(
      existing.documents.map((d) => [
        (d as unknown as TranslationInput).language,
        d.$id,
      ])
    );

    for (const t of translationsInput) {
      const clean = sanitize(t);
      delete clean["article_id"];
      delete clean["$id"];
      const lang = clean["language"] as string;
      const docId = idByLanguage.get(lang);
      if (docId) {
        await databases.updateDocument(DB, TRANS, docId, {
          ...clean,
          article_id: id,
        });
      } else {
        await databases.createDocument(DB, TRANS, ID.unique(), {
          ...clean,
          article_id: id,
        });
      }
    }

    return json({ success: true });
  }

  if (request.method === "DELETE") {
    const BATCH = 100;
    for (;;) {
      const translations = await databases.listDocuments(DB, TRANS, [
        Query.equal("article_id", id),
        Query.limit(BATCH),
      ]);
      if (translations.documents.length === 0) break;
      for (const t of translations.documents) {
        await databases.deleteDocument(DB, TRANS, t.$id);
      }
      if (translations.documents.length < BATCH) break;
    }
    await databases.deleteDocument(DB, ARTICLES, id);
    return json({ success: true });
  }

  return json({ error: "Method not allowed" }, 405);
};
