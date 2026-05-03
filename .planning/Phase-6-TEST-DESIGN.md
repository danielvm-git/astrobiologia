# Phase 6: Search Engine Integration — Test Design Document

**Date:** 2026-04-27  
**Phase:** Phase 6 — Search Engine Integration (v1.1 Global Discovery)  
**Objective:** Design a comprehensive system-level test plan covering search functionality, SEO optimization (sitemap, robots.txt, schema), and language routing.

---

## 1. Executive Summary

Phase 6 builds search ("Busca Global") and finalizes SEO to enable discovery via search engines. The test strategy covers three interrelated concern areas:

1. **Search API & Relevance** — `/api/search` returns correct articles in ranked order by language
2. **SEO Infrastructure** — Sitemap, robots.txt, schema.org, language hreflang tags render correctly
3. **E2E Workflows** — User fills search form, sees results, navigates article, views localized SEO metadata

**Current State:**

- ✅ 4 E2E tests (p0, Playwright) — basic search form UI
- ❌ 0 API contract tests — search handler logic untested
- ❌ 0 unit tests — article-read utility (core search logic) untested
- ❌ 0 SEO infrastructure tests — sitemap, robots.txt structure not validated
- ❌ 0 i18n routing tests — language fallback chains not verified

**Test Coverage Gaps:**
| Area | Current | Target | Gap |
|------|---------|--------|-----|
| Search API (contract) | 0% | 90% | HIGH |
| Article relevance (unit) | 0% | 85% | HIGH |
| SEO metadata (E2E) | 0% | 80% | HIGH |
| Language routing (unit) | 0% | 85% | HIGH |
| Admin auth middleware (unit) | 0% | 70% | MEDIUM |

---

## 2. Test Strategy: Requirements → Test Type Matrix

### 2.1 Search Functionality Requirements

| Requirement ID | Description                                                | Test Type              | Acceptance Criteria                                                                                                  | Priority |
| -------------- | ---------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------- | -------- |
| **SEARCH-001** | Search form accepts query string                           | E2E                    | User can type in search input and click "Buscar" button                                                              | P0       |
| **SEARCH-002** | Empty query shows placeholder text                         | E2E                    | Message "Digite um termo..." displays when page loads with no query                                                  | P0       |
| **SEARCH-003** | API returns articles matching search term                  | API Contract           | `GET /api/search?q=exoplaneta&locale=pt-br` returns articles with 'exoplaneta' in title/excerpt/content              | P0       |
| **SEARCH-004** | Search respects language parameter                         | API Contract           | `q=lua&locale=pt-br` returns Portuguese articles; same query with `locale=en` returns English articles               | P0       |
| **SEARCH-005** | Search ranks results by relevance                          | Unit (article-read.ts) | Title matches score higher than excerpt; excerpt higher than content                                                 | P1       |
| **SEARCH-006** | Search term trimmed and normalized                         | Unit (article-read.ts) | Leading/trailing whitespace removed; empty string returns []                                                         | P1       |
| **SEARCH-007** | Search limits results to 30 articles                       | API Contract           | `GET /api/search?q=test` returns ≤30 documents (hardcoded limit)                                                     | P1       |
| **SEARCH-008** | Fallback to master article search if no translations match | Unit (article-read.ts) | When locale=en but only Portuguese content exists, fall back to `Query.search("title", term)` on articles collection | P2       |

### 2.2 SEO Infrastructure Requirements

| Requirement ID | Description                                      | Test Type         | Acceptance Criteria                                                                                           | Priority |
| -------------- | ------------------------------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------- | -------- |
| **SEO-001**    | Sitemap.xml generates for all locales            | E2E               | `GET /sitemap.xml` returns valid XML with `<loc>` entries for pt-br, en, es, ja, nl, zh                       | P0       |
| **SEO-002**    | Sitemap includes articles with proper dates      | E2E               | Each article URL has `<lastmod>` formatted as YYYY-MM-DD; `<priority>` is 0.8                                 | P1       |
| **SEO-003**    | Sitemap includes category pages                  | E2E               | For each CATEGORIES entry, `/<locale>/categorias/<slug>` is in sitemap                                        | P1       |
| **SEO-004**    | Robots.txt exists and allows crawlers            | API Contract      | `GET /robots.txt` returns 200; contains `User-agent: *` and `Allow: /` or specific paths                      | P1       |
| **SEO-005**    | Hreflang tags in HTML head for language variants | E2E               | Article page HTML includes `<link rel="alternate" hreflang="pt" href="...pt-br/artigos/...">` for each locale | P2       |
| **SEO-006**    | Sitemap valid XML structure                      | Unit (validation) | Parse sitemap XML; assert schema compliance (urlset, url, loc required)                                       | P1       |

