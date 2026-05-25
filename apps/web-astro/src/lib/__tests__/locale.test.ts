import { describe, it, expect } from "vitest";
import {
  normalizeLocaleTag,
  primaryLanguageSubtag,
  localeTagsMatch,
} from "../locale";

describe("normalizeLocaleTag", () => {
  it("lowercases and replaces underscores", () => {
    expect(normalizeLocaleTag("PT_BR")).toBe("pt-br");
    expect(normalizeLocaleTag("  en  ")).toBe("en");
  });

  it("handles empty string", () => {
    expect(normalizeLocaleTag("")).toBe("");
  });

  it("handles whitespace-only string", () => {
    expect(normalizeLocaleTag("   ")).toBe("");
  });

  it("handles mixed case with region", () => {
    expect(normalizeLocaleTag("en-US")).toBe("en-us");
    expect(normalizeLocaleTag("zh-Hans-CN")).toBe("zh-hans-cn");
  });

  it("handles tag with multiple underscores", () => {
    expect(normalizeLocaleTag("pt_BR_extra")).toBe("pt-br-extra");
  });
});

describe("primaryLanguageSubtag", () => {
  it("returns first subtag", () => {
    expect(primaryLanguageSubtag("pt-br")).toBe("pt");
    expect(primaryLanguageSubtag("en")).toBe("en");
  });

  it("returns empty string for empty input", () => {
    expect(primaryLanguageSubtag("")).toBe("");
  });

  it("handles tag with multiple hyphens", () => {
    expect(primaryLanguageSubtag("zh-hans-cn")).toBe("zh");
  });

  it("handles uppercase input", () => {
    expect(primaryLanguageSubtag("PT-BR")).toBe("pt");
  });
});

describe("localeTagsMatch", () => {
  it("matches identical tags", () => {
    expect(localeTagsMatch("pt-br", "pt-br")).toBe(true);
  });

  it("matches by primary subtag", () => {
    expect(localeTagsMatch("pt-br", "pt-PT")).toBe(true);
    expect(localeTagsMatch("en-US", "en-GB")).toBe(true);
  });

  it("does not match different languages", () => {
    expect(localeTagsMatch("pt-br", "en")).toBe(false);
  });

  it("is case insensitive", () => {
    expect(localeTagsMatch("PT-BR", "pt-br")).toBe(true);
    expect(localeTagsMatch("En-Us", "en-gb")).toBe(true);
  });

  it("handles empty strings", () => {
    expect(localeTagsMatch("", "")).toBe(true);
    expect(localeTagsMatch("", "en")).toBe(false);
  });

  it("matches pt-br against pt-BR (case variants)", () => {
    expect(localeTagsMatch("pt-br", "pt-BR")).toBe(true);
  });

  it("does not match when only region differs but primary matches", () => {
    expect(localeTagsMatch("pt-br", "pt-pt")).toBe(true);
  });
});
