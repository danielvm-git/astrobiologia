import { Query } from "node-appwrite";
import type { Article, ArticleTranslation } from "./types";
import { createAdminClient, getEnv } from "./appwrite";
import {
  localeTagsMatch,
  normalizeLocaleTag,
  primaryLanguageSubtag,
} from "./locale";

const CHUNK_SIZE = 15;
const TRANS_PER_ARTICLE_HEADROOM = 10;

function translationJoinLimit(articleCount: number): number {
  return Math.min(
    2500,
    Math.max(articleCount * TRANS_PER_ARTICLE_HEADROOM, 50)
  );
}

function articleIdFromTranslation(t: ArticleTranslation): string {
  const raw = (t as unknown as Record<string, unknown>)["article_id"];
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object" && "$id" in raw)
    return (raw as { $id: string }).$id;
  return "";
}

export function pickTranslationForArticle(
  translations: ArticleTranslation[],
  preferred: string
): ArticleTranslation | undefined {
  if (translations.length === 0) return undefined;
  const preferredPrimary = primaryLanguageSubtag(preferred);
  return (
    translations.find((t) => localeTagsMatch(t.language, preferred)) ||
    translations.find(
      (t) => primaryLanguageSubtag(t.language) === preferredPrimary
    ) ||
    translations.find((t) => normalizeLocaleTag(t.language) === "pt-br") ||
    translations.find((t) => normalizeLocaleTag(t.language) === "en") ||
    translations[0]
  );
}

async function fetchTranslationsForIds(
  ids: string[]
): Promise<ArticleTranslation[]> {
  if (ids.length === 0) return [];
  console.log(
    `[DEBUG] fetchTranslationsForIds: Fetching translations for ${ids.length} articles`
  );
  const { databases } = createAdminClient();
  const out: ArticleTranslation[] = [];
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE);
    try {
      const res = await databases.listDocuments(
        getEnv("DATABASE_ID"),
        getEnv("ARTICLE_TRANSLATIONS_COLLECTION_ID"),
        [
          Query.equal("article_id", chunk),
          Query.limit(translationJoinLimit(chunk.length)),
        ]
      );
      console.log(
        `[DEBUG] fetchTranslationsForIds: Found ${res.documents.length} translations`
      );
      out.push(...(res.documents as unknown as ArticleTranslation[]));
    } catch (error) {
      console.error(`[DEBUG] fetchTranslationsForIds Error:`, error);
      throw error;
    }
  }
  return out;
}

function joinTranslations(
  articles: Article[],
  allTranslations: ArticleTranslation[],
  preferred: string
): Article[] {
  const byArticle = new Map<string, ArticleTranslation[]>();
  for (const t of allTranslations) {
    const aid = articleIdFromTranslation(t);
    if (!aid) continue;
    const list = byArticle.get(aid) ?? [];
    list.push(t);
    byArticle.set(aid, list);
  }
  return articles.map((a) => ({
    ...a,
    translation: pickTranslationForArticle(
      byArticle.get(a.$id) ?? [],
      preferred
    ),
  }));
}

export async function getPublishedArticles(
  language = "pt-br",
  limit = 20,
  offset = 0
): Promise<Article[]> {
  console.log(
    `[DEBUG] getPublishedArticles: lang=${language}, db=${getEnv("DATABASE_ID")}, coll=${getEnv("ARTICLES_COLLECTION_ID")}`
  );
  const { databases } = createAdminClient();
  try {
    const res = await databases.listDocuments(
      getEnv("DATABASE_ID"),
      getEnv("ARTICLES_COLLECTION_ID"),
      [
        Query.equal("status", "published"),
        Query.orderDesc("publishedAt"),
        Query.limit(limit),
        Query.offset(offset),
      ]
    );
    console.log(
      `[DEBUG] getPublishedArticles: Found ${res.total} total documents`
    );
    if (res.total === 0) return [];
    const articles = res.documents as unknown as Article[];
    const translations = await fetchTranslationsForIds(
      articles.map((a) => a.$id)
    );
    return joinTranslations(articles, translations, language);
  } catch (error) {
    console.error(`[DEBUG] getPublishedArticles Error:`, error);
    throw error;
  }
}