### 2.3 Language Routing & Fallback Requirements

| Requirement ID | Description                                    | Test Type                 | Acceptance Criteria                                                            | Priority |
| -------------- | ---------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------ | -------- |
| **I18N-001**   | Search defaults to pt-br if no locale provided | API Contract              | `GET /api/search?q=test` (no locale param) returns pt-br results               | P1       |
| **I18N-002**   | Request locale parameter overrides default     | API Contract              | `GET /api/search?q=test&locale=en` returns en results even if default is pt-br | P1       |
| **I18N-003**   | Invalid locale falls back to pt-br             | Unit (locale.ts)          | `normalizeLocaleTag("xyz")` or invalid input returns "pt-br"                   | P2       |
| **I18N-004**   | Locale tag matching handles variants           | Unit (locale-tag.test.ts) | `localeTagsMatch("pt-BR", "pt-br")` returns true; case-insensitive             | P2       |

### 2.4 Auth & Middleware Requirements

| Requirement ID | Description                                     | Test Type    | Acceptance Criteria                                                  | Priority |
| -------------- | ----------------------------------------------- | ------------ | -------------------------------------------------------------------- | -------- |
| **AUTH-001**   | Search API is public (no auth required)         | API Contract | `GET /api/search?q=test` returns 200 without Authorization header    | P1       |
| **AUTH-002**   | Admin API `/api/admin/articles/*` requires auth | API Contract | `GET /api/admin/articles/list` returns 401 if not authenticated      | P2       |
| **AUTH-003**   | Valid session cookie allows admin access        | API Contract | `GET /api/admin/articles/list` with valid session cookie returns 200 | P2       |

---

## 3. Test Execution Strategy: Tooling & Approach

### 3.1 Test Stack Recommendations

| Tool                                     | Purpose                                                     | Rationale                                                     |
| ---------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------- |
| **Playwright** (existing)                | E2E (search UI, sitemap fetch, SEO metadata)                | Already configured; strong DOM/network introspection          |
| **Vitest** (new)                         | Unit tests (article-read.ts, locale.ts), API contract tests | Fast, TypeScript-native, works with Nuxt server routes        |
| **Mock Appwrite** (fetch strategy)       | Isolate `searchPublishedArticles` logic from real DB        | Unit tests should not hit live DB; mock `createAdminClient()` |
| **Playwright API Testing** (alternative) | HTTP contract tests for `/api/search`, `/api/admin/*`       | Bypass UI; direct HTTP assertions                             |

### 3.2 Mocking Strategy

**Unit Tests (searchPublishedArticles, locale matching):**

```
Mock createAdminClient() → mock databases.listDocuments()
→ Return canned Article[] and ArticleTranslation[] fixtures
→ Assert query builder calls, result ranking, fallback chains
```

**API Contract Tests (server routes):**

```
Run dev server (already done in Playwright config)
→ Direct HTTP calls to /api/search, /api/admin/*, /sitemap.xml
→ Assert response body, status code, headers
→ No UI layer; no auth required for search (public API)
```

**E2E Tests (user workflows):**

```
Existing setup (Playwright + dev server)
→ User navigates /busca
→ Types query, submits form
→ Asserts results display, links navigate to articles
→ Asserts SEO metadata (hreflang, og:* tags) present in article page
```

### 3.3 Test Execution Phases

**Phase 3a: Unit Layer** (fastest feedback, no server needed)

- Article search logic: relevance ranking, fallback chains, language filtering
- Locale matching: tag normalization, variant handling
- No HTTP; no DB; pure function testing

**Phase 3b: API Contract Layer** (integration, lightweight)

- Server routes return correct HTTP status and shape
- Auth boundaries (public search vs. admin auth)
- No E2E UI; direct HTTP calls

**Phase 3c: E2E Layer** (slowest, full stack)

