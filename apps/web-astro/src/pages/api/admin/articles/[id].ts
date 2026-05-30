import type { APIRoute } from "astro";
import { ID, Query } from "node-appwrite";
import { createAdminClient, getEnv } from "../../../../lib/appwrite";
import {
  ARTICLE_TITLE_REQUIRED_MESSAGE,
  getPortugueseTitleValidationErrorFromInputs,
  translationHasContent,
} from "../../../../lib/article-editor-validation";

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

function normalizeTranslationForAppwrite(
  data: Record<string, unknown>
): Record<string, unknown> {
  const stringFields = [
    "title",
    "content",
    "excerpt",
    "metaTitle",
    "metaDescription",
    "slug",
  ];
  const normalized: Record<string, unknown> = {};

  for (const field of stringFields) {
    const value = data[field];
    if (value === undefined || value === null) {
      normalized[field] = "";
    } else {
      const str = String(value);
      if (field === "metaDescription" && str.length > 500) {
        normalized[field] = str.substring(0, 500);
      } else {
        normalized[field] = str;
      }
    }
  }

  for (const [key, value] of Object.entries(data)) {
    if (!stringFields.includes(key)) {
      normalized[key] = value;
    }
  }

  return normalized;
}

type TranslationInput = Record<string, unknown> & { language: string };

export const ALL: APIRoute = async ({ locals, request, params }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  const { id } = params;
  if (!id) return json({ error: "Missing article id" }, 400);

  const { databases } = createAdminClient();
  const DB = getEnv("DATABASE_ID");
  const ARTICLES = getEnv("ARTICLES_COLLECTION_ID");
  const TRANS = getEnv("ARTICLE_TRANSLATIONS_COLLECTION_ID");

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

    const translationsInput = body["translations"] as
      | TranslationInput[]
      | undefined;

    if (Array.isArray(translationsInput) && translationsInput.length > 0) {
      const titleError =
        getPortugueseTitleValidationErrorFromInputs(translationsInput);
      if (titleError) {
        return json({ error: ARTICLE_TITLE_REQUIRED_MESSAGE }, 400);
      }
    }

    const ptBrTrans = translationsInput?.find((t) => t.language === "pt-br");

    await databases.updateDocument(
      DB,
      ARTICLES,
      id,
      sanitize({
        title: ptBrTrans?.["title"] ?? body["title"],
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
      if (!lang) continue;

      if (
        !translationHasContent({
          language: lang,
          title: String(clean["title"] ?? ""),
          content: String(clean["content"] ?? ""),
        })
      )
        continue;

      const docId = idByLanguage.get(lang);
      const generateId = () => ID.unique();

      const suffix = `-${lang}`;
      let uniqueSlug: string = clean["slug"]
        ? lang === "pt-br" || String(clean["slug"]).endsWith(suffix)
          ? String(clean["slug"])
          : `${String(clean["slug"])}${suffix}`
        : "";

      if (!uniqueSlug && (clean["title"] || clean["content"])) {
        uniqueSlug = `${id}-${lang}`;
      }
      if (!uniqueSlug.trim()) {
        uniqueSlug = `${id}-${lang}-draft`;
      }

      if (docId) {
        const normalized = normalizeTranslationForAppwrite(clean);
        await databases.updateDocument(DB, TRANS, docId, {
          title: normalized["title"],
          content: normalized["content"],
          excerpt: normalized["excerpt"],
          metaTitle: normalized["metaTitle"],
          metaDescription: normalized["metaDescription"],
          slug: uniqueSlug,
          article_id: id,
        });
      } else {
        const transId = generateId();
        const createSlug =
          uniqueSlug === `${id}-${lang}-draft`
            ? `${id}-${lang}-${transId.slice(-8)}`
            : uniqueSlug;
        const normalized = normalizeTranslationForAppwrite(clean);
        const newDoc = await databases.createDocument(DB, TRANS, transId, {
          ...normalized,
          slug: createSlug,
          article_id: id,
        });
        idByLanguage.set(lang, newDoc.$id);
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
