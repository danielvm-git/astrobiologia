import type { APIRoute } from "astro";
import { ID, Query } from "node-appwrite";
import {
  createAdminClient,
  createSessionClient,
  getEnv,
} from "../../../../lib/appwrite";
import { ARTICLE_LOCALES } from "../../../../lib/article-locales";
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

export const GET: APIRoute = async ({ locals, request }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  const { databases } = createSessionClient(request);
  const DB = getEnv("DATABASE_ID");
  const ARTICLES = getEnv("ARTICLES_COLLECTION_ID");
  const TRANS = getEnv("ARTICLE_TRANSLATIONS_COLLECTION_ID");

  const response = await databases.listDocuments(DB, ARTICLES, [
    Query.orderDesc("$createdAt"),
    Query.limit(100),
  ]);

  const articleIds = response.documents.map((d) => d.$id);
  const allTrans: Array<{
    article_id: string;
    language: string;
    title?: string;
    slug?: string;
  }> = [];

  if (articleIds.length > 0) {
    const BATCH = 200;
    let lastId: string | null = null;
    for (;;) {
      const queries = [
        Query.equal("article_id", articleIds),
        Query.orderAsc("$id"),
        Query.limit(BATCH),
      ];
      if (lastId) queries.push(Query.cursorAfter(lastId));
      const page = await databases.listDocuments(DB, TRANS, queries);
      if (page.documents.length === 0) break;
      allTrans.push(...(page.documents as unknown as typeof allTrans));
      if (page.documents.length < BATCH) break;
      lastId = page.documents.at(-1)!.$id;
    }
  }

  const titles: Record<string, string> = {};
  const slugs: Record<string, string> = {};
  const availability: Record<string, Record<string, boolean>> = {};

  for (const id of articleIds) {
    availability[id] = Object.fromEntries(
      ARTICLE_LOCALES.map((l) => [l, false])
    );
  }
  for (const t of allTrans) {
    if (availability[t.article_id]) {
      availability[t.article_id][t.language] = true;
    }
    if (t.language === "pt-br") {
      if (t.title) titles[t.article_id] = t.title;
      if (t.slug) slugs[t.article_id] = t.slug;
    }
  }

  const articles = JSON.parse(JSON.stringify(response.documents)).map(
    (a: Record<string, unknown> & { $id: string }) => ({
      ...a,
      title: titles[a.$id] || "(Sem título)",
      slug: slugs[a.$id] || "",
      languages:
        availability[a.$id] ||
        Object.fromEntries(ARTICLE_LOCALES.map((l) => [l, false])),
    })
  );

  return json({ articles });
};

type TranslationInput = {
  language: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { databases } = createAdminClient();
  const DB = getEnv("DATABASE_ID");
  const ARTICLES = getEnv("ARTICLES_COLLECTION_ID");
  const TRANS = getEnv("ARTICLE_TRANSLATIONS_COLLECTION_ID");

  const now = new Date().toISOString();
  const translations_input: TranslationInput[] = Array.isArray(
    body.translations
  )
    ? (body.translations as TranslationInput[])
    : [];
  const ptBrTrans = translations_input.find((t) => t.language === "pt-br");
  const titleError =
    translations_input.length > 0
      ? getPortugueseTitleValidationErrorFromInputs(translations_input)
      : getPortugueseTitleValidationErrorFromInputs([
          { language: "pt-br", title: String(body.title ?? "") },
        ]);
  if (titleError) return json({ error: ARTICLE_TITLE_REQUIRED_MESSAGE }, 400);

  const generateId = () => ID.unique();
  const articleId = generateId();
  const articleSlug =
    (ptBrTrans?.slug ?? String(body.slug ?? "")).trim() ||
    `artigo-${articleId.slice(-10)}`;
  const article = await databases.createDocument(DB, ARTICLES, articleId, {
    title: ptBrTrans?.title ?? String(body.title ?? ""),
    slug: articleSlug,
    excerpt: ptBrTrans?.excerpt ?? String(body.excerpt ?? ""),
    content: ptBrTrans?.content ?? String(body.content ?? ""),
    category: body.category || "noticias",
    tags: Array.isArray(body.tags) ? body.tags : [],
    featuredImage: body.featuredImage || "",
    featuredImageAlt: body.featuredImageAlt || "",
    status: body.status || "draft",
    featured: Boolean(body.featured),
    authorId: body.authorId || locals.user.$id,
    authorName: body.authorName || locals.user.name || "Admin",
    publishedAt: body.publishedAt || now,
  });

  let translations: TranslationInput[] = translations_input;

  if (translations.length === 0) {
    translations = [
      {
        language: "pt-br",
        title: String(body.title ?? ""),
        slug: String(body.slug ?? ""),
        excerpt: String(body.excerpt ?? ""),
        content: String(body.content ?? ""),
        metaTitle: String(body.metaTitle ?? ""),
        metaDescription: String(body.metaDescription ?? ""),
      },
    ];
  }

  // Filter out duplicates, empty languages, and empty content
  const seenLangs = new Set<string>();
  for (const t of translations) {
    if (!t.language || seenLangs.has(t.language)) continue;
    // Only create if there's actual content or it's the primary language
    if (!translationHasContent(t)) continue;
    seenLangs.add(t.language);

    const transId = generateId();
    // Ensure slug is unique per translation if the collection has a unique index on slug
    const suffix = `-${t.language}`;
    let uniqueSlug = t.slug
      ? t.language === "pt-br" || t.slug.endsWith(suffix)
        ? t.slug
        : `${t.slug}${suffix}`
      : "";

    if (!uniqueSlug && (t.title || t.content)) {
      uniqueSlug = `${articleId}-${t.language}`;
    }
    if (!uniqueSlug.trim()) {
      uniqueSlug = `${articleId}-${t.language}`;
    }

    await databases.createDocument(DB, TRANS, transId, {
      article_id: article.$id,
      language: t.language,
      title: t.title ?? "",
      slug: uniqueSlug,
      excerpt: t.excerpt ?? "",
      content: t.content ?? "",
      metaTitle: t.metaTitle ?? "",
      metaDescription: t.metaDescription ?? "",
    });
  }

  return json({ success: true, id: article.$id });
};