export async function getFeaturedArticles(
  language = "pt-br",
  limit = 5
): Promise<Article[]> {
  const { databases } = createAdminClient();
  const res = await databases.listDocuments(
    getEnv("DATABASE_ID"),
    getEnv("ARTICLES_COLLECTION_ID"),
    [
      Query.equal("status", "published"),
      Query.equal("featured", true),
      Query.orderDesc("publishedAt"),
      Query.limit(limit),
    ]
  );
  const articles = res.documents as unknown as Article[];
  if (articles.length === 0) return [];
  const translations = await fetchTranslationsForIds(
    articles.map((a) => a.$id)
  );
  return joinTranslations(articles, translations, language);
}

export async function getArticleBySlug(
  slug: string,
  language = "pt-br"
): Promise<Article | null> {
  const { databases } = createAdminClient();

  const transRes = await databases.listDocuments(
    getEnv("DATABASE_ID"),
    getEnv("ARTICLE_TRANSLATIONS_COLLECTION_ID"),
    [Query.equal("slug", slug), Query.limit(50)]
  );

  if (transRes.total > 0) {
    const docs = transRes.documents as unknown as ArticleTranslation[];
    const translation = pickTranslationForArticle(docs, language);
    if (translation) {
      const masterId = articleIdFromTranslation(translation);
      if (masterId) {
        try {
          const article = (await databases.getDocument(
            getEnv("DATABASE_ID"),
            getEnv("ARTICLES_COLLECTION_ID"),
            masterId
          )) as unknown as Article;
          return { ...article, translation };
        } catch {
          // fall through to legacy lookup
        }
      }
    }
  }

  const masterRes = await databases.listDocuments(
    getEnv("DATABASE_ID"),
    getEnv("ARTICLES_COLLECTION_ID"),
    [Query.equal("slug", slug), Query.limit(1)]
  );

  if (masterRes.total === 0) return null;
  const article = masterRes.documents[0] as unknown as Article;
  const allTrans = await fetchTranslationsForIds([article.$id]);
  return {
    ...article,
    translation: pickTranslationForArticle(allTrans, language),
  };
}

export async function getArticlesByCategory(
  category: string,
  language = "pt-br",
  limit = 20
): Promise<Article[]> {
  const { databases } = createAdminClient();
  const res = await databases.listDocuments(
    getEnv("DATABASE_ID"),
    getEnv("ARTICLES_COLLECTION_ID"),
    [
      Query.equal("status", "published"),
      Query.equal("category", category),
      Query.orderDesc("publishedAt"),
      Query.limit(limit),
    ]
  );
  const articles = res.documents as unknown as Article[];
  if (articles.length === 0) return [];
  const translations = await fetchTranslationsForIds(
    articles.map((a) => a.$id)
  );
  return joinTranslations(articles, translations, language);
}

export async function searchPublishedArticles(
  searchTerm: string,
  language = "pt-br",
  limit = 20
): Promise<Article[]> {
  const { databases } = createAdminClient();
  const normalized = searchTerm.trim();
  if (!normalized) return getPublishedArticles(language, limit);

  const translationsById = new Map<string, ArticleTranslation>();
  for (const field of ["title", "excerpt", "content"] as const) {
    try {
      const res = await databases.listDocuments(
        getEnv("DATABASE_ID"),
        getEnv("ARTICLE_TRANSLATIONS_COLLECTION_ID"),
        [
          Query.equal("language", language),
          Query.search(field, normalized),
          Query.limit(limit),
        ]
      );
      for (const t of res.documents as unknown as ArticleTranslation[]) {
        const aid = articleIdFromTranslation(t);
        if (aid && !translationsById.has(aid)) translationsById.set(aid, t);
      }
    } catch {
      // continue with other fields
    }
  }

  if (translationsById.size > 0) {
    const masters = await databases.listDocuments(
      getEnv("DATABASE_ID"),
      getEnv("ARTICLES_COLLECTION_ID"),
      [
        Query.equal("$id", Array.from(translationsById.keys())),
        Query.equal("status", "published"),
        Query.orderDesc("publishedAt"),
        Query.limit(limit),
      ]
    );
    return (masters.documents as unknown as Article[]).map((a) => ({
      ...a,
      translation: translationsById.get(a.$id),
    }));
  }

  try {
    const fallback = await databases.listDocuments(
      getEnv("DATABASE_ID"),
      getEnv("ARTICLES_COLLECTION_ID"),
      [
        Query.equal("status", "published"),
        Query.search("title", normalized),
        Query.limit(limit),
      ]
    );
    if (fallback.total > 0) {
      return fallback.documents as unknown as Article[];
    }
  } catch {
    // Full-text index may not be configured; fall through to broad fallback
  }

  return getPublishedArticles(language, limit);
}
