import { Query } from "node-appwrite";
import type { Article, ArticleTranslation } from "~/types/article";
import { createAdminClient, getDatabaseId } from "./appwrite";
import { localeTagsMatch, normalizeLocaleTag } from "./locale";

const TRANSLATION_JOIN_LIMIT_CAP = 2500;
const TRANSLATION_JOIN_MIN = 50;
const TRANSLATIONS_PER_ARTICLE_HEADROOM = 10;
const ARTICLE_ID_CHUNK_SIZE = 15;

function translationJoinLimit(articleCount: number): number {
  return Math.min(
    TRANSLATION_JOIN_LIMIT_CAP,
    Math.max(
      articleCount * TRANSLATIONS_PER_ARTICLE_HEADROOM,
      TRANSLATION_JOIN_MIN
    )
  );
}

function articleIdFromTranslation(translation: ArticleTranslation): string {
  const raw = (translation as { article_id?: unknown }).article_id;
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
  const { databases } = createAdminClient();
  const databaseId = getDatabaseId();
  const translationsCollectionId =
    useRuntimeConfig().public.articleTranslationsCollectionId;
  const out: ArticleTranslation[] = [];

  for (
    let index = 0;
    index < articleIds.length;
    index += ARTICLE_ID_CHUNK_SIZE
  ) {
    const chunk = articleIds.slice(index, index + ARTICLE_ID_CHUNK_SIZE);
    const res = await databases.listDocuments(
      databaseId,
      translationsCollectionId,
      [
        Query.equal("article_id", chunk),
        Query.limit(translationJoinLimit(chunk.length)),
      ]
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
    translations.find((translation) =>
      localeTagsMatch(translation.language, preferredLanguage)
    ) ||
    translations.find(
      (translation) => normalizeLocaleTag(translation.language) === "pt-br"
    ) ||
    translations.find(
      (translation) => normalizeLocaleTag(translation.language) === "en"
    ) ||
    translations[0]
  );
}

function joinTranslationsByArticle(
  articles: Article[],
  allTranslations: ArticleTranslation[],
  preferredLanguage: string
): Article[] {
  const byArticle = new Map<string, ArticleTranslation[]>();
  for (const translation of allTranslations) {
    const aid = articleIdFromTranslation(translation);
    if (!aid) continue;
    const list = byArticle.get(aid) ?? [];
    list.push(translation);
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

export async function getPublishedArticles(
  language = "pt-br",
  limit = 20,
  offset = 0
): Promise<Article[]> {
  const { databases } = createAdminClient();
  const config = useRuntimeConfig();
  const response = await databases.listDocuments(
    config.public.databaseId,
    config.public.articlesCollectionId,
    [
      Query.equal("status", "published"),
      Query.orderDesc("publishedAt"),
      Query.limit(limit),
      Query.offset(offset),
    ]
  );

  if (response.total === 0) return [];
  const articles = response.documents as unknown as Article[];
  const translations = await fetchTranslationsForArticleIds(
    articles.map((article) => article.$id)
  );
  return joinTranslationsByArticle(articles, translations, language);
}

export async function getFeaturedArticles(
  language = "pt-br",
  limit = 5
): Promise<Article[]> {
  const { databases } = createAdminClient();
  const config = useRuntimeConfig();
  const response = await databases.listDocuments(
    config.public.databaseId,
    config.public.articlesCollectionId,
    [
      Query.equal("status", "published"),
      Query.equal("featured", true),
      Query.orderDesc("publishedAt"),
      Query.limit(limit),
    ]
  );

  const articles = response.documents as unknown as Article[];
  if (articles.length === 0) {
    return [];
  }

  const translations = await fetchTranslationsForArticleIds(
    articles.map((article) => article.$id)
  );
  return joinTranslationsByArticle(articles, translations, language);
}

export async function getArticleBySlug(
  slug: string,
  language = "pt-br"
): Promise<Article | null> {
  const { databases } = createAdminClient();
  const config = useRuntimeConfig();

  const transResponse = await databases.listDocuments(
    config.public.databaseId,
    config.public.articleTranslationsCollectionId,
    [Query.equal("slug", slug), Query.limit(50)]
  );

  if (transResponse.total > 0) {
    const docs = transResponse.documents as unknown as ArticleTranslation[];
    const translation = pickTranslationForArticle(docs, language);
    if (translation) {
      const masterId = articleIdFromTranslation(translation);
      if (masterId) {
        try {
          const article = (await databases.getDocument(
            config.public.databaseId,
            config.public.articlesCollectionId,
            masterId
          )) as unknown as Article;
          return { ...article, translation };
        } catch {
          // fallback to legacy lookup
        }
      }
    }
  }

  const masterResponse = await databases.listDocuments(
    config.public.databaseId,
    config.public.articlesCollectionId,
    [Query.equal("slug", slug), Query.limit(1)]
  );

  if (masterResponse.total > 0) {
    const article = masterResponse.documents[0] as unknown as Article;
    const translationResponse = await databases.listDocuments(
      config.public.databaseId,
      config.public.articleTranslationsCollectionId,
      [Query.equal("article_id", article.$id), Query.limit(100)]
    );
    return {
      ...article,
      translation: pickTranslationForArticle(
        translationResponse.documents as unknown as ArticleTranslation[],
        language
      ),
    };
  }

  return null;
}

export async function getArticlesByCategory(
  category: string,
  language = "pt-br",
  limit = 20
): Promise<Article[]> {
  const { databases } = createAdminClient();
  const config = useRuntimeConfig();
  const response = await databases.listDocuments(
    config.public.databaseId,
    config.public.articlesCollectionId,
    [
      Query.equal("status", "published"),
      Query.equal("category", category),
      Query.orderDesc("publishedAt"),
      Query.limit(limit),
    ]
  );

  const articles = response.documents as unknown as Article[];
  if (articles.length === 0) return [];
  const translations = await fetchTranslationsForArticleIds(
    articles.map((article) => article.$id)
  );
  return joinTranslationsByArticle(articles, translations, language);
}

export async function searchPublishedArticles(
  searchTerm: string,
  language = "pt-br",
  limit = 20
): Promise<Article[]> {
  const { databases } = createAdminClient();
  const config = useRuntimeConfig();
  const normalized = searchTerm.trim();
  if (!normalized) return getPublishedArticles(language, limit);

  const translationsById = new Map<string, ArticleTranslation>();
  const fields: Array<
    keyof Pick<ArticleTranslation, "title" | "excerpt" | "content">
  > = ["title", "excerpt", "content"];

  for (const field of fields) {
    try {
      const response = await databases.listDocuments(
        config.public.databaseId,
        config.public.articleTranslationsCollectionId,
        [
          Query.equal("language", language),
          Query.search(field, normalized),
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
    } catch {
      // continue with other fields
    }
  }

  if (translationsById.size > 0) {
    const masters = await databases.listDocuments(
      config.public.databaseId,
      config.public.articlesCollectionId,
      [
        Query.equal("$id", Array.from(translationsById.keys())),
        Query.equal("status", "published"),
        Query.orderDesc("publishedAt"),
        Query.limit(limit),
      ]
    );

    return (masters.documents as unknown as Article[]).map((article) => ({
      ...article,
      translation: translationsById.get(article.$id),
    }));
  }

  try {
    const fallback = await databases.listDocuments(
      config.public.databaseId,
      config.public.articlesCollectionId,
      [
        Query.equal("status", "published"),
        Query.search("title", normalized),
        Query.orderDesc("publishedAt"),
        Query.limit(limit),
      ]
    );
    return fallback.documents as unknown as Article[];
  } catch {
    return [];
  }
}

export async function getAllArticles(limit = 1000): Promise<Article[]> {
  const { databases } = createAdminClient();
  const config = useRuntimeConfig();
  const response = await databases.listDocuments(
    config.public.databaseId,
    config.public.articlesCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(limit)]
  );
  return response.documents as unknown as Article[];
}
