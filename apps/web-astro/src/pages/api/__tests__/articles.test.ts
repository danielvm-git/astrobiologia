import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  mockCreateDocument,
  mockGetDocument,
  mockGetEnv,
  mockListDocuments,
  mockUpdateDocument,
  resetAppwriteMocks,
} from "./helpers/mock-appwrite";
import "./helpers/mock-appwrite";

const mockUser = { $id: "user_1", name: "Admin" };

describe("POST /api/admin/articles", () => {
  beforeEach(() => {
    resetAppwriteMocks();
    mockCreateDocument.mockResolvedValue({ $id: "art_new" });
  });

  it("returns 401 when not authenticated", async () => {
    const { POST } = await import("../admin/articles/index");
    const res = await POST({
      locals: {},
      request: new Request("http://localhost/api/admin/articles", {
        method: "POST",
        body: JSON.stringify({ title: "Título" }),
      }),
    } as unknown as Parameters<typeof POST>[0]);
    expect(res.status).toBe(401);
  });

  it("returns 400 when pt-br title is empty", async () => {
    const { POST } = await import("../admin/articles/index");
    const res = await POST({
      locals: { user: mockUser },
      request: new Request("http://localhost/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          translations: [{ language: "pt-br", title: "   " }],
        }),
      }),
    } as unknown as Parameters<typeof POST>[0]);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("O título é obrigatório.");
  });

  it("creates article and translations on success", async () => {
    const { POST } = await import("../admin/articles/index");
    const res = await POST({
      locals: { user: mockUser },
      request: new Request("http://localhost/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          translations: [
            {
              language: "pt-br",
              title: "Título válido",
              slug: "titulo-valido",
              content: "<p>Conteúdo</p>",
            },
          ],
          status: "published",
        }),
      }),
    } as unknown as Parameters<typeof POST>[0]);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.id).toBe("art_new");
    expect(mockCreateDocument).toHaveBeenCalled();
    const db = mockGetEnv("DATABASE_ID");
    expect(mockCreateDocument.mock.calls[0][0]).toBe(db);
  });
});

describe("PUT /api/admin/articles/[id]", () => {
  beforeEach(() => {
    resetAppwriteMocks();
    mockGetDocument.mockResolvedValue({ $id: "art_1" });
    mockListDocuments.mockResolvedValue({ documents: [] });
    mockUpdateDocument.mockResolvedValue({});
  });

  it("returns 400 when pt-br title cleared in translations", async () => {
    const { ALL } = await import("../admin/articles/[id]");
    const res = await ALL({
      locals: { user: mockUser },
      params: { id: "art_1" },
      request: new Request("http://localhost/api/admin/articles/art_1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          translations: [{ language: "pt-br", title: "" }],
        }),
      }),
    } as unknown as Parameters<typeof ALL>[0]);
    expect(res.status).toBe(400);
  });

  it("skips empty non-primary translation on update", async () => {
    const { ALL } = await import("../admin/articles/[id]");
    mockListDocuments.mockResolvedValue({
      documents: [{ $id: "trans_pt", language: "pt-br" }],
    });
    const res = await ALL({
      locals: { user: mockUser },
      params: { id: "art_1" },
      request: new Request("http://localhost/api/admin/articles/art_1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          translations: [
            { language: "pt-br", title: "Título", slug: "titulo" },
            { language: "en", title: "", content: "" },
          ],
        }),
      }),
    } as unknown as Parameters<typeof ALL>[0]);
    expect(res.status).toBe(200);
    const enCreates = mockCreateDocument.mock.calls.filter(
      (c) => c[2] && (c[2] as { language?: string }).language === "en"
    );
    expect(enCreates).toHaveLength(0);
  });

  it("updates translation with missing metaDescription (undefined), sending empty string to Appwrite", async () => {
    const { ALL } = await import("../admin/articles/[id]");
    resetAppwriteMocks();
    mockGetDocument.mockResolvedValue({ $id: "art_1" });
    mockUpdateDocument.mockResolvedValue({});
    mockListDocuments.mockResolvedValue({
      documents: [{ $id: "trans_pt", language: "pt-br" }],
    });
    const res = await ALL({
      locals: { user: mockUser },
      params: { id: "art_1" },
      request: new Request("http://localhost/api/admin/articles/art_1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          translations: [
            {
              language: "pt-br",
              title: "Título",
              slug: "titulo",
              content: "Conteúdo",
              excerpt: "Excerpt",
              metaTitle: undefined,
              metaDescription: undefined,
            },
          ],
        }),
      }),
    } as unknown as Parameters<typeof ALL>[0]);
    expect(res.status).toBe(200);
    expect(mockUpdateDocument).toHaveBeenCalled();
    // First call is article update, second call is translation update
    const translationUpdateCall = mockUpdateDocument.mock.calls[1];
    expect(translationUpdateCall).toBeDefined();
    const updatePayload = translationUpdateCall[3];
    expect(updatePayload).toBeDefined();
    expect(updatePayload.metaDescription).toBe("");
    expect(typeof updatePayload.metaDescription).toBe("string");
  });

  it("truncates metaDescription over 500 chars to 500 chars", async () => {
    const { ALL } = await import("../admin/articles/[id]");
    resetAppwriteMocks();
    mockGetDocument.mockResolvedValue({ $id: "art_1" });
    mockUpdateDocument.mockResolvedValue({});
    const longDesc = "a".repeat(600);
    mockListDocuments.mockResolvedValue({
      documents: [{ $id: "trans_pt", language: "pt-br" }],
    });
    const res = await ALL({
      locals: { user: mockUser },
      params: { id: "art_1" },
      request: new Request("http://localhost/api/admin/articles/art_1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          translations: [
            {
              language: "pt-br",
              title: "Título",
              slug: "titulo",
              content: "Conteúdo",
              metaDescription: longDesc,
            },
          ],
        }),
      }),
    } as unknown as Parameters<typeof ALL>[0]);
    expect(res.status).toBe(200);
    // First call is article update, second call is translation update
    const translationUpdateCall = mockUpdateDocument.mock.calls[1];
    const updatePayload = translationUpdateCall[3];
    expect(updatePayload.metaDescription).toBe("a".repeat(500));
    expect(updatePayload.metaDescription.length).toBeLessThanOrEqual(500);
  });
});