- User searches via UI
- Results display and link correctly
- SEO metadata renders in HTML

---

## 4. Test Coverage Matrix

### 4.1 Search Functionality Coverage

```
┌─────────────────────────────────────────┬──────┬──────┬─────┐
│ Concern                                 │ Unit │ API  │ E2E │
├─────────────────────────────────────────┼──────┼──────┼─────┤
│ Query parsing & normalization           │  ✓   │  ✓   │     │
│ Translation search by language          │  ✓   │  ✓   │ ✓   │
│ Master article fallback                 │  ✓   │  ✓   │     │
│ Result ranking (title > excerpt > body) │  ✓   │      │     │
│ Limit enforcement (≤30 results)         │  ✓   │  ✓   │     │
│ Empty query handling                    │  ✓   │  ✓   │ ✓   │
│ Invalid locale fallback                 │  ✓   │  ✓   │     │
│ User search form interaction            │      │      │ ✓   │
│ Results display on page                 │      │      │ ✓   │
│ Result link navigation                  │      │      │ ✓   │
└─────────────────────────────────────────┴──────┴──────┴─────┘
```

### 4.2 SEO Infrastructure Coverage

```
┌─────────────────────────────────────────┬──────┬──────┬─────┐
│ Concern                                 │ Unit │ API  │ E2E │
├─────────────────────────────────────────┼──────┼──────┼─────┤
│ Sitemap XML valid structure             │  ✓   │  ✓   │     │
│ Sitemap includes all locales            │      │  ✓   │ ✓   │
│ Sitemap includes articles with dates    │      │  ✓   │ ✓   │
│ Sitemap includes categories             │      │  ✓   │ ✓   │
│ Priority & changefreq values            │      │  ✓   │ ✓   │
│ Robots.txt exists & allows crawlers     │      │  ✓   │ ✓   │
│ Hreflang tags in article page HTML      │      │      │ ✓   │
│ Open Graph tags (og:title, og:image)    │      │      │ ✓   │
│ Canonical URL tags                      │      │      │ ✓   │
└─────────────────────────────────────────┴──────┴──────┴─────┘
```

---

## 5. File Structure & Organization

### 5.1 New Test Directories

```
apps/web-nuxt/
├── tests/
│   ├── e2e/
│   │   ├── p0/
│   │   │   ├── busca.spec.ts                    [EXISTING]
│   │   │   ├── article-not-found.spec.ts        [EXISTING]
│   │   │   ├── admin-login.spec.ts              [EXISTING]
│   │   │   └── public-home.spec.ts              [EXISTING]
│   │   │
│   │   ├── p1/
│   │   │   ├── search-and-filter.spec.ts        [NEW @p1 @search @e2e]
│   │   │   ├── seo-metadata-on-articles.spec.ts [NEW @p1 @seo @e2e]
│   │   │   └── i18n-locale-routing.spec.ts      [NEW @p1 @i18n @e2e]
│   │   │
│   │   └── p2/
│   │       ├── admin-auth-boundaries.spec.ts    [NEW @p2 @auth @e2e]
│   │       └── seo-hreflang-variants.spec.ts    [NEW @p2 @seo @e2e]
│   │
│   ├── unit/
│   │   ├── server/
│   │   │   ├── api/
│   │   │   │   ├── search.test.ts               [NEW @unit @search @api]
│   │   │   │   ├── articles-list.test.ts        [NEW @unit @articles @api]
│   │   │   │   └── admin-auth.test.ts           [NEW @unit @auth @api]
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── article-read.test.ts         [NEW @unit @search @db]
│   │   │       ├── locale.test.ts               [NEW @unit @i18n @locale]
│   │   │       └── locale-tag.test.ts           [NEW @unit @i18n @locale] (use existing?)
│   │   │
│   │   └── lib/
│   │       ├── seo.test.ts                      [NEW @unit @seo @meta]
│   │       └── i18n/
│   │           └── locale-tag.test.ts           [EXISTING or EXPAND]
│   │
│   ├── fixtures/
│   │   ├── articles.fixture.ts                  [NEW @fixture @search]
│   │   ├── translations.fixture.ts              [NEW @fixture @i18n]
│   │   └── appwrite-mocks.ts                    [NEW @mock @appwrite]
│   │
│   └── integration/
│       ├── search-end-to-end.test.ts            [NEW @integration @search @e2e]
│       └── seo-sitemap-generation.test.ts       [NEW @integration @seo @sitemap]
```

