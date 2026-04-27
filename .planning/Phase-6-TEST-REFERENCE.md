# Phase 6 Test Architecture: Quick Reference & Traceability

---

## Test Matrix: One Page

| Requirement                   | Test Type  | Priority | File                                      | Acceptance Criteria                                    | Status |
| ----------------------------- | ---------- | -------- | ----------------------------------------- | ------------------------------------------------------ | ------ |
| **Search: Query Parsing**     | Unit       | P0       | `article-read.test.ts`                    | Empty query → `[]`; trim whitespace                    | → NEW  |
| **Search: Language Filter**   | Unit + API | P0       | `article-read.test.ts` + `search.test.ts` | `?locale=en` returns English results                   | → NEW  |
| **Search: Relevance Ranking** | Unit       | P1       | `article-read.test.ts`                    | Title > Excerpt > Content                              | → NEW  |
| **Search: Result Limit**      | Unit + API | P1       | `article-read.test.ts` + `search.test.ts` | ≤30 results                                            | → NEW  |
| **Search: Fallback Chain**    | Unit       | P2       | `article-read.test.ts`                    | If no translation: fallback to master search           | → NEW  |
| **Search: Form UI**           | E2E        | P0       | `search-and-filter.spec.ts`               | User can type, click Buscar, see results               | → NEW  |
| **Search: Result Navigation** | E2E        | P1       | `search-and-filter.spec.ts`               | Result link navigates to article page                  | → NEW  |
| **i18n: Locale Matching**     | Unit       | P1       | `locale.test.ts`                          | `pt-BR` matches `pt-br`; case-insensitive              | → NEW  |
| **i18n: Fallback Default**    | Unit + API | P1       | `locale.test.ts` + `search.test.ts`       | No locale param → defaults to `pt-br`                  | → NEW  |
| **i18n: Route Variants**      | E2E        | P1       | `i18n-locale-routing.spec.ts`             | Language switcher updates results                      | → NEW  |
| **SEO: Sitemap XML Valid**    | Unit + API | P0       | `seo-sitemap.test.ts`                     | Valid XML structure; all locales included              | → NEW  |
| **SEO: Sitemap Dates**        | API        | P1       | `seo-sitemap.test.ts`                     | `<lastmod>` YYYY-MM-DD format                          | → NEW  |
| **SEO: Meta Description**     | E2E        | P1       | `seo-metadata-on-articles.spec.ts`        | `<meta name="description">` present                    | → NEW  |
| **SEO: OG Tags**              | E2E        | P1       | `seo-metadata-on-articles.spec.ts`        | `og:title`, `og:description`, `og:image`               | → NEW  |
| **SEO: Canonical URL**        | E2E        | P1       | `seo-metadata-on-articles.spec.ts`        | `<link rel="canonical">` matches page URL              | → NEW  |
| **SEO: Hreflang Tags**        | E2E        | P2       | `seo-metadata-on-articles.spec.ts`        | `<link rel="alternate" hreflang="pt">` for all locales | → NEW  |
| **SEO: Schema.org**           | E2E        | P2       | `seo-metadata-on-articles.spec.ts`        | `<script type="application/ld+json">` present          | → NEW  |
| **Auth: Public Search**       | API        | P1       | `search.test.ts`                          | `GET /api/search` no auth required                     | → NEW  |
| **Auth: Protected Admin API** | API        | P2       | `admin-auth.test.ts`                      | `GET /api/admin/*` returns 401 unauthenticated         | → NEW  |

---

## Tag Reference

### Priority Tags

- `@p0` — Critical path (ship blocker)
- `@p1` — Important (ship this sprint)
- `@p2` — Nice-to-have (follow-up)

### Domain Tags

- `@search` — Search functionality (query, ranking, results)
- `@seo` — SEO infrastructure (sitemap, robots, metadata)
- `@i18n` — Internationalization (locale routing, fallback)
- `@auth` — Authentication / authorization

### Type Tags

- `@unit` — Unit test (isolated, mocked)
- `@api` — API contract test (HTTP, no UI)
- `@e2e` — End-to-end (browser + server)
- `@integration` — Integration test (multiple units, real server)

### Example Usage

```bash
# Run all search tests
npm run test -- --grep "@search"

# Run P0 tests only
npm run test:e2e -- --grep "@p0"

# Run unit + API layer
npm run test:unit && npm run test:api

# Run all Phase 6 tests
npm run test:unit && npm run test:api && npm run test:e2e:p1
```

---

## File Organization Summary

```
tests/
├── fixtures/
│   ├── articles.fixture.ts       ← Article & translation factories
│   └── locales.fixture.ts        ← Locale variants
├── mocks/
│   ├── appwrite.ts               ← Mock Appwrite client
│   └── nuxt.ts                   ← Mock Nuxt runtime config
├── setup.ts                      ← Global test setup
├── unit/
│   └── server/
│       ├── api/
│       │   └── search.test.ts
│       └── utils/
│           ├── article-read.test.ts
│           └── locale.test.ts
├── api-contract/                 ← New dir for Playwright HTTP tests
│   ├── search.test.ts
│   └── seo-sitemap.test.ts
└── e2e/
    ├── p0/
    │   ├── busca.spec.ts         [EXISTING]
    │   ├── article-not-found.spec.ts
    │   ├── admin-login.spec.ts
    │   └── public-home.spec.ts
    └── p1/
        ├── search-and-filter.spec.ts       [NEW]
        ├── seo-metadata-on-articles.spec.ts [NEW]
        └── i18n-locale-routing.spec.ts      [NEW]
```

