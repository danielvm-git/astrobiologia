import { describe, it, expect } from "vitest";
import {
  ARTICLE_TITLE_REQUIRED_MESSAGE,
  getPortugueseTitleValidationError,
  getPortugueseTitleValidationErrorFromInputs,
} from "../article-editor-validation";

describe("getPortugueseTitleValidationError", () => {
  it("returns null when pt-br title is non-empty", () => {
    expect(
      getPortugueseTitleValidationError({ "pt-br": { title: "  Título  " } })
    ).toBeNull();
  });

  it("returns required message when pt-br title is missing", () => {
    expect(getPortugueseTitleValidationError({ "pt-br": { title: "" } })).toBe(
      ARTICLE_TITLE_REQUIRED_MESSAGE
    );
  });

  it("returns required message when pt-br title is whitespace only", () => {
    expect(
      getPortugueseTitleValidationError({ "pt-br": { title: "   " } })
    ).toBe(ARTICLE_TITLE_REQUIRED_MESSAGE);
  });

  it("returns required message when pt-br entry is absent", () => {
    expect(getPortugueseTitleValidationError({})).toBe(
      ARTICLE_TITLE_REQUIRED_MESSAGE
    );
  });
});

describe("getPortugueseTitleValidationErrorFromInputs", () => {
  it("validates pt-br entry from translation array", () => {
    expect(
      getPortugueseTitleValidationErrorFromInputs([
        { language: "en", title: "English" },
        { language: "pt-br", title: "Título" },
      ])
    ).toBeNull();
  });

  it("returns required message when pt-br is missing from array", () => {
    expect(
      getPortugueseTitleValidationErrorFromInputs([
        { language: "en", title: "X" },
      ])
    ).toBe(ARTICLE_TITLE_REQUIRED_MESSAGE);
  });
});
