import { ARTICLE_LOCALES } from "@/lib/article-locales";

export type ArticleTranslation = {
  language: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
};

export type ArticleTranslationTitleFields = { title?: string };

export type ArticleMeta = {
  category: string;
  tags: string[];
  featuredImage: string;
  featuredImageAlt: string;
  status: "draft" | "published";
  featured: boolean;
  authorName: string;
  publishedAt: string;
};

export const ARTICLE_CATEGORIES = [
  "noticias",
  "entrevistas",
  "analises",
  "pesquisas-brasileiras",
  "exoplanetas",
  "extremofilos",
] as const;

export function emptyArticleTranslation(language: string): ArticleTranslation {
  return {
    language,
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
  };
}

export function defaultArticleMeta(): ArticleMeta {
  return {
    category: "noticias",
    tags: [],
    featuredImage: "",
    featuredImageAlt: "",
    status: "draft",
    featured: false,
    authorName: "Admin",
    publishedAt: new Date().toISOString().slice(0, 16),
  };
}

export function emptyTranslationsByLocale(): Record<
  string,
  ArticleTranslation
> {
  return Object.fromEntries(
    ARTICLE_LOCALES.map((l) => [l, emptyArticleTranslation(l)])
  );
}