### 5.2 Configuration Files (to create)

```
apps/web-nuxt/
├── vitest.config.ts                            [NEW]
├── tests/setup.ts                              [NEW - global test setup]
├── tests/mocks/
│   ├── appwrite.ts                             [NEW - mock Appwrite client]
│   └── nuxt.ts                                 [NEW - mock Nuxt runtime config]
└── playwright.config.ts                        [EXISTING - update]
```

---

## 6. Test Case Naming & Tagging Convention

### 6.1 Tag Format

All tests use Playwright/Vitest tag format:

```
@<priority> @<domain> @<type>
```

**Priority tags:**

- `@p0` — Critical path (shipping blocker)
- `@p1` — Important (ship within sprint)
- `@p2` — Nice-to-have (follow-up)

**Domain tags:**

- `@search` — Search API / relevance
- `@seo` — SEO metadata (sitemap, robots, hreflang, og:\*)
- `@i18n` — Internationalization / locale routing
- `@auth` — Authentication / authorization
- `@articles` — Article CRUD / listing

**Type tags:**

- `@e2e` — End-to-end (browser + server)
- `@api` — API contract (HTTP without UI)
- `@unit` — Unit (isolated function, mocked deps)
- `@integration` — Integration (multiple units, real server)

### 6.2 Example Test Names

```typescript
// E2E: Search form workflow
test("@p0 @search @e2e: user searches for articles and sees results", async ({
  page,
}) => {});

// API Contract: Search handler returns correct shape
test("@p0 @search @api: GET /api/search returns articles array for valid query", async ({
  request,
}) => {});

// Unit: Article search ranking
test("@p1 @search @unit: searchPublishedArticles ranks title matches higher than excerpt", async () => {});

// Unit: Locale fallback
test("@p1 @i18n @unit: normalizeLocaleTag handles edge cases (null, undefined, invalid)", async () => {});

// E2E: SEO metadata
test("@p1 @seo @e2e: article page renders hreflang tags for all supported locales", async ({
  page,
}) => {});

// API Contract: Auth boundary
test("@p2 @auth @api: GET /api/admin/articles/list returns 401 without session", async ({
  request,
}) => {});

// Integration: Sitemap generation
test("@p1 @seo @integration: sitemap.xml includes all articles from all locales", async () => {});
```

---

## 7. Test Scaffolding: File Stubs & Structure

### 7.1 Unit Tests: article-read.test.ts

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  searchPublishedArticles,
  getPublishedArticles,
  getArticlesByCategory,
  getArticleBySlug,
} from "~/server/utils/article-read";
import { createAdminClient } from "~/server/utils/appwrite";
import * as fixtures from "~/tests/fixtures/articles.fixture";

// Mock Appwrite
vi.mock("~/server/utils/appwrite", () => ({
  createAdminClient: vi.fn(),
  getDatabaseId: vi.fn(() => "db-123"),
}));

// Mock runtime config
vi.mock("#app", () => ({
  useRuntimeConfig: vi.fn(() => ({
    public: {
      databaseId: "db-123",
      articlesCollectionId: "articles-col",
      articleTranslationsCollectionId: "translations-col",
    },
  })),
}));

describe("@p0 @search @unit: searchPublishedArticles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns articles matching search term in translation title", async () => {
    // Arrange
    const mockResponse = { documents: fixtures.mockArticles(), total: 2 };
    // Act
    // Assert
  });

  it("returns articles matching search term in translation excerpt", async () => {});
  it("returns articles matching search term in translation content", async () => {});
  it("ranks title matches higher than excerpt matches", async () => {});
  it("respects language parameter for filtering translations", async () => {});
  it("falls back to master article search if no translations match", async () => {});
  it("returns empty array if search term is empty after trim", async () => {});
  it("limits results to 30 articles", async () => {});
});

describe("@p1 @i18n @unit: language fallback in searchPublishedArticles", () => {
  it("defaults to pt-br if language param not provided", async () => {});
  it("picks translation for requested language", async () => {});
  it("falls back to pt-br if requested language translation missing", async () => {});
  it("falls back to en if pt-br also missing", async () => {});
  it("returns first available translation if no pt-br or en", async () => {});
});
```

### 7.2 Unit Tests: locale.test.ts

```typescript
import { describe, it, expect } from "vitest";
import { normalizeLocaleTag, localeTagsMatch } from "~/server/utils/locale";

