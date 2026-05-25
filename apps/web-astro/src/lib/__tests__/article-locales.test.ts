import { describe, it, expect } from "vitest";
import { ARTICLE_LOCALES, getArticleLocaleLabels } from "../article-locales";

describe("article-locales", () => {
  describe("ARTICLE_LOCALES", () => {
    it("contains expected locale codes", () => {
      expect(ARTICLE_LOCALES).toEqual(["pt-br", "en", "nl", "es", "ja", "zh"]);
    });

    it("has exactly 6 locales", () => {
      expect(ARTICLE_LOCALES).toHaveLength(6);
    });
  });

  describe("getArticleLocaleLabels", () => {
    it("returns a label for every ARTICLE_LOCALES entry for each UI locale", () => {
      for (const uiLocale of ARTICLE_LOCALES) {
        const labels = getArticleLocaleLabels(uiLocale);
        expect(Object.keys(labels)).toHaveLength(ARTICLE_LOCALES.length);
        for (const locale of ARTICLE_LOCALES) {
          expect(labels[locale]).toBeDefined();
          expect(typeof labels[locale]).toBe("string");
          expect(labels[locale].length).toBeGreaterThan(0);
        }
      }
    });

    it("falls back to English labels for unknown UI locale", () => {
      const labels = getArticleLocaleLabels("fr");
      const enLabels = getArticleLocaleLabels("en");
      expect(labels).toEqual(enLabels);
    });
  });
});
