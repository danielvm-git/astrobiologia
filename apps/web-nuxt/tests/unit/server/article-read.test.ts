// Covers: SEARCH-003, SEARCH-005, SEARCH-006, SEARCH-007, SEARCH-008
import { Query } from "node-appwrite";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  articleFactory,
  translationFactory,
} from "../../fixtures/articles.fixture";
import { setRuntimeConfig } from "../../mocks/nuxt";
import type { RuntimeConfigStub } from "../../mocks/nuxt-helpers";

const { listDocuments, createAdminClient } = vi.hoisted(() => {
  const listDocuments = vi.fn();
  const createAdminClient = vi.fn(() => ({ databases: { listDocuments } }));
  return { listDocuments, createAdminClient };
});

vi.mock("~/server/utils/appwrite", () => ({
  createAdminClient,
  getDatabaseId: () => "test-database",
}));

const loadArticleRead = () => import("~/server/utils/article-read");

const runtime: RuntimeConfigStub = {
  appwriteApiKey: "key",
  public: {
    appwriteEndpoint: "https://example.com",
    appwriteProjectId: "p1",
    databaseId: "test-database",
    articlesCollectionId: "articles",
    articleTranslationsCollectionId: "translations",
    categoriesCollectionId: "categories",
    storageBucketId: "storage",
  },
};

describe("searchPublishedArticles", () => {
  beforeEach(() => {
    listDocuments.mockReset();
    createAdminClient.mockReturnValue({ databases: { listDocuments } });
    setRuntimeConfig(runtime);
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("returns getPublishedArticles when search term is empty or whitespace", async () => {
    const master = articleFactory({ $id: "a1" });
    listDocuments.mockImplementation(async (_db, collectionId) => {
      if (collectionId === runtime.public.articlesCollectionId) {
        return { total: 1, documents: [master] };
      }
      return { total: 0, documents: [] };
    });

    const { searchPublishedArticles } = await loadArticleRead();
    const withWhitespace = await searchPublishedArticles("   \t", "pt-br", 5);
    expect(withWhitespace[0].$id).toBe("a1");
  });

  it("keeps the translation from the first matching field search", async () => {
    const titleTr = translationFactory({
      $id: "t-title",
      title: "exoplaneta alvo",
    });
    const master = articleFactory({ $id: "art-1" });
    let calls = 0;
    listDocuments.mockImplementation(async (_db, collectionId) => {
      if (collectionId === runtime.public.articleTranslationsCollectionId) {
        calls += 1;
        if (calls === 1) {
          return { total: 1, documents: [titleTr] };
        }
        return { total: 0, documents: [] };
      }
      if (collectionId === runtime.public.articlesCollectionId) {
        return { total: 1, documents: [master] };
      }
      return { total: 0, documents: [] };
    });

    const { searchPublishedArticles } = await loadArticleRead();
    const res = await searchPublishedArticles("exoplaneta", "pt-br", 10);
    expect(res[0].translation?.$id).toBe("t-title");
    expect(res[0].$id).toBe("art-1");
  });

  it("falls back to published articles by title when translation search is empty", async () => {
    const master = articleFactory({ $id: "m-fallback", title: "Marte antigo" });
    listDocuments.mockImplementation(async (_db, collectionId) => {
      if (collectionId === runtime.public.articleTranslationsCollectionId) {
        return { total: 0, documents: [] };
      }
      if (collectionId === runtime.public.articlesCollectionId) {
        return { total: 1, documents: [master] };
      }
      return { total: 0, documents: [] };
    });

    const { searchPublishedArticles } = await loadArticleRead();
    const res = await searchPublishedArticles("Marte", "en", 10);
    expect(res[0].$id).toBe("m-fallback");
  });

  it("applies the requested limit to translation and article queries", async () => {
    const tr = translationFactory({ $id: "t1" });
    const master = articleFactory({ $id: "a99" });
    listDocuments.mockImplementation(async (_db, collectionId) => {
      if (collectionId === runtime.public.articleTranslationsCollectionId) {
        return { total: 1, documents: [tr] };
      }
      if (collectionId === runtime.public.articlesCollectionId) {
        return { total: 1, documents: [master] };
      }
      return { total: 0, documents: [] };
    });

    const { searchPublishedArticles } = await loadArticleRead();
    await searchPublishedArticles("term", "pt-br", 30);
    const databaseId = runtime.public.databaseId;
    expect(
      listDocuments.mock.calls.some(
        (call) =>
          call[0] === databaseId &&
          call[1] === runtime.public.articleTranslationsCollectionId &&
          (call[2] as string[]).includes(Query.limit(30))
      )
    ).toBe(true);
    expect(
      listDocuments.mock.calls.some(
        (call) =>
          call[0] === databaseId &&
          call[1] === runtime.public.articlesCollectionId &&
          (call[2] as string[]).includes(Query.limit(30))
      )
    ).toBe(true);
  });
});
