import type { Article, ArticleTranslation } from "../../src/lib/appwrite";

/**
 * Article and Translation Factories for Testing
 */

export const createArticle = (overrides: Partial<Article> = {}): Article => ({
  $id: "article_" + Math.random().toString(36).substr(2, 9),
  $createdAt: new Date().toISOString(),
  $updatedAt: new Date().toISOString(),
  category: "noticias",
  tags: ["test"],
  featured: false,
  status: "published",
  authorId: "user_123",
  authorName: "Test Author",
  publishedAt: new Date().toISOString(),
  ...overrides,
});

export const createArticleTranslation = (
  articleId: string,
  language = "pt-br",
  overrides: Partial<ArticleTranslation> = {}
): ArticleTranslation => ({
  $id: "trans_" + Math.random().toString(36).substr(2, 9),
  article_id: articleId,
  language,
  title: "Test Article " + language,
  slug: "test-article-" + language,
  excerpt: "Test excerpt",
  content: "<p>Test content</p>",
  ...overrides,
});

/**
 * Creates a joined Article with translation
 */
export const createFullArticle = (
  language = "pt-br",
  overrides: Partial<Article> = {}
): Article => {
  const article = createArticle(overrides);
  const translation = createArticleTranslation(article.$id, language);
  return {
    ...article,
    translation,
  };
};
