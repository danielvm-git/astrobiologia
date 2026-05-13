import { describe, it, expect } from "vitest";
import type { ArticleTranslation } from "../types";

// We test the translation-picking logic in isolation
// by replicating the pure helper here
function pickTranslationForArticle(
  translations: ArticleTranslation[],
  preferredLanguage: string
): ArticleTranslation | undefined {
  if (translations.length === 0) return undefined;
  const normalize = (s: string) => s.trim().toLowerCase().replace(/_/g, "-");
  const primary = (s: string) => {
    const n = normalize(s);
    const idx = n.indexOf("-");
    return idx === -1 ? n : n.slice(0, idx);
  };
  return (
    translations.find(
      (t) => normalize(t.language) === normalize(preferredLanguage)
    ) ||
    translations.find(
      (t) =>
        primary(normalize(t.language)) === primary(normalize(preferredLanguage))
    ) ||
    translations.find((t) => normalize(t.language) === "pt-br") ||
    translations.find((t) => normalize(t.language) === "en") ||
    translations[0]
  );
}

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