describe("@p1 @i18n @unit: normalizeLocaleTag", () => {
  it("converts uppercase to lowercase", () => {
    expect(normalizeLocaleTag("PT-BR")).toBe("pt-br");
  });

  it("handles null and undefined gracefully", () => {});
  it("returns pt-br for unrecognized locales", () => {});
  it("handles region variants (pt vs pt-br)", () => {});
});

describe("@p1 @i18n @unit: localeTagsMatch", () => {
  it("matches exact same tags", () => {
    expect(localeTagsMatch("pt-br", "pt-br")).toBe(true);
  });

  it("matches case-insensitively", () => {
    expect(localeTagsMatch("PT-BR", "pt-br")).toBe(true);
  });

  it("matches language prefix (pt matches pt-br)", () => {});
  it("does not match unrelated locales", () => {});
});
```

### 7.3 API Contract Tests: search.test.ts

```typescript
import { describe, it, expect } from "@playwright/test";
import { test } from "@playwright/test";

describe("@p0 @search @api: GET /api/search", () => {
  it("returns articles matching search term", async ({ request }) => {
    const response = await request.get("/api/search", {
      params: { q: "exoplaneta", locale: "pt-br" },
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("articles");
    expect(Array.isArray(data.articles)).toBe(true);
  });

  it("returns empty array for empty query", async ({ request }) => {});
  it("defaults to pt-br locale if not provided", async ({ request }) => {});
  it("filters results by specified locale", async ({ request }) => {});
  it("returns ≤30 results", async ({ request }) => {});
});

describe("@p2 @auth @api: authentication boundaries", () => {
  it("public /api/search requires no auth", async ({ request }) => {});
  it("admin /api/admin/articles/list returns 401 without session", async ({
    request,
  }) => {});
  it("admin /api/admin/articles/list returns 200 with valid session", async ({
    request,
  }) => {});
});
```

### 7.4 E2E Tests: search-and-filter.spec.ts

```typescript
import { expect, test } from "@playwright/test";

test.describe("@p1 @search @e2e: Search Form Workflow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/busca");
  });

  test("[P1] user can type in search box and submit", async ({ page }) => {
    await page.getByPlaceholder(/exoplanetas/i).fill("exoplaneta");
    await page.getByRole("button", { name: "Buscar" }).click();
    // Assert results display
  });

  test("[P1] search results display matching articles", async ({ page }) => {});
  test("[P1] result link navigates to article page", async ({ page }) => {});
  test("[P1] search preserves query in URL params", async ({ page }) => {});
});

test.describe("@p1 @i18n @e2e: Search in Multiple Languages", () => {
  test("[P1] search in Portuguese returns Portuguese articles", async ({
    page,
  }) => {});
  test("[P1] search in English returns English articles", async ({
    page,
  }) => {});
  test("[P1] language switcher affects search results", async ({ page }) => {});
});
```

### 7.5 E2E Tests: seo-metadata-on-articles.spec.ts

```typescript
import { expect, test } from "@playwright/test";

test.describe("@p1 @seo @e2e: SEO Metadata", () => {
  test("[P1] article page has meta description", async ({ page }) => {
    await page.goto("/pt-br/artigos/exoplanetas");
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute("content", /.+/);
  });

  test("[P1] article page has og:title and og:description", async ({
    page,
  }) => {});
  test("[P1] article page has og:image", async ({ page }) => {});
  test("[P1] article page has canonical URL", async ({ page }) => {});
  test("[P1] article page has hreflang tags for all locales", async ({
    page,
  }) => {});
});
```

### 7.6 API Contract Tests: seo-sitemap.test.ts

```typescript
import { describe, it, expect } from "vitest";
import { test } from "@playwright/test";

test.describe("@p0 @seo @api: GET /sitemap.xml", () => {
  test("returns valid XML", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/xml");
  });

  test("includes all supported locales", async ({ request }) => {});
  test("includes article URLs with lastmod dates", async ({ request }) => {});
  test("includes category pages", async ({ request }) => {});
  test("priority and changefreq are set", async ({ request }) => {});
});

