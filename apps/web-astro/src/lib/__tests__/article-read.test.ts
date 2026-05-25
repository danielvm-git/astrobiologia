import { describe, it, expect } from "vitest";
import type { ArticleTranslation } from "../types";
import { pickTranslationForArticle } from "../article-read";

const makeTrans = (language: string, title = "T"): ArticleTranslation => ({
  $id: language,
  article_id: "a1",
  language,
  title,
  slug: "s",
  excerpt: "e",
  content: "c",
});

describe("pickTranslationForArticle", () => {
  it("returns undefined for empty array", () => {
    expect(pickTranslationForArticle([], "en")).toBeUndefined();
  });

  it("returns exact match", () => {
    const trans = [makeTrans("en"), makeTrans("pt-br")];
    expect(pickTranslationForArticle(trans, "en")?.language).toBe("en");
  });

  it("falls back to pt-br when preferred not found", () => {
    const trans = [makeTrans("pt-br"), makeTrans("es")];
    expect(pickTranslationForArticle(trans, "ja")?.language).toBe("pt-br");
  });

  it("falls back to first translation when nothing matches", () => {
    const trans = [makeTrans("zh"), makeTrans("nl")];
    expect(pickTranslationForArticle(trans, "ja")?.language).toBe("zh");
  });

  it("prefers exact match over primary subtag match", () => {
    // pt-pt is not in the list, so pt-br matches via primary subtag
    const trans = [makeTrans("pt-br"), makeTrans("es")];
    expect(pickTranslationForArticle(trans, "pt-pt")?.language).toBe("pt-br");
  });

  it("falls back to en when preferred not found and no pt-br", () => {
    const trans = [makeTrans("en"), makeTrans("es")];
    expect(pickTranslationForArticle(trans, "ja")?.language).toBe("en");
  });

  it("matches by primary subtag before falling back to pt-br", () => {
    const trans = [makeTrans("pt-pt"), makeTrans("es")];
    expect(pickTranslationForArticle(trans, "pt-br")?.language).toBe("pt-pt");
  });

  it("returns the only translation for single-item array", () => {
    const trans = [makeTrans("es")];
    expect(pickTranslationForArticle(trans, "en")?.language).toBe("es");
  });

  it("handles case-insensitive matching via localeTagsMatch", () => {
    const trans = [makeTrans("en")];
    expect(pickTranslationForArticle(trans, "EN")?.language).toBe("en");
  });
});
