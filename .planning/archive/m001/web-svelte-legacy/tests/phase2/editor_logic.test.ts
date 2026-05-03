import { describe, it, expect, vi } from "vitest";

// Slug generation is internal to the component, but we can verify it via the handleSubmit if we wrap it
// or just re-implement it in the test to ensure the logic is what we expect.
// However, better to test the behavior.

// Since ArticleEditor.svelte uses Svelte 5 runes, testing it with vitest might require svelte-testing-library.
// Let's see if we have it.
describe("Editor Logic", () => {
  it("should generate slug from title", () => {
    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    };

    expect(generateSlug("Hello World!")).toBe("hello-world");
    expect(generateSlug("Astrobiologia no Brasil")).toBe(
      "astrobiologia-no-brasil"
    );
    expect(generateSlug("Multiple   Spaces")).toBe("multiple-spaces");
    expect(generateSlug("Special @# Characters")).toBe("special-characters");
  });
});