test.describe("@p0 @seo @api: GET /robots.txt", () => {
  test("returns valid robots.txt", async ({ request }) => {});
  test("allows all user agents", async ({ request }) => {});
});
```

### 7.7 Integration Test: search-end-to-end.test.ts

```typescript
import { describe, it, expect, beforeEach } from "vitest";

describe("@p1 @search @integration: end-to-end search workflow", () => {
  beforeEach(async () => {
    // Seed test articles in DB
    // Note: This would run against a test DB or use fixtures
  });

  it("search query is sent to API, results ranked correctly", async () => {
    // Call searchPublishedArticles with real Appwrite client (test DB)
    // Verify ranking, language filtering, fallback behavior
  });

  it("search results match sitemap URLs", async () => {
    // Ensure articles returned by search appear in sitemap
  });
});
```

---

## 8. Traceability Matrix: UAT → Test Cases

### 8.1 Phase 6 UAT Requirements

From `.planning/ROADMAP.md`:

> **UAT**: Search returns relevant articles from database, SEO audit passes.

### 8.2 Test Case → UAT Mapping

| UAT Criterion                 | Test Case ID             | Test File                                             | Type     | Status |
| ----------------------------- | ------------------------ | ----------------------------------------------------- | -------- | ------ |
| Search returns articles       | search-001, search-003   | search.test.ts, search-and-filter.spec.ts             | API, E2E | → NEW  |
| Results are relevant (ranked) | search-005               | article-read.test.ts                                  | Unit     | → NEW  |
| Respects language             | search-004, i18n-001/002 | search.test.ts, i18n-locale-routing.spec.ts           | API, E2E | → NEW  |
| SEO audit passes              | seo-001/002/003/005/006  | seo-metadata-on-articles.spec.ts, seo-sitemap.test.ts | E2E, API | → NEW  |
| Sitemap valid                 | seo-001/006              | seo-sitemap.test.ts                                   | API      | → NEW  |
| Robots.txt exists             | seo-004                  | seo-sitemap.test.ts                                   | API      | → NEW  |
| Hreflang tags present         | seo-005                  | seo-metadata-on-articles.spec.ts                      | E2E      | → NEW  |

---

## 9. Recommended Tooling Setup

### 9.1 Add Vitest to package.json

```json
{
  "scripts": {
    "test": "npm run test:unit && npm run test:e2e:p0",
    "test:unit": "vitest run tests/unit",
    "test:unit:watch": "vitest watch tests/unit",
    "test:e2e": "playwright test --config=playwright.config.ts",
    "test:e2e:p0": "playwright test tests/e2e/p0 --project=chromium",
    "test:e2e:p1": "playwright test tests/e2e/p1 --project=chromium",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "vitest": "^2.0.0",
    "@vitest/ui": "^2.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "happy-dom": "^14.0.0"
  }
}
```

### 9.2 Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "happy-dom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "tests/", "dist/", ".nuxt/"],
    },
    include: ["tests/unit/**/*.test.ts"],
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      "~": new URL("./src", import.meta.url).pathname,
    },
  },
});
```

### 9.3 Test Setup File

```typescript
// tests/setup.ts
import { vi } from "vitest";

// Mock Nuxt auto-imports if needed
global.defineEventHandler = vi.fn((handler) => handler);
global.getQuery = vi.fn();
global.useRuntimeConfig = vi.fn(() => ({
  public: {
    databaseId: "test-db",
    articlesCollectionId: "test-articles",
    articleTranslationsCollectionId: "test-translations",
  },
}));
```

---

## 10. Execution Plan

### 10.1 Phase 3a: Unit Layer (1-2 days)

**Deliverables:**

- ✅ article-read.test.ts (search logic, ranking, fallback)
- ✅ locale.test.ts (language matching, normalization)
- ✅ Vitest config + setup
- ✅ Appwrite mock fixtures

**Entry criteria:**

- Vitest installed and configured
- Mock Appwrite client working

**Exit criteria:**

- All unit tests pass (>90% coverage of article-read.ts, locale.ts)
- No integration with real Appwrite

### 10.2 Phase 3b: API Contract Layer (1 day)

**Deliverables:**

- ✅ search.test.ts (HTTP contract for /api/search)
- ✅ seo-sitemap.test.ts (/sitemap.xml, /robots.txt)
- ✅ admin-auth.test.ts (auth boundaries)

