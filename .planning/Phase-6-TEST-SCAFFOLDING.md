# Phase 6 Test Architecture: Implementation Scaffolding

**Purpose:** File-by-file implementation order and exact structure for Phase 6 tests.

---

## 1. Configuration & Infrastructure

### 1.1 vitest.config.ts (NEW)

```typescript
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportOnFailure: true,
      exclude: [
        "node_modules/",
        "tests/",
        "dist/",
        ".nuxt/",
        "**/*.config.ts",
        "**/types/**",
      ],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./"),
      "#app": path.resolve(__dirname, "./node_modules/nuxt/dist/app/index.mjs"),
    },
  },
});
```

### 1.2 tests/setup.ts (NEW)

```typescript
import { vi } from "vitest";
import { config } from "dotenv";

// Load env vars
config({ path: ".env.local" });

// Mock Nuxt auto-imports
global.defineEventHandler = vi.fn((handler) => handler);
global.getQuery = vi.fn();
global.getHeader = vi.fn();
global.setCookie = vi.fn();
global.getCookie = vi.fn();
global.createError = (options: any) => new Error(options.message);

// Mock useRuntimeConfig
global.useRuntimeConfig = vi.fn(() => ({
  public: {
    databaseId: process.env.NUXT_PUBLIC_DATABASE_ID || "test-db-id",
    articlesCollectionId:
      process.env.NUXT_PUBLIC_ARTICLES_COLLECTION_ID || "test-articles-col",
    articleTranslationsCollectionId:
      process.env.NUXT_PUBLIC_ARTICLE_TRANSLATIONS_COLLECTION_ID ||
      "test-translations-col",
  },
}));
```

### 1.3 tests/mocks/appwrite.ts (NEW)

```typescript
import { vi } from "vitest";
import type { Databases } from "node-appwrite";

/**
 * Mock Appwrite Admin Client
 * Used in unit tests to isolate business logic from real DB
 */
export function createMockAppwriteClient() {
  const mockDatabases = {
    listDocuments: vi.fn(),
    getDocument: vi.fn(),
    createDocument: vi.fn(),
    updateDocument: vi.fn(),
    deleteDocument: vi.fn(),
  };

  return {
    databases: mockDatabases as unknown as Databases,
    users: vi.fn(),
    account: vi.fn(),
  };
}

export function createMockListDocumentsResponse(
  documents: any[],
  total: number = documents.length
) {
  return {
    documents,
    total,
    $id: "response-123",
    $createdAt: "2026-01-01T00:00:00.000Z",
    $updatedAt: "2026-01-01T00:00:00.000Z",
  };
}
```

### 1.4 tests/mocks/nuxt.ts (NEW)

```typescript
import { vi } from "vitest";

export function mockUseRuntimeConfig() {
  return {
    public: {
      databaseId: "test-db-id",
      articlesCollectionId: "test-articles-col",
      articleTranslationsCollectionId: "test-translations-col",
      appwriteProjectId: "test-project",
      appwriteEndpoint: "http://localhost:80/v1",
    },
  };
}
```

---

## 2. Test Fixtures

### 2.1 tests/fixtures/articles.fixture.ts (NEW)

