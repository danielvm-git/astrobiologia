import { Query } from "appwrite";
import { COLLECTIONS, DATABASE_ID, databases } from "$lib/appwrite-datasets";
import { localeTagsMatch, normalizeLocaleTag } from "$lib/i18n/locale-tag";
import type { Article, ArticleTranslation } from "../appwrite";

const TRANSLATION_JOIN_LIMIT_CAP = 2500;
const TRANSLATION_JOIN_MIN = 50;
const TRANSLATIONS_PER_ARTICLE_HEADROOM = 10;

function translationJoinLimit(articleCount: number): number {
  return Math.min(
    TRANSLATION_JOIN_LIMIT_CAP,
    Math.max(
      articleCount * TRANSLATIONS_PER_ARTICLE_HEADROOM,
      TRANSLATION_JOIN_MIN
    )
  );
}

const ARTICLE_ID_CHUNK_SIZE = 15;

function articleIdFromTranslation(t: ArticleTranslation): string {
  const raw = (t as { article_id?: unknown }).article_id;
  if (typeof raw === "string") return raw;
  if (
    raw &&
    typeof raw === "object" &&
    "$id" in raw &&
    typeof (raw as { $id: unknown }).$id === "string"
  ) {
    return (raw as { $id: string }).$id;
  }
  return "";
}

async function fetchTranslationsForArticleIds(
  articleIds: string[]
): Promise<ArticleTranslation[]> {
  if (articleIds.length === 0) return [];
  const out: ArticleTranslation[] = [];
  for (let i = 0; i < articleIds.length; i += ARTICLE_ID_CHUNK_SIZE) {
    const chunk = articleIds.slice(i, i + ARTICLE_ID_CHUNK_SIZE);
    const lim = translationJoinLimit(chunk.length);
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ARTICLES_TRANSLATIONS,
      [Query.equal("article_id", chunk), Query.limit(lim)]
    );
    out.push(...(res.documents as unknown as ArticleTranslation[]));
  }
  return out;
}

function pickTranslationForArticle(
  translations: ArticleTranslation[],
  preferredLanguage: string
): ArticleTranslation | undefined {
  if (translations.length === 0) return undefined;
  return (
    translations.find((t) => localeTagsMatch(t.language, preferredLanguage)) ||
    translations.find((t) => normalizeLocaleTag(t.language) === "pt-br") ||
    translations.find((t) => normalizeLocaleTag(t.language) === "en") ||
    translations[0]
  );
}

function joinTranslationsByArticle(
  articles: Article[],
  allTranslations: ArticleTranslation[],
  preferredLanguage: string
): Article[] {
  const byArticle = new Map<string, ArticleTranslation[]>();
  for (const t of allTranslations) {
    const aid = articleIdFromTranslation(t);
    if (!aid) continue;
    const list = byArticle.get(aid) ?? [];
    list.push(t);
    byArticle.set(aid, list);
  }
  return articles.map((article) => ({
    ...article,
    translation: pickTranslationForArticle(
      byArticle.get(article.$id) ?? [],
      preferredLanguage
    ),
  }));
}

/**
 * Fetches published articles. If a translation for the requested language exists, it is joined.
 * Otherwise picks pt-br, then en, then any available translation so cards never render empty titles.
 */
export async function getPublishedArticles(
  language = "pt-br",
  limit = 20,
  offset = 0
): Promise<Article[]> {
  const articlesResponse = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.ARTICLES,
    [
      Query.equal("status", "published"),
      Query.orderDesc("publishedAt"),
      Query.limit(limit),
      Query.offset(offset),
    ]
  );

  if (articlesResponse.total === 0) return [];

  const articles = articlesResponse.documents as unknown as Article[];
  const articleIds = articles.map((a) => a.$id);

  const translations = await fetchTranslationsForArticleIds(articleIds);

  return joinTranslationsByArticle(articles, translations, language);
}

export async function getFeaturedArticles(
  language = "pt-br",
  limit = 5
): Promise<Article[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.ARTICLES,
    [
      Query.equal("status", "published"),
      Query.equal("featured", true),
      Query.orderDesc("publishedAt"),
      Query.limit(limit),
    ]
  );

  const articles = response.documents as unknown as Article[];
  if (articles.length === 0) return [];

  const articleIds = articles.map((a) => a.$id);
  const translations = await fetchTranslationsForArticleIds(articleIds);

  return joinTranslationsByArticle(articles, translations, language);
}

