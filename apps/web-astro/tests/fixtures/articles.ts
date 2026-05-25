// test-only — do not import in production code
import type { Article, ArticleTranslation } from "../../src/lib/types";

export function createArticle(overrides: Partial<Article> = {}): Article {
  return {
    $id: crypto.randomUUID(),
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    category: "noticias",
    tags: ["test"],
    featuredImage: undefined,
    featuredImageAlt: undefined,
    status: "published",
    featured: false,
    authorId: "user_default",
    authorName: "Test Author",
    publishedAt: new Date("2025-01-01").toISOString(),
    translation: undefined,
    ...overrides,
  };
}

export function createArticleList(
  count = 5,
  overrides: Partial<Article> = {}
): Article[] {
  return Array.from({ length: count }, (_, i) =>
    createArticle({
      $id: crypto.randomUUID(),
      ...overrides,
    })
  );
}

export function createArticleTranslation(
  overrides: Partial<ArticleTranslation> = {}
): ArticleTranslation {
  return {
    $id: crypto.randomUUID(),
    article_id: "article_default",
    language: "pt-br",
    title: "Default Translation Title",
    slug: "default-translation-title",
    excerpt: "Default excerpt for testing.",
    content: "Default content for testing purposes.",
    metaTitle: undefined,
    metaDescription: undefined,
    ...overrides,
  };
}

export function createArticleTranslationList(
  count = 3,
  languages = ["pt-br", "en", "es"],
  articleId = "article_default"
): ArticleTranslation[] {
  return Array.from({ length: count }, (_, i) => {
    if (i >= languages.length) {
      throw new RangeError(
        `createArticleTranslationList: count (${count}) exceeds languages (${languages.length})`
      );
    }
    return createArticleTranslation({
      $id: crypto.randomUUID(),
      article_id: articleId,
      language: languages[i],
      title: `Translation ${i + 1}`,
      slug: `translation-${i + 1}`,
    });
  });
}