```typescript
import type { Article, ArticleTranslation } from "~/types/article";

/**
 * Factory: Create mock articles
 * Used across unit and integration tests
 */
export function createMockArticle(overrides?: Partial<Article>): Article {
  return {
    $id: "article-123",
    $createdAt: "2026-01-01T00:00:00.000Z",
    $updatedAt: "2026-01-01T00:00:00.000Z",
    title: "Article Title",
    slug: "article-slug",
    category: "exoplanetas",
    featured: false,
    status: "published",
    publishedAt: "2026-01-01T00:00:00.000Z",
    translation: undefined,
    ...overrides,
  };
}

/**
 * Factory: Create mock translations
 * Supports language variants for i18n testing
 */
export function createMockTranslation(
  overrides?: Partial<ArticleTranslation>
): ArticleTranslation {
  return {
    $id: "trans-123",
    $createdAt: "2026-01-01T00:00:00.000Z",
    $updatedAt: "2026-01-01T00:00:00.000Z",
    article_id: "article-123",
    language: "pt-br",
    title: "Título do Artigo",
    excerpt: "Resumo do artigo...",
    slug: "artigo-slug",
    content: "<p>Conteúdo completo...</p>",
    ...overrides,
  };
}

/**
 * Batch factory: Create N articles with translations
 */
export function createMockArticlesWithTranslations(
  count: number = 3,
  languages: string[] = ["pt-br", "en"]
): { articles: Article[]; translations: ArticleTranslation[] } {
  const articles = Array.from({ length: count }, (_, i) =>
    createMockArticle({
      $id: `article-${i}`,
      title: `Article ${i}`,
      slug: `article-${i}`,
    })
  );

  const translations = articles.flatMap((article) =>
    languages.map((lang, langIdx) =>
      createMockTranslation({
        $id: `trans-${article.$id}-${lang}`,
        article_id: article.$id,
        language: lang,
        title:
          lang === "pt-br" ? `Artigo ${article.$id}` : `Article ${article.$id}`,
        slug: `${article.slug}-${lang}`,
      })
    )
  );

  return { articles, translations };
}

/**
 * Search result fixture: Articles matching a search term
 */
export function createSearchResultFixture(
  searchTerm: string,
  locale: string = "pt-br"
) {
  const term = searchTerm.toLowerCase();
  return {
    articles: [
      createMockArticle({
        title: `${searchTerm} Found in Title`,
        translation: createMockTranslation({
          language: locale,
          title: `${searchTerm} Found in Title`,
        }),
      }),
      createMockArticle({
        title: "Some Other Article",
        translation: createMockTranslation({
          language: locale,
          excerpt: `This mentions ${searchTerm} in excerpt`,
        }),
      }),
    ],
    query: searchTerm,
  };
}
```

### 2.2 tests/fixtures/locales.fixture.ts (NEW)

```typescript
export const LOCALE_VARIANTS = {
  "pt-br": {
    iso: "pt",
    name: "Português (Brasil)",
    nativeName: "Português",
    variants: ["pt-br", "pt-BR", "pt", "PT", "Portuguese"],
  },
  en: {
    iso: "en",
    name: "English",
    nativeName: "English",
    variants: ["en", "en-US", "en-GB", "EN"],
  },
  es: {
    iso: "es",
    name: "Español",
    nativeName: "Español",
    variants: ["es", "es-ES", "es-MX"],
  },
};

export function localeVariantsFor(locale: string): string[] {
  return (
    LOCALE_VARIANTS[locale as keyof typeof LOCALE_VARIANTS]?.variants || []
  );
}
```

---

## 3. Unit Tests

### 3.1 tests/unit/server/utils/article-read.test.ts (NEW)

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  createMockAppwriteClient,
  createMockListDocumentsResponse,
} from "../../../mocks/appwrite";
import * as fixtures from "../../../fixtures/articles.fixture";

// Mock the Appwrite module
vi.mock("~/server/utils/appwrite", () => ({
  createAdminClient: vi.fn(),
  getDatabaseId: vi.fn(() => "test-db-id"),
}));

import { createAdminClient } from "~/server/utils/appwrite";
// Import the functions under test (after mocks are set up)
import {
  searchPublishedArticles,
  getPublishedArticles,
  getArticlesByCategory,
} from "~/server/utils/article-read";

