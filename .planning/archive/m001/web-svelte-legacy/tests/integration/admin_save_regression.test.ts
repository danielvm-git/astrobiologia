import { describe, it, expect, vi, beforeEach } from "vitest";
import { actions } from "../../src/routes/admin/artigos/[id]/edit/+page.server";
import { createAdminClient, DATABASE_ID } from "../../src/lib/server/appwrite";
import { COLLECTIONS } from "../../src/lib/appwrite";

// Mock dependencies
vi.mock("../../src/lib/server/appwrite", () => ({
  createAdminClient: vi.fn(),
  DATABASE_ID: "test-db",
}));

vi.mock("../../src/lib/appwrite", () => ({
  COLLECTIONS: {
    ARTICLES: "articles",
    ARTICLES_TRANSLATIONS: "article_translations",
  },
}));

describe("Admin Save Action Regression", () => {
  let mockDatabases: any;

  beforeEach(() => {
    mockDatabases = {
      updateDocument: vi.fn().mockResolvedValue({}),
      listDocuments: vi.fn().mockResolvedValue({ documents: [] }),
      createDocument: vi.fn().mockResolvedValue({}),
    };
    (createAdminClient as any).mockReturnValue({ databases: mockDatabases });
  });

  it("should sanitize data and strip forbidden fields like updatedAt", async () => {
    const formData = new FormData();
    formData.append(
      "articleData",
      JSON.stringify({
        category: "news",
        updatedAt: "2026-01-01", // Forbidden
        $id: "master-id", // Forbidden
        featured: true,
      })
    );
    formData.append(
      "translations",
      JSON.stringify([
        {
          language: "pt-br",
          title: "Test Title",
          $id: "trans-id", // Forbidden
        },
      ])
    );

    const event = {
      params: { id: "master-id" },
      request: {
        formData: async () => formData,
      },
    } as any;

    const result = await actions.save(event);

    expect(result).toEqual({ success: true });

    // Check master update
    expect(mockDatabases.updateDocument).toHaveBeenCalledWith(
      "test-db",
      "articles",
      "master-id",
      {
        category: "news",
        featured: true,
      }
    );

    // Check translation creation (since listDocuments returned empty)
    expect(mockDatabases.createDocument).toHaveBeenCalledWith(
      "test-db",
      "article_translations",
      expect.any(String),
      expect.objectContaining({
        language: "pt-br",
        title: "Test Title",
        article_id: "master-id",
      })
    );

    // Ensure $id was NOT passed to createDocument
    const lastCallArgs = mockDatabases.createDocument.mock.calls[0][3];
    expect(lastCallArgs).not.toHaveProperty("$id");
  });
});
