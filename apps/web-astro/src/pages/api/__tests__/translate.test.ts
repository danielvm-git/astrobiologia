import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockGetEnv } from "./helpers/mock-appwrite";
import "./helpers/mock-appwrite";

const mockUser = { $id: "user_1", name: "Admin" };

describe("POST /api/admin/translate", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    mockGetEnv.mockImplementation((key: string) => {
      if (key === "DEEPL_API_KEY") return "";
      return "";
    });
  });

  it("returns 401 when not authenticated", async () => {
    const { POST } = await import("../admin/translate");
    const res = await POST({
      locals: {},
      request: new Request("http://localhost/api/admin/translate", {
        method: "POST",
        body: JSON.stringify({ text: "Olá", targetLang: "en" }),
      }),
    } as unknown as Parameters<typeof POST>[0]);
    expect(res.status).toBe(401);
  });

  it("returns 503 when DEEPL_API_KEY is not configured", async () => {
    const { POST } = await import("../admin/translate");
    const res = await POST({
      locals: { user: mockUser },
      request: new Request("http://localhost/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Olá", targetLang: "en" }),
      }),
    } as unknown as Parameters<typeof POST>[0]);
    expect(res.status).toBe(503);
  });

  it("returns translated text when DeepL responds OK", async () => {
    mockGetEnv.mockImplementation((key: string) =>
      key === "DEEPL_API_KEY" ? "key:fx" : ""
    );
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ translations: [{ text: "Hello" }] }),
      })
    );

    const { POST } = await import("../admin/translate");
    const res = await POST({
      locals: { user: mockUser },
      request: new Request("http://localhost/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Olá", targetLang: "en" }),
      }),
    } as unknown as Parameters<typeof POST>[0]);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.translated).toBe("Hello");
  });
});