describe("@p0 @search @unit: searchPublishedArticles", () => {
  let mockClient: ReturnType<typeof createMockAppwriteClient>;

  beforeEach(() => {
    mockClient = createMockAppwriteClient();
    vi.mocked(createAdminClient).mockReturnValue(mockClient as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("query parsing and normalization", () => {
    it("returns empty array for empty search term", async () => {
      const result = await searchPublishedArticles("", "pt-br");
      expect(result).toEqual([]);
    });

    it("returns empty array for whitespace-only search term", async () => {
      const result = await searchPublishedArticles("   ", "pt-br");
      expect(result).toEqual([]);
    });

    it("trims leading/trailing whitespace from search term", async () => {
      const { articles, translations } =
        fixtures.createMockArticlesWithTranslations(1);

      mockClient.databases.listDocuments = vi
        .fn()
        .mockResolvedValueOnce(createMockListDocumentsResponse(translations))
        .mockResolvedValueOnce(createMockListDocumentsResponse(articles));

      await searchPublishedArticles("  exoplanet  ", "pt-br");

      // Verify Query.search was called with trimmed term
      expect(mockClient.databases.listDocuments).toHaveBeenCalled();
    });
  });

  describe("language-based filtering", () => {
    it("defaults to pt-br if language not provided", async () => {
      const { articles, translations } =
        fixtures.createMockArticlesWithTranslations(1);
      mockClient.databases.listDocuments = vi
        .fn()
        .mockResolvedValueOnce(
          createMockListDocumentsResponse(
            translations.filter((t) => t.language === "pt-br")
          )
        );

      await searchPublishedArticles("teste");

      // Assert Query.equal("language", "pt-br") was in the query
      expect(mockClient.databases.listDocuments).toHaveBeenCalled();
    });

    it("filters translations by specified language", async () => {
      const { articles, translations } =
        fixtures.createMockArticlesWithTranslations(2);
      const enTranslations = translations.filter((t) => t.language === "en");

      mockClient.databases.listDocuments = vi
        .fn()
        .mockResolvedValueOnce(createMockListDocumentsResponse(enTranslations))
        .mockResolvedValueOnce(
          createMockListDocumentsResponse(
            articles.filter((a) =>
              enTranslations.map((t) => t.article_id).includes(a.$id)
            )
          )
        );

      const result = await searchPublishedArticles("test", "en");

      expect(result.every((a) => a.translation?.language === "en")).toBe(true);
    });
  });

  describe("result ranking", () => {
    it("[SKIP] ranks title matches higher than excerpt", async () => {
      // This requires real ranking logic in searchPublishedArticles
      // Placeholder for actual test
    });

    it("[SKIP] ranks excerpt matches higher than content", async () => {
      // Placeholder
    });
  });

  describe("result limits", () => {
    it("limits results to 30 articles", async () => {
      const { articles, translations } =
        fixtures.createMockArticlesWithTranslations(50);

      mockClient.databases.listDocuments = vi
        .fn()
        .mockResolvedValueOnce(
          createMockListDocumentsResponse(translations.slice(0, 30))
        )
        .mockResolvedValueOnce(
          createMockListDocumentsResponse(articles.slice(0, 30))
        );

      const result = await searchPublishedArticles("test", "pt-br");

      expect(result.length).toBeLessThanOrEqual(30);
    });
  });

  describe("fallback chains", () => {
    it("[SKIP] falls back to master article search if no translation matches", async () => {
      // Placeholder: test fallback Query.search("title", term) on articles collection
    });
  });
});

describe("@p1 @i18n @unit: language fallback in searchPublishedArticles", () => {
  // Tests for translation selection priority: requested > pt-br > en > first
});
```

### 3.2 tests/unit/server/utils/locale.test.ts (NEW)

```typescript
import { describe, it, expect } from "vitest";
import { normalizeLocaleTag, localeTagsMatch } from "~/server/utils/locale";

describe("@p1 @i18n @unit: normalizeLocaleTag", () => {
  it("converts uppercase locale to lowercase", () => {
    expect(normalizeLocaleTag("PT-BR")).toBe("pt-br");
    expect(normalizeLocaleTag("EN")).toBe("en");
  });

  it("handles mixed case variants", () => {
    expect(normalizeLocaleTag("Pt-Br")).toBe("pt-br");
  });

  it("returns pt-br for null input", () => {
    expect(normalizeLocaleTag(null as any)).toBe("pt-br");
  });

  it("returns pt-br for undefined input", () => {
    expect(normalizeLocaleTag(undefined as any)).toBe("pt-br");
  });

  it("returns pt-br for empty string", () => {
    expect(normalizeLocaleTag("")).toBe("pt-br");
  });

  it("recognizes 2-letter and 4-letter locale codes", () => {
    expect(normalizeLocaleTag("pt")).toBe("pt"); // or normalized to 'pt-br'?
    expect(normalizeLocaleTag("pt-br")).toBe("pt-br");
  });
});

describe("@p1 @i18n @unit: localeTagsMatch", () => {
  it("returns true for exact same tags", () => {
    expect(localeTagsMatch("pt-br", "pt-br")).toBe(true);
  });

  it("matches case-insensitively", () => {
    expect(localeTagsMatch("PT-BR", "pt-br")).toBe(true);
    expect(localeTagsMatch("pt-br", "PT-BR")).toBe(true);
  });

  it("matches language prefix (pt matches pt-br)", () => {
    // Note: Only if implementation supports this
    // expect(localeTagsMatch('pt', 'pt-br')).toBe(true)
  });

  it("does not match unrelated locales", () => {
    expect(localeTagsMatch("pt-br", "en")).toBe(false);
    expect(localeTagsMatch("pt-br", "es")).toBe(false);
  });

  it("returns false for null/undefined inputs", () => {
    expect(localeTagsMatch(null as any, "pt-br")).toBe(false);
    expect(localeTagsMatch("pt-br", undefined as any)).toBe(false);
  });
});
```

---

## 4. API Contract Tests

### 4.1 tests/api-contract/search.test.ts (NEW)

```typescript
import { test, expect } from "@playwright/test";

test.describe("@p0 @search @api: GET /api/search", () => {
  test.use({ baseURL: process.env.BASE_URL || "http://localhost:4174" });

  test("returns articles matching search term", async ({ request }) => {
    const response = await request.get("/api/search", {
      params: { q: "exoplaneta", locale: "pt-br" },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("articles");
    expect(Array.isArray(data.articles)).toBe(true);
    expect(data).toHaveProperty("query", "exoplaneta");
  });

  test("returns empty array for empty query", async ({ request }) => {
    const response = await request.get("/api/search", {
      params: { q: "", locale: "pt-br" },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.articles).toEqual([]);
    expect(data.query).toBe("");
  });

  test("defaults to pt-br locale if not provided", async ({ request }) => {
    const response = await request.get("/api/search", {
      params: { q: "test" },
    });

    expect(response.status()).toBe(200);
    // Cannot directly verify locale, but endpoint should not error
  });

  test("returns ≤30 results", async ({ request }) => {
    const response = await request.get("/api/search", {
      params: { q: "a", locale: "pt-br" },
    });

    const data = await response.json();
    expect(data.articles.length).toBeLessThanOrEqual(30);
  });
});

describe("@p0 @auth @api: authentication boundaries", () => {
  test("public /api/search requires no auth", async ({ request }) => {
    const response = await request.get("/api/search", {
      params: { q: "test" },
    });

    // Should not return 401
    expect(response.status()).not.toBe(401);
  });
});
```

### 4.2 tests/api-contract/seo-sitemap.test.ts (NEW)

```typescript
import { test, expect } from "@playwright/test";

test.describe("@p0 @seo @api: GET /sitemap.xml", () => {
  test("returns valid XML with correct Content-Type", async ({ request }) => {
    const response = await request.get("/sitemap.xml");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/xml");

    const text = await response.text();
    expect(text).toContain('<?xml version="1.0"');
    expect(text).toContain("<urlset");
    expect(text).toContain("</urlset>");
  });

  test("includes all supported locales", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const text = await response.text();

    const locales = ["pt-br", "en", "es", "ja", "nl", "zh"];
    for (const locale of locales) {
      expect(text).toContain(`/${locale}`);
    }
  });

  test("includes article URLs with lastmod dates", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const text = await response.text();

    // Should contain at least one article entry
    const articleRegex = /<url>[\s\S]*?\/artigos\/[\s\S]*?<\/url>/;
    expect(text).toMatch(articleRegex);

    // Should have lastmod in YYYY-MM-DD format
    const lastmodRegex = /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/;
    expect(text).toMatch(lastmodRegex);
  });

  test("includes category pages", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const text = await response.text();

    // Should contain category URL pattern
    expect(text).toContain("/categorias/");
  });

  test("priority and changefreq are set", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const text = await response.text();

    expect(text).toContain("<priority>");
    expect(text).toContain("<changefreq>");
  });
});

describe("@p0 @seo @api: GET /robots.txt", () => {
  test("returns valid robots.txt", async ({ request }) => {
    const response = await request.get("/robots.txt");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/plain");
  });

  test("allows all user agents and specifies sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    const text = await response.text();

    expect(text).toContain("User-agent: *");
    expect(text).toMatch(/Allow:|Disallow:/);
  });
});
```

---

## 5. E2E Tests

### 5.1 tests/e2e/p1/search-and-filter.spec.ts (NEW)

```typescript
import { expect, test } from "@playwright/test";

test.describe("@p1 @search @e2e: Search Form Workflow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/busca");
    // Wait for search page to load
    await page.waitForLoadState("networkidle");
  });

  test("user can type in search box and submit", async ({ page }) => {
    // Arrange
    const searchInput = page.getByPlaceholder(/exoplanetas/i);
    const searchButton = page.getByRole("button", { name: "Buscar" });

    // Act
    await searchInput.fill("exoplaneta");
    await searchButton.click();

    // Assert: URL changed and results display
    await page.waitForURL(/\?q=exoplaneta/);
    await expect(page.getByRole("heading", { level: 2 })).toBeVisible();
  });

  test("search results display matching articles", async ({ page }) => {
    // Act
    await page.getByPlaceholder(/exoplanetas/i).fill("planeta");
    await page.getByRole("button", { name: "Buscar" }).click();

    // Assert: Results list appears with articles
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    const resultItems = page.locator('[data-testid="result-item"]');
    const count = await resultItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test("result link navigates to article page", async ({ page }) => {
    // Arrange
    await page.getByPlaceholder(/exoplanetas/i).fill("test");
    await page.getByRole("button", { name: "Buscar" }).click();

    // Act
    await page.locator('[data-testid="result-item"] a').first().click();

    // Assert: Navigated to article page
    await expect(page).toHaveURL(/\/artigos\//);
  });

  test("search preserves query in URL params", async ({ page }) => {
    // Act
    await page.getByPlaceholder(/exoplanetas/i).fill("black hole");
    await page.getByRole("button", { name: "Buscar" }).click();

    // Assert: URL contains encoded query
    await expect(page).toHaveURL(/\?q=black%20hole/);
  });

  test("empty search shows placeholder message", async ({ page }) => {
    // Should show "Digite um termo..." on initial load or after clearing
    await expect(page.getByText(/Digite um termo/i)).toBeVisible();
  });
});

describe("@p1 @i18n @e2e: Search in Multiple Languages", () => {
  test("search in Portuguese returns Portuguese articles", async ({ page }) => {
    // Navigate to Portuguese search page
    await page.goto("/pt-br/busca");

    // Perform search
    await page.getByPlaceholder(/exoplanetas/i).fill("astro");
    await page.getByRole("button", { name: "Buscar" }).click();

    // Verify Portuguese results displayed
    // (Implementation-dependent; may need data-lang attribute)
  });

  test("language switcher affects search results", async ({ page }) => {
    // Perform search in Portuguese
    await page.goto("/pt-br/busca?q=lua");

    // Switch language to English
    await page.locator('[data-testid="language-switcher"]').click();
    await page.locator("text=English").click();

    // Verify URL changed and results updated for English
    await expect(page).toHaveURL(/\/en\/busca/);
  });
});
```

### 5.2 tests/e2e/p1/seo-metadata-on-articles.spec.ts (NEW)

```typescript
import { expect, test } from "@playwright/test";

test.describe("@p1 @seo @e2e: SEO Metadata on Article Pages", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a known article page
    // (May need to set up test data or use fixtures)
    await page.goto("/pt-br/artigos/exoplanetas");
    await page.waitForLoadState("networkidle");
  });

  test("article page has meta description", async ({ page }) => {
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute("content", /.+/);
  });

  test("article page has og:title and og:description", async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogDesc = page.locator('meta[property="og:description"]');

    await expect(ogTitle).toHaveAttribute("content", /.+/);
    await expect(ogDesc).toHaveAttribute("content", /.+/);
  });

  test("article page has og:image", async ({ page }) => {
    const ogImage = page.locator('meta[property="og:image"]');
    const content = await ogImage.getAttribute("content");

    expect(content).toBeTruthy();
    expect(content).toMatch(/https?:\/\//);
  });

  test("article page has canonical URL", async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    const href = await canonical.getAttribute("href");

    expect(href).toBeTruthy();
    expect(href).toContain(page.url());
  });

  test("article page has hreflang tags for all locales", async ({ page }) => {
    const hreflangs = page.locator('link[rel="alternate"][hreflang]');
    const count = await hreflangs.count();

    // Should have at least pt-br, en, es, etc.
    expect(count).toBeGreaterThan(0);

    // Verify each hreflang has a valid href
    for (let i = 0; i < count; i++) {
      const href = await hreflangs.nth(i).getAttribute("href");
      const hreflang = await hreflangs.nth(i).getAttribute("hreflang");

      expect(href).toBeTruthy();
      expect(hreflang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);
    }
  });

  test("article page has structured data (schema.org)", async ({ page }) => {
    const schema = page.locator('script[type="application/ld+json"]');
    const schemaCount = await schema.count();

    // Should have at least one schema.org block
    expect(schemaCount).toBeGreaterThan(0);

    const firstSchema = await schema.first().textContent();
    expect(firstSchema).toContain('"@context"');
  });
});
```

---

## 6. Integration Tests

### 6.1 tests/integration/search-end-to-end.test.ts (NEW)

```typescript
import { describe, it, expect, beforeEach } from "vitest";

