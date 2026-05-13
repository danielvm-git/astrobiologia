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
});
