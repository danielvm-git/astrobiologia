import { describe, it, expect } from "vitest";
import {
  DEFAULT_REQUEST_LANGUAGE,
  getRequestLanguage,
} from "../../src/lib/server/request-language";

describe("getRequestLanguage", () => {
  it("returns default when paraglide is missing", () => {
    expect(getRequestLanguage({})).toBe(DEFAULT_REQUEST_LANGUAGE);
  });

  it("returns default when lang is empty string", () => {
    expect(getRequestLanguage({ paraglide: { lang: "" } })).toBe(
      DEFAULT_REQUEST_LANGUAGE
    );
  });

  it("returns the requested BCP-47 code when set", () => {
    expect(getRequestLanguage({ paraglide: { lang: "en" } })).toBe("en");
  });
});
