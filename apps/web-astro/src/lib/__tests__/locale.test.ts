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
});

describe("primaryLanguageSubtag", () => {
  it("returns first subtag", () => {
    expect(primaryLanguageSubtag("pt-br")).toBe("pt");
    expect(primaryLanguageSubtag("en")).toBe("en");
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
});