**Entry criteria:**

- Unit tests passing
- Dev server can start

**Exit criteria:**

- All API tests pass (real HTTP calls)
- Auth boundaries verified

### 10.3 Phase 3c: E2E Layer (1-2 days)

**Deliverables:**

- ✅ search-and-filter.spec.ts (user search workflow)
- ✅ seo-metadata-on-articles.spec.ts (SEO tags in HTML)
- ✅ i18n-locale-routing.spec.ts (language switching)
- ✅ admin-auth-boundaries.spec.ts (UI-level auth)

**Entry criteria:**

- API tests passing
- Dev server stable

**Exit criteria:**

- All E2E tests pass (p0 + p1)
- Screenshots + videos on failure
- Ready for UAT

---

## 11. Success Criteria

### 11.1 Coverage Targets

| Layer | Target | Metric                                                               |
| ----- | ------ | -------------------------------------------------------------------- |
| Unit  | 85%    | Lines + branches in article-read.ts, locale.ts                       |
| API   | 90%    | All endpoints: /api/search, /api/admin/\*, /sitemap.xml, /robots.txt |
| E2E   | 80%    | Critical user workflows: search, article view, SEO metadata          |

### 11.2 Quality Gates

✅ All tests pass in CI (no flakes)  
✅ Code coverage reports generated  
✅ Test names follow naming convention  
✅ Fixtures and mocks are reusable  
✅ Each test has a single assertion focus  
✅ Tests document behavior (readable to non-engineers)

---

## 12. Appendix: Example Test Fixtures

### 12.1 articles.fixture.ts

```typescript
import type { Article, ArticleTranslation } from "~/types/article";

export function mockArticles(count = 3): Article[] {
  return Array.from({ length: count }, (_, i) => ({
    $id: `article-${i}`,
    $createdAt: "2026-01-01T00:00:00.000Z",
    $updatedAt: "2026-01-01T00:00:00.000Z",
    title: `Article ${i}`,
    slug: `article-${i}`,
    category: "exoplanetas",
    featured: i === 0,
    status: "published",
    publishedAt: "2026-01-01T00:00:00.000Z",
  }));
}

export function mockTranslations(
  articleIds: string[] = ["article-0"]
): ArticleTranslation[] {
  return articleIds.flatMap((aid, i) => [
    {
      $id: `trans-pt-${aid}`,
      article_id: aid,
      language: "pt-br",
      title: `Artigo em Português ${i}`,
      excerpt: "Resumo...",
      slug: `artigo-${i}`,
      content: "Conteúdo completo...",
    },
    {
      $id: `trans-en-${aid}`,
      article_id: aid,
      language: "en",
      title: `Article in English ${i}`,
      excerpt: "Summary...",
      slug: `article-${i}`,
      content: "Full content...",
    },
  ]);
}
```

---

## 13. Risk & Mitigation

| Risk                                  | Likelihood | Impact | Mitigation                                                          |
| ------------------------------------- | ---------- | ------ | ------------------------------------------------------------------- |
| Appwrite mocking complexity           | Medium     | Medium | Use fixtures from Phase 2 CRUD tests; document mock API surface     |
| E2E flakiness (timing)                | High       | High   | Waiters, retries, longer timeouts; pin Playwright version           |
| SEO metadata changes during iteration | Medium     | Low    | Version control tests; assert by selector, not exact text           |
| Language fallback chain bugs          | Medium     | High   | Exhaustive unit tests; document priority order (pt-br > en > first) |

---

## 14. Next Steps

1. **Create vitest.config.ts** — Enable unit testing infrastructure
2. **Write unit test scaffolds** — article-read.test.ts, locale.test.ts (with mocks)
3. **Create API contract tests** — search.test.ts, seo-sitemap.test.ts
4. **Expand E2E tests** — search-and-filter.spec.ts, seo-metadata-on-articles.spec.ts
5. **Run test coverage** — Report against Phase 6 UAT requirements
6. **Iterate on failures** — Fix implementation based on test feedback

---

**Prepared by:** Test Architect (BMAD)  
**Date:** 2026-04-27  
**Status:** Ready for Implementation  
**Confidence Level:** High (testable architecture, clear acceptance criteria)
