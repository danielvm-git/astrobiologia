import { vi, type Mock } from "vitest";

const defaultRuntime = () => ({
  appwriteApiKey: process.env.APPWRITE_API_KEY ?? "test-api-key",
  public: {
    appwriteEndpoint: "https://cloud.appwrite.io/v1",
    appwriteProjectId:
      process.env.NUXT_PUBLIC_APPWRITE_PROJECT_ID ?? "test-project",
    databaseId: process.env.NUXT_PUBLIC_DATABASE_ID ?? "test-database",
    articlesCollectionId:
      process.env.NUXT_PUBLIC_ARTICLES_COLLECTION_ID ?? "articles",
    articleTranslationsCollectionId:
      process.env.NUXT_PUBLIC_ARTICLE_TRANSLATIONS_COLLECTION_ID ??
      "translations",
    categoriesCollectionId:
      process.env.NUXT_PUBLIC_CATEGORIES_COLLECTION_ID ?? "categories",
    storageBucketId: process.env.NUXT_PUBLIC_STORAGE_BUCKET_ID ?? "bucket",
  },
});

type NuxtTestGlobals = typeof globalThis & {
  useRuntimeConfig: Mock<() => ReturnType<typeof defaultRuntime>>;
  getQuery: Mock;
  getHeader: Mock;
  setCookie: Mock;
  getCookie: Mock;
  createError: (options: {
    statusCode: number;
    statusMessage: string;
  }) => Error & { statusCode: number };
  defineEventHandler: (handler: unknown) => unknown;
};

const g = globalThis as NuxtTestGlobals;

g.defineEventHandler = (handler: unknown) => handler;
g.getQuery = vi.fn();
g.getHeader = vi.fn();
g.setCookie = vi.fn();
g.getCookie = vi.fn();
g.createError = (options) => {
  const err = new Error(options.statusMessage) as Error & {
    statusCode: number;
  };
  err.statusCode = options.statusCode;
  return err;
};

g.useRuntimeConfig = vi.fn(defaultRuntime);
