import { describe, it, expect } from "vitest";
import {
  localeTagsMatch,
  normalizeLocaleTag,
  primaryLanguageSubtag,
} from "../../../src/lib/i18n/locale-tag";
import { shouldShowTranslationFallbackBadge } from "../../../src/lib/i18n/translation-fallback-badge";

describe("locale-tag", () => {
  it("normalizes underscores to hyphens", () => {
    expect(normalizeLocaleTag("pt_BR")).toBe("pt-br");
  });

  it("matches regional tags to primary UI locale", () => {
    expect(localeTagsMatch("es-419", "es")).toBe(true);
    expect(localeTagsMatch("es", "es-MX")).toBe(true);
  });

  it("primaryLanguageSubtag extracts first segment", () => {
    expect(primaryLanguageSubtag("zh-CN")).toBe("zh");
  });
});

describe("shouldShowTranslationFallbackBadge", () => {
  it("hides badge on default locale when only master exists", () => {
    expect(shouldShowTranslationFallbackBadge("pt-br", undefined)).toBe(false);
  });

  it("shows badge on non-default locale when only master exists", () => {
    expect(shouldShowTranslationFallbackBadge("es", undefined)).toBe(true);
  });

  it("shows badge when UI is es but translation row is en", () => {
    expect(shouldShowTranslationFallbackBadge("es", { language: "en" })).toBe(
      true
    );
  });

  it("hides badge when translation matches UI locale", () => {
    expect(
      shouldShowTranslationFallbackBadge("es", { language: "es-419" })
    ).toBe(false);
  });
});
