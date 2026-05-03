export interface ArticleTranslation {
  $id: string;
  article_id: string;
  language: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Article {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  status: "draft" | "published";
  featured: boolean;
  authorId: string;
  authorName: string;
  publishedAt?: string;
  ogImage?: string;
  language?: string;
  translation?: ArticleTranslation;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
}