export async function getArticleBySlug(
  slug: string,
  language = "pt-br"
): Promise<Article | null> {
  const transResponse = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.ARTICLES_TRANSLATIONS,
    [Query.equal("slug", slug), Query.limit(50)]
  );

  if (transResponse.total > 0) {
    const docs = transResponse.documents as unknown as ArticleTranslation[];
    if (docs.length > 0) {
      const translation = pickTranslationForArticle(docs, language);
      if (translation) {
        const rawAid = (translation as { article_id: unknown }).article_id;
        const masterId =
          articleIdFromTranslation(translation) ||
          (typeof rawAid === "string" ? rawAid : "");
        try {
          const article = (await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.ARTICLES,
            masterId
          )) as unknown as Article;
          return {
            ...article,
            translation,
          };
        } catch (e) {
          console.error("Failed to fetch master article for translation:", e);
        }
      }
    }
  }

  const masterResponse = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.ARTICLES,
    [Query.equal("slug", slug), Query.limit(1)]
  );

  if (masterResponse && masterResponse.total > 0) {
    const article = masterResponse.documents[0] as unknown as Article;
    const tResp = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ARTICLES_TRANSLATIONS,
      [Query.equal("article_id", article.$id), Query.limit(100)]
    );
    const allForArticle = tResp.documents as unknown as ArticleTranslation[];
    const translation = pickTranslationForArticle(allForArticle, language);

    return {
      ...article,
      translation,
    };
  }

  return null;
}

export async function getArticlesByCategory(
  category: string,
  language = "pt-br",
  limit = 20
): Promise<Article[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.ARTICLES,
    [
      Query.equal("status", "published"),
      Query.equal("category", category),
      Query.orderDesc("publishedAt"),
      Query.limit(limit),
    ]
  );

  const articles = response.documents as unknown as Article[];
  if (articles.length === 0) return [];

  const articleIds = articles.map((a) => a.$id);
  const translations = await fetchTranslationsForArticleIds(articleIds);

  return joinTranslationsByArticle(articles, translations, language);
}

export async function getAllArticles(): Promise<Article[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.ARTICLES,
    [Query.orderDesc("$createdAt"), Query.limit(100)]
  );
  return response.documents as unknown as Article[];
}

export async function searchPublishedArticles(
  searchTerm: string,
  language = "pt-br",
  limit = 20
): Promise<Article[]> {
  const normalizedTerm = searchTerm.trim();
  if (!normalizedTerm) {
    return getPublishedArticles(language, limit);
  }

  const translationsById = new Map<string, ArticleTranslation>();

  const translationSearchFields: Array<
    keyof Pick<ArticleTranslation, "title" | "excerpt" | "content">
  > = ["title", "excerpt", "content"];

  for (const field of translationSearchFields) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ARTICLES_TRANSLATIONS,
        [
          Query.equal("language", language),
          Query.search(field, normalizedTerm),
          Query.limit(limit),
        ]
      );
      const docs = response.documents as unknown as ArticleTranslation[];
      for (const translation of docs) {
        const aid = articleIdFromTranslation(translation);
        if (aid && !translationsById.has(aid)) {
          translationsById.set(aid, translation);
        }
      }
    } catch (error) {
      console.error(`Translation search failed on field ${field}:`, error);
    }
  }

  if (translationsById.size > 0) {
    const articleIds = Array.from(translationsById.keys());
    const masters = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ARTICLES,
      [
        Query.equal("$id", articleIds),
        Query.equal("status", "published"),
        Query.orderDesc("publishedAt"),
        Query.limit(limit),
      ]
    );
    const masterArticles = masters.documents as unknown as Article[];
    return masterArticles.map((article) => ({
      ...article,
      translation: translationsById.get(article.$id),
    }));
  }

  try {
    const fallback = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ARTICLES,
      [
        Query.equal("status", "published"),
        Query.search("title", normalizedTerm),
        Query.orderDesc("publishedAt"),
        Query.limit(limit),
      ]
    );
    return fallback.documents as unknown as Article[];
  } catch (error) {
    console.error("Master article search failed:", error);
    return [];
  }
}

/**
 * Fetches all translations for a specific article.
 */
export async function getArticleTranslations(
  articleId: string
): Promise<ArticleTranslation[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.ARTICLES_TRANSLATIONS,
    [Query.equal("article_id", articleId), Query.limit(100)]
  );
  return response.documents as unknown as ArticleTranslation[];
}
