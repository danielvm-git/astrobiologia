import type { Article, ArticleTranslation } from "~/types/article";

export const articleFactory = (overrides: Partial<Article> = {}): Article => ({
  $id: "art-1",
  $createdAt: "2024-01-01T00:00:00.000Z",
  $updatedAt: "2024-02-01T00:00:00.000Z",
  category: "noticias",
  tags: ["space"],
  status: "published",
  featured: false,
  authorId: "author-1",
  authorName: "Test Author",
  publishedAt: "2024-01-15T00:00:00.000Z",
  ...overrides,
});

export const translationFactory = (
  overrides: Partial<ArticleTranslation> = {}
): ArticleTranslation => ({
  $id: "tr-1",
  article_id: "art-1",
  language: "pt-br",
  title: "Lua e possibilidade de vida",
  slug: "lua-vida",
  excerpt: "Resumo do artigo",
  content: "Conteúdo longo com termos técnicos",
  ...overrides,
});
