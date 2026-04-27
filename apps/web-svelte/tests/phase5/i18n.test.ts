import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock SvelteKit environment variables
vi.mock("$env/static/public", () => ({
  PUBLIC_APPWRITE_ENDPOINT: "https://localhost/v1",
  PUBLIC_APPWRITE_PROJECT_ID: "test-project",
  PUBLIC_DATABASE_ID: "69e464fb0006a1b3c4eb",
  PUBLIC_ARTICLES_COLLECTION_ID: "articles",
}));

// Mock appwrite module
const mocks = vi.hoisted(() => ({
  mockListDocuments: vi.fn(),
  mockCreateDocument: vi.fn(),
  mockUpdateDocument: vi.fn(),
  mockDeleteDocument: vi.fn(),
  mockGetDocument: vi.fn(),
}));

vi.mock("appwrite", () => {
  return {
    Client: vi.fn().mockImplementation(function () {
      return {
        setEndpoint: vi.fn().mockReturnThis(),
        setProject: vi.fn().mockReturnThis(),
      };
    }),
    Account: vi.fn().mockImplementation(function () {
      return {};
    }),
    Databases: vi.fn().mockImplementation(function () {
      return {
        listDocuments: mocks.mockListDocuments,
        createDocument: mocks.mockCreateDocument,
        updateDocument: mocks.mockUpdateDocument,
        deleteDocument: mocks.mockDeleteDocument,
        getDocument: mocks.mockGetDocument,
      };
    }),
    Storage: vi.fn().mockImplementation(function () {
      return {};
    }),
    ID: { unique: () => "unique-id" },
    Query: {
      equal: (field: string, value: any) => `equal(${field}, ${value})`,
      search: (field: string, value: string) => `search(${field}, ${value})`,
      orderDesc: (field: string) => `orderDesc(${field})`,
      limit: (value: number) => `limit(${value})`,
      offset: (value: number) => `offset(${value})`,
    },
    OAuthProvider: { Google: "google" },
  };
});

import * as appwrite from "../../src/lib/appwrite";

describe("Phase 5: i18n Relational Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch article with correct language translation", async () => {
    // 1. Mock finding translation by slug
    mocks.mockListDocuments.mockResolvedValueOnce({
      total: 1,
      documents: [
        {
          $id: "t-en",
          article_id: "a1",
          language: "en",
          slug: "test-en",
          title: "English Title",
        },
      ],
    });
    // 2. Mock fetching master article
    mocks.mockGetDocument.mockResolvedValueOnce({
      $id: "a1",
      category: "news",
      status: "published",
    });

    const article = await appwrite.getArticleBySlug("test-en", "en");

    expect(article?.translation?.language).toBe("en");
    expect(article?.translation?.title).toBe("English Title");
    expect(article?.$id).toBe("a1");
  });

  it("should correctly join master with translations for listing", async () => {
    // 1. Mock master articles list
    mocks.mockListDocuments.mockResolvedValueOnce({
      total: 2,
      documents: [
        { $id: "a1", status: "published" },
        { $id: "a2", status: "published" },
      ],
    });
    // 2. Mock translations list
    mocks.mockListDocuments.mockResolvedValueOnce({
      total: 2,
      documents: [
        { $id: "t-pt-1", article_id: "a1", language: "pt-br", title: "PT 1" },
        { $id: "t-pt-2", article_id: "a2", language: "pt-br", title: "PT 2" },
      ],
    });

    const articles = await appwrite.getPublishedArticles("pt-br");

    expect(articles).toHaveLength(2);
    expect(articles[0].translation?.title).toBe("PT 1");
    expect(articles[1].translation?.title).toBe("PT 2");
  });

  it("should return null if no translation exists for the requested language", async () => {
    // Mock no translations found
    mocks.mockListDocuments.mockResolvedValueOnce({ total: 0, documents: [] });

    const article = await appwrite.getArticleBySlug("non-existent", "en");
    expect(article).toBeNull();
  });

  it("should search translations and join published master articles", async () => {
    mocks.mockListDocuments
      .mockResolvedValueOnce({
        total: 1,
        documents: [
          {
            $id: "t1",
            article_id: "a1",
            language: "en",
            title: "Mars microbes",
          },
        ],
      })
      .mockResolvedValueOnce({ total: 0, documents: [] })
      .mockResolvedValueOnce({ total: 0, documents: [] })
      .mockResolvedValueOnce({
        total: 1,
        documents: [{ $id: "a1", status: "published", category: "noticias" }],
      });

    const results = await appwrite.searchPublishedArticles("mars", "en");

    expect(results).toHaveLength(1);
    expect(results[0].$id).toBe("a1");
    expect(results[0].translation?.title).toBe("Mars microbes");
  });

  it("getArticlesByCategory uses a translation batch limit above Appwrite default page size", async () => {
    const masters = Array.from({ length: 12 }, (_, i) => ({
      $id: `a${i}`,
      status: "published",
      category: "noticias",
    }));
    mocks.mockListDocuments
      .mockResolvedValueOnce({ total: 12, documents: masters })
      .mockResolvedValueOnce({ total: 0, documents: [] });

    await appwrite.getArticlesByCategory("noticias", "en", 50);

    const transQueries = mocks.mockListDocuments.mock.calls[1][2] as string[];
    const limitToken = transQueries.find((q) => q.startsWith("limit("));
    expect(limitToken).toBeDefined();
    const n = Number(limitToken!.slice(6, -1));
    expect(n).toBeGreaterThanOrEqual(120);
  });

  it("joins translations when article_id is a relationship object", async () => {
    mocks.mockListDocuments
      .mockResolvedValueOnce({
        total: 1,
        documents: [{ $id: "a1", status: "published", category: "noticias" }],
      })
      .mockResolvedValueOnce({
        total: 1,
        documents: [
          {
            $id: "t-en",
            article_id: { $id: "a1" },
            language: "en",
            title: "English Title",
            excerpt: "e",
            slug: "test-en",
            content: "",
          },
        ],
      });

    const articles = await appwrite.getArticlesByCategory("noticias", "en", 50);

    expect(articles[0].translation?.title).toBe("English Title");
  });

  it("picks preferred translation when stored language tag casing differs", async () => {
    mocks.mockListDocuments
      .mockResolvedValueOnce({
        total: 1,
        documents: [{ $id: "a1", status: "published", category: "noticias" }],
      })
      .mockResolvedValueOnce({
        total: 1,
        documents: [
          {
            $id: "t1",
            article_id: "a1",
            language: "EN",
            title: "Mixed Case Lang",
            excerpt: "",
            slug: "x",
            content: "",
          },
        ],
      });

    const articles = await appwrite.getArticlesByCategory("noticias", "en", 50);

    expect(articles[0].translation?.title).toBe("Mixed Case Lang");
  });

  it("getArticleBySlug matches regional language codes on the same slug row", async () => {
    mocks.mockListDocuments.mockResolvedValueOnce({
      total: 1,
      documents: [
        {
          $id: "t-es",
          article_id: "a1",
          language: "es-419",
          slug: "ciencia-colectiva",
          title: "Título ES",
          excerpt: "",
          content: "",
        },
      ],
    });
    mocks.mockGetDocument.mockResolvedValueOnce({
      $id: "a1",
      status: "published",
    });

    const article = await appwrite.getArticleBySlug("ciencia-colectiva", "es");

    expect(article?.translation?.language).toBe("es-419");
    expect(article?.translation?.title).toBe("Título ES");
  });
});
