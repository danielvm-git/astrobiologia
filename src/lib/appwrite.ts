import { ID, Query, OAuthProvider } from "appwrite";
import {
  account,
  databases,
  storage,
  DATABASE_ID,
  COLLECTIONS,
  STORAGE_BUCKET_ID,
} from "./appwrite-datasets";

export {
  account,
  databases,
  storage,
  DATABASE_ID,
  COLLECTIONS,
  STORAGE_BUCKET_ID,
} from "./appwrite-datasets";

// Types
export interface User {
  $id: string;
  email: string;
  name: string;
  labels?: string[];
}

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
  language?: string; // Legacy fallback
  // Joined translation data
  translation?: ArticleTranslation;
  // Fallback fields for legacy support during migration
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
}

export interface Category {
  $id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

// Auth helpers
export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await account.get();
    return user as User;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<User> {
  await account.createEmailPasswordSession(email, password);
  return (await account.get()) as User;
}

export async function logout(): Promise<void> {
  await account.deleteSession("current");
}

export async function createArticle(
  data: Omit<Article, "$id" | "$createdAt" | "$updatedAt" | "translation">
): Promise<Article> {
  const response = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.ARTICLES,
    ID.unique(),
    data
  );
  return response as unknown as Article;
}

export async function createTranslation(
  data: Omit<ArticleTranslation, "$id">
): Promise<ArticleTranslation> {
  const response = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.ARTICLES_TRANSLATIONS,
    ID.unique(),
    data
  );
  return response as unknown as ArticleTranslation;
}

export async function updateArticle(
  id: string,
  data: Partial<Article>
): Promise<Article> {
  const { translation, ...masterData } = data;
  const response = await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.ARTICLES,
    id,
    masterData
  );
  return response as unknown as Article;
}

export async function updateTranslation(
  id: string,
  data: Partial<ArticleTranslation>
): Promise<ArticleTranslation> {
  const response = await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.ARTICLES_TRANSLATIONS,
    id,
    data
  );
  return response as unknown as ArticleTranslation;
}

export async function deleteArticle(id: string): Promise<void> {
  // 1. Delete all translations
  const trans = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.ARTICLES_TRANSLATIONS,
    [Query.equal("article_id", id)]
  );
  for (const t of trans.documents) {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.ARTICLES_TRANSLATIONS,
      t.$id
    );
  }
  // 2. Delete master
  await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ARTICLES, id);
}

// Image helpers
export function getImageUrl(fileId: string, width = 800, height = 600): string {
  if (!fileId) return "";
  if (fileId.startsWith("http")) return fileId;
  return storage
    .getFilePreview(STORAGE_BUCKET_ID, fileId, width, height)
    .toString();
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Upload failed");
  }

  const data = await response.json();
  return data.fileId;
}

export async function deleteImage(fileId: string): Promise<void> {
  await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
}

// Categories (static for now, can be moved to DB later)
export const CATEGORIES: Category[] = [
  {
    $id: "noticias",
    name: "Notícias",
    slug: "noticias",
    description: "Últimas notícias sobre astrobiologia",
    color: "primary",
  },
  {
    $id: "entrevistas",
    name: "Entrevistas",
    slug: "entrevistas",
    description: "Conversas com cientistas e pesquisadores",
    color: "secondary",
  },
  {
    $id: "analises",
    name: "Análises",
    slug: "analises",
    description: "Análises profundas sobre temas científicos",
    color: "accent",
  },
  {
    $id: "pesquisas-brasileiras",
    name: "Pesquisas Brasileiras",
    slug: "pesquisas-brasileiras",
    description: "Destaque para a ciência feita no Brasil",
    color: "primary",
  },
  {
    $id: "exoplanetas",
    name: "Exoplanetas",
    slug: "exoplanetas",
    description: "Mundos além do Sistema Solar",
    color: "secondary",
  },
  {
    $id: "extremofilos",
    name: "Extremófilos",
    slug: "extremofilos",
    description: "Vida em condições extremas",
    color: "accent",
  },
];

export {
  getAllArticles,
  getArticleBySlug,
  getArticleTranslations,
  getArticlesByCategory,
  getFeaturedArticles,
  getPublishedArticles,
  searchPublishedArticles,
} from "./data/article-read";

export { ID, Query, OAuthProvider };
