import { AppwriteException } from "node-appwrite";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setRuntimeConfig } from "../../mocks/nuxt";
import type { RuntimeConfigStub } from "../../mocks/nuxt-helpers";

const { getDocument, createAdminClient } = vi.hoisted(() => {
  const getDocument = vi.fn();
  const createAdminClient = vi.fn(() => ({ databases: { getDocument } }));
  return { getDocument, createAdminClient };
});

vi.mock("~/server/utils/appwrite", () => ({
  createAdminClient,
  getDatabaseId: () => "test-database",
}));

vi.mock("~/server/utils/logger", () => ({
  createLogger: () => ({ error: vi.fn(), debug: vi.fn(), warn: vi.fn() }),
}));

const loadHandler = () => import("~/server/api/site-settings.get");

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
    siteSettingsCollectionId: "site_settings",
  },
};

describe("GET /api/site-settings", () => {
  beforeEach(() => {
    getDocument.mockReset();
    createAdminClient.mockReturnValue({ databases: { getDocument } });
    setRuntimeConfig(runtime);
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("returns the stored layout when document exists", async () => {
    getDocument.mockResolvedValue({ layout: "magazine" });
    const handler = (await loadHandler()).default as (
      event: unknown
    ) => Promise<unknown>;
    const result = await handler({});
    expect(result).toEqual({ layout: "magazine" });
  });

  it("returns hero-grid when document does not exist (404)", async () => {
    getDocument.mockRejectedValue(
      new AppwriteException("Not found", 404, "document_not_found", "")
    );
    const handler = (await loadHandler()).default as (
      event: unknown
    ) => Promise<unknown>;
    const result = await handler({});
    expect(result).toEqual({ layout: "hero-grid" });
  });

  it("returns hero-grid for an invalid layout string", async () => {
    getDocument.mockResolvedValue({ layout: "not-a-valid-layout" });
    const handler = (await loadHandler()).default as (
      event: unknown
    ) => Promise<unknown>;
    const result = await handler({});
    expect(result).toEqual({ layout: "hero-grid" });
  });

  it("returns hero-grid when Appwrite throws an unexpected error", async () => {
    getDocument.mockRejectedValue(new Error("network timeout"));
    const handler = (await loadHandler()).default as (
      event: unknown
    ) => Promise<unknown>;
    const result = await handler({});
    expect(result).toEqual({ layout: "hero-grid" });
  });
});
