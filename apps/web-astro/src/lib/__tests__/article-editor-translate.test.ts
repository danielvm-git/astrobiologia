import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildTranslatedLocaleFields } from "../article-editor-translate";
import type { ArticleTranslation } from "../article-editor-types";

const source: ArticleTranslation = {
  language: "pt-br",
  title: "Título PT",
  slug: "titulo-pt",
  excerpt: "Resumo PT",
  content: "<p>Conteúdo PT</p>",
  metaTitle: "Meta Título PT",
  metaDescription: "Meta descrição PT",
};

describe("buildTranslatedLocaleFields", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("rejects when translate API returns non-OK response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({ error: "DEEPL_API_KEY não configurada" }),
      })
    );

    await expect(
      buildTranslatedLocaleFields(source, "en", {
        existingSlug: "",
        ptBrSlug: "titulo-pt",
      })
    ).rejects.toThrow();
  });

  it("returns all five translated text fields and derived slug", async () => {
    const translations: Record<string, string> = {
      "Título PT": "English Title",
      "Resumo PT": "English Excerpt",
      "<p>Conteúdo PT</p>": "<p>English Content</p>",
      "Meta Título PT": "English Meta Title",
      "Meta descrição PT": "English Meta Description",
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(async (_url, init) => {
        const body = JSON.parse(String(init?.body)) as { text: string };
        return {
          ok: true,
          json: async () => ({
            translated: translations[body.text] ?? body.text,
          }),
        };
      })
    );

    const result = await buildTranslatedLocaleFields(source, "en", {
      existingSlug: "",
      ptBrSlug: "titulo-pt",
    });

    expect(result).toEqual({
      language: "en",
      title: "English Title",
      slug: "titulo-pt-en",
      excerpt: "English Excerpt",
      content: "<p>English Content</p>",
      metaTitle: "English Meta Title",
      metaDescription: "English Meta Description",
    });
  });
});