---

## Execution Roadmap

### Day 1: Setup

1. Install Vitest: `npm install -D vitest @vitest/ui @vitest/coverage-v8 happy-dom`
2. Create `vitest.config.ts`
3. Create `tests/setup.ts`, `tests/mocks/`, `tests/fixtures/`
4. Commit: "test(infra): Add Vitest config and test infrastructure"

### Day 2: Unit Tests

1. Implement `article-read.test.ts` (search logic, ranking, fallback)
2. Implement `locale.test.ts` (language matching, normalization)
3. Run: `npm run test:unit:coverage`
4. Target: >85% coverage on article-read.ts, locale.ts
5. Commit: "test(unit): Add search and locale utility tests"

### Day 3: API Contract Tests

1. Create `tests/api-contract/` directory
2. Implement `search.test.ts` (HTTP contract for `/api/search`)
3. Implement `seo-sitemap.test.ts` (`/sitemap.xml`, `/robots.txt`)
4. Run: `npm run test:api`
5. Commit: "test(api): Add search and SEO endpoint contract tests"

### Day 4-5: E2E Tests

1. Implement `search-and-filter.spec.ts` (user search workflow)
2. Implement `seo-metadata-on-articles.spec.ts` (HTML metadata)
3. Implement `i18n-locale-routing.spec.ts` (language switching)
4. Run: `npm run test:e2e:p1`
5. Commit: "test(e2e): Add search, SEO, and i18n workflows"

### Day 5: Finalize

1. Run full suite: `npm run test:phase6`
2. Generate coverage report
3. Update ROADMAP.md with test metrics
4. Create PR with all test changes
5. Commit: "test(phase6): Complete test architecture for search engine integration"

---

## Coverage Targets

| Layer | Target | Metric                                                                      | Tooling         |
| ----- | ------ | --------------------------------------------------------------------------- | --------------- |
| Unit  | 85%    | Lines + branches in `article-read.ts`, `locale.ts`                          | Vitest + v8     |
| API   | 90%    | All endpoints: `/api/search`, `/api/admin/*`, `/sitemap.xml`, `/robots.txt` | Playwright HTTP |
| E2E   | 80%    | Critical workflows: search form, results, article view, SEO metadata        | Playwright      |

---

## Common Commands

```bash
# Unit tests
npm run test:unit                 # Run once
npm run test:unit:watch          # Watch mode
npm run test:unit:ui             # UI dashboard
npm run test:unit:coverage       # Coverage report

# API contract tests
npm run test:api                 # Run HTTP contract tests

# E2E tests
npm run test:e2e:p0              # Critical path (existing + new)
npm run test:e2e:p1              # Important (Phase 6)
npm run test:e2e:all             # All E2E tests

# Combined
npm run test:phase6              # Unit + API + E2E P0

# Filtered by tag
npm run test -- --grep "@search" # All search-related tests
npm run test:e2e -- --grep "@p0" # All P0 E2E tests
```

---

## Risk & Mitigation

| Risk                         | Likelihood | Impact | Mitigation                                              |
| ---------------------------- | ---------- | ------ | ------------------------------------------------------- |
| Appwrite mocking complexity  | Medium     | Medium | Reuse fixtures from Phase 2; document mock surface      |
| E2E flakiness (timing)       | High       | High   | Waiters, retries (built-in Playwright), longer timeouts |
| Database state inconsistency | Medium     | High   | Use isolated test DB; seed before each test             |
| Language fallback bugs       | Medium     | High   | Exhaustive unit tests; document priority order          |

---

## Integration with CI/CD

Add to GitHub Actions workflow (`.github/workflows/test.yml`):

```yaml
name: Test Phase 6

on: [pull_request, push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      # Unit + API tests
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:api

      # E2E tests
      - run: npm run test:e2e:p0

      # Coverage upload
      - uses: codecov/codecov-action@v4
        with:
          files: ./coverage/coverage-final.json
```

---

## Next Actions

1. ✅ **Phase 6 Test Design Document** created (`.planning/Phase-6-TEST-DESIGN.md`)
2. ✅ **Phase 6 Test Scaffolding** created (`.planning/Phase-6-TEST-SCAFFOLDING.md`)
3. ✅ **Quick Reference Guide** created (this file)
4. → **Implement Unit Tests** (Day 2)
5. → **Implement API Contract Tests** (Day 3)
6. → **Implement E2E Tests** (Days 4-5)
7. → **Finalize & UAT Handoff** (Day 5)

---

**Prepared by:** Master Test Architect (BMAD)  
**Date:** 2026-04-27  
**Status:** Ready for Implementation  
**Confidence:** High
