import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { deriveArticleSlug } from "../article-editor-slug";

describe("deriveArticleSlug", () => {
  beforeEach(() => {
    vi.spyOn(Date, "now").mockReturnValue(1_700_000_000_000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("slugifies latin titles", () => {
    expect(
      deriveArticleSlug({
        activeLocale: "pt-br",
        title: "Vida em Marte",
        ptBrSlug: "",
      })
    ).toBe("vida-em-marte");
  });

  it("uses pt-br slug suffix for non-latin titles on secondary locales", () => {
    expect(
      deriveArticleSlug({
        activeLocale: "ja",
        title: "火星の生命",
        ptBrSlug: "vida-em-marte",
      })
    ).toBe("vida-em-marte-ja");
  });
});
