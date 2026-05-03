// Covers: I18N-003, I18N-004
import { describe, expect, it } from "vitest";
import {
  localeTagsMatch,
  normalizeLocaleTag,
  primaryLanguageSubtag,
  shouldShowTranslationFallbackBadge,
} from "~/server/utils/locale";

describe("locale", () => {
  it("normalizes tag casing, whitespace, and underscores", () => {
    expect(normalizeLocaleTag("  pt_BR  ")).toBe("pt-br");
  });

  it("compares language tags in a case-insensitive way and matches primary subtags", () => {
    expect(localeTagsMatch("pt-BR", "pt-br")).toBe(true);
    expect(localeTagsMatch("en-US", "en")).toBe(true);
  });

  it("resolves the primary subtag for compound codes", () => {
    expect(primaryLanguageSubtag("en-US")).toBe("en");
  });

  it("indicates a fallback when UI locale and translation do not match", () => {
    const translation = { language: "en" };
    expect(shouldShowTranslationFallbackBadge("pt-br", translation)).toBe(true);
  });
});