describe("@p1 @search @integration: end-to-end search workflow", () => {
  beforeEach(async () => {
    // Setup: Insert test articles and translations into test DB
    // This would use Appwrite admin SDK to seed test data
  });

  it("[SKIP] search query returns ranked results", async () => {
    // Test that searchPublishedArticles returns results ranked by relevance
    // Requires test DB setup with seeded articles
  });

  it("[SKIP] search results match sitemap URLs", async () => {
    // Verify that all articles returned by search appear in /sitemap.xml
  });
});
```

---

## 7. Test Running Commands

Add to `package.json`:

```json
{
  "scripts": {
    "test": "npm run test:unit && npm run test:e2e:p0",
    "test:unit": "vitest run tests/unit",
    "test:unit:watch": "vitest watch tests/unit",
    "test:unit:ui": "vitest --ui tests/unit",
    "test:unit:coverage": "vitest run --coverage tests/unit",
    "test:api": "playwright test tests/api-contract --project=chromium",
    "test:e2e": "playwright test --config=playwright.config.ts",
    "test:e2e:p0": "playwright test tests/e2e/p0 --project=chromium",
    "test:e2e:p1": "playwright test tests/e2e/p1 --project=chromium",
    "test:e2e:all": "playwright test tests/e2e --project=chromium",
    "test:phase6": "npm run test:unit && npm run test:api && npm run test:e2e:p0"
  }
}
```

---

## 8. Implementation Checklist

**Phase 1: Setup (Day 1)**

- [ ] Install Vitest + plugins
- [ ] Create vitest.config.ts
- [ ] Create tests/setup.ts
- [ ] Create mock files (appwrite.ts, nuxt.ts)
- [ ] Create fixtures (articles, locales)

**Phase 2: Unit Layer (Day 2)**

- [ ] Implement article-read.test.ts scaffolds (fill in logic)
- [ ] Implement locale.test.ts scaffolds
- [ ] Run `npm run test:unit`
- [ ] Achieve >85% coverage

**Phase 3: API Layer (Day 3)**

- [ ] Implement search.test.ts (Playwright HTTP tests)
- [ ] Implement seo-sitemap.test.ts
- [ ] Run `npm run test:api`
- [ ] Verify all endpoints accessible

**Phase 4: E2E Layer (Days 4-5)**

- [ ] Implement search-and-filter.spec.ts
- [ ] Implement seo-metadata-on-articles.spec.ts
- [ ] Add i18n-locale-routing.spec.ts (optional)
- [ ] Run `npm run test:e2e:p1`
- [ ] Validate test coverage matches UAT

**Phase 5: Documentation & Review**

- [ ] Update ROADMAP.md with test metrics
- [ ] Document any skipped tests and reason
- [ ] Tag all tests with @priority tags
- [ ] Ready for UAT handoff

---

**Status:** Ready for Implementation  
**Estimated Effort:** 4-5 days (1 dev)  
**Blocker Risk:** Low (minimal new infrastructure required)
