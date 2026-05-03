import { AppwriteException } from "node-appwrite";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setRuntimeConfig } from "../../mocks/nuxt";
import type { RuntimeConfigStub } from "../../mocks/nuxt-helpers";

const { createDocument, updateDocument, createAdminClient } = vi.hoisted(() => {
  const createDocument = vi.fn();
  const updateDocument = vi.fn();
  const createAdminClient = vi.fn(() => ({
    databases: { createDocument, updateDocument },
  }));
  return { createDocument, updateDocument, createAdminClient };
});

vi.mock("~/server/utils/appwrite", () => ({
  createAdminClient,
  getDatabaseId: () => "test-database",
}));

const loadHandler = () => import("~/server/api/admin/site-settings.post");

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

describe("POST /api/admin/site-settings", () => {
  beforeEach(() => {
    createDocument.mockReset();
    updateDocument.mockReset();
    createAdminClient.mockReturnValue({
      databases: { createDocument, updateDocument },
    });
    setRuntimeConfig(runtime);
    (globalThis as any).readBody = vi.fn();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("throws 401 when user is not authenticated", async () => {
    const handler = (await loadHandler()).default as (
      event: any
    ) => Promise<unknown>;
    await expect(handler({ context: { user: null } })).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it("throws 400 for an invalid layout value", async () => {
    (globalThis as any).readBody = vi.fn().mockResolvedValue({
      layout: "not-a-layout",
    });
    const handler = (await loadHandler()).default as (
      event: any
    ) => Promise<unknown>;
    await expect(
      handler({ context: { user: { $id: "u1" } } })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("creates the document when saving for the first time", async () => {
    (globalThis as any).readBody = vi.fn().mockResolvedValue({
      layout: "grid",
    });
    createDocument.mockResolvedValue({ layout: "grid" });
    const handler = (await loadHandler()).default as (
      event: any
    ) => Promise<unknown>;
    const result = await handler({ context: { user: { $id: "u1" } } });
    expect(createDocument).toHaveBeenCalledWith(
      "test-database",
      "site_settings",
      "global",
      { layout: "grid" }
    );
    expect(result).toEqual({ layout: "grid" });
  });

  it("updates the existing document when createDocument returns 409", async () => {
    (globalThis as any).readBody = vi.fn().mockResolvedValue({
      layout: "magazine",
    });
    createDocument.mockRejectedValue(
      new AppwriteException(
        "Document already exists",
        409,
        "document_already_exists",
        ""
      )
    );
    updateDocument.mockResolvedValue({ layout: "magazine" });
    const handler = (await loadHandler()).default as (
      event: any
    ) => Promise<unknown>;
    const result = await handler({ context: { user: { $id: "u1" } } });
    expect(updateDocument).toHaveBeenCalledWith(
      "test-database",
      "site_settings",
      "global",
      { layout: "magazine" }
    );
    expect(result).toEqual({ layout: "magazine" });
  });
});
