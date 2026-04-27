# Codebase Concerns

**Analysis Date:** 2026-04-26

## Critical Issues

### Google OAuth Migration Incomplete (Nuxt)

**Issue:** Google OAuth login is stubbed but not implemented in Nuxt app

**Files:** `apps/web-nuxt/pages/admin/login.vue:50-53`

**Impact:** Users attempting Google OAuth on Nuxt admin login receive error message instead of functional auth flow. Blocks OAuth adoption on secondary application.

**Current State:** Function exists but returns: `'Login com Google ainda não migrado para Nuxt.'`

**Fix Approach:**
- Port Google OAuth logic from SvelteKit to Nuxt (reference: `apps/web-svelte/src/lib/auth/google-oauth-browser.ts`)
- Implement OAuth token exchange via Nitro middleware
- Set httpOnly session cookie on callback

---

## Medium Severity

### Type Assertions Bypass Type Safety

**Issue:** Widespread use of `as unknown as T` casting in Appwrite queries

**Files:**
- `apps/web-svelte/src/lib/data/article-read.ts:42` — Translation responses cast without validation
- `apps/web-svelte/src/lib/data/article-read.ts:97` — Article responses cast without validation
- `apps/web-svelte/src/lib/data/article-read.ts:113` — Featured articles cast without validation
- `apps/web-svelte/src/lib/appwrite.ts:100,112,126,139` — All CRUD operations use unsafe casts

**Impact:** Type mismatches in Appwrite SDK responses (e.g., nested `article_id` structures) could silently create bugs. Zero compile-time safety on database round-trips.

**Current State:** Every `databases.listDocuments()` and `getDocument()` is followed by `as unknown as T` with no intermediate type guard.

**Root Cause:** Appwrite SDK returns `any` from API calls; no schema validation layer exists.

**Fix Approach:**
- Introduce Zod schemas for Article and ArticleTranslation matching DB schema
- Replace all `as unknown as T` with `schema.parse(response)`
- Catch validation errors and return null or default instead of crashing

**Example Fix:**
```typescript
// Before
const articles = response.documents as unknown as Article[];

// After
import { ArticleSchema } from '$lib/schemas';
const articles = response.documents.map(doc => ArticleSchema.parse(doc));
```

---

### Appwrite SDK Split Not Fully Contained

**Issue:** Client SDK (`appwrite` v17) and server SDK (`node-appwrite` v24) have different APIs; calls can leak between contexts

**Files:**
- `apps/web-svelte/src/lib/appwrite-datasets.ts:1` — Client SDK imported
- `apps/web-svelte/src/lib/server/appwrite.ts:1` — Server SDK imported
- Boundary: No explicit export/import guards between client and server

**Impact:** If developer accidentally imports server SDK in client code (or vice versa), tree-shaking may fail and bundle size could increase. Errors only appear at runtime.

**Current State:** SDKs co-exist but are in separate `$lib/` files (`appwrite-datasets.ts` vs `lib/server/appwrite.ts`). Import guards rely on naming convention.

**Fix Approach:**
- Add explicit barrel exports: `$lib/client.ts` re-exports client SDK only
- Add explicit barrel exports: `$lib/server.ts` re-exports server SDK only
- Update ESLint to forbid direct imports from `'appwrite'` or `'node-appwrite'`
- Add a integration test that verifies client bundle does not include server SDK

---

### Session Cookie Fallback Relies on `any` Cast

**Issue:** Appwrite session cookie lookup uses type assertion

**Files:** `apps/web-svelte/src/lib/server/appwrite.ts:46-51`

```typescript
if (!session && 'getAll' in event.cookies) {
    const allCookies = (event.cookies as any).getAll();  // ← unsafe cast
    const fallbackCookie = allCookies.find((c: any) => c.name.startsWith('a_session_'));
}
```

**Impact:** If SvelteKit changes `Cookies` API, the fallback silently fails with no type error. Cookie lookup becomes fragile across framework upgrades.

**Current State:** Fallback logic assumes `getAll()` exists; no type guard or interface extraction.

**Fix Approach:**
- Define a proper interface for the fallback cookie lookup
- Use function overloading instead of `any` cast
- Add unit test for fallback logic with mock cookies

---

### N+1 Query Pattern in Article Loading

**Issue:** Multiple sequential `databases.listDocuments()` calls for translation joins

**Files:** `apps/web-svelte/src/lib/data/article-read.ts:88-102` (getPublishedArticles pattern repeated in other functions)

**Pattern:**
1. Fetch articles (Query.limit = 20)
2. Extract article IDs
3. Fetch translations for each batch of IDs (Query.limit = 50-2500)

**Impact:** Two network round-trips per page load. With pagination, requests scale linearly with article count. Appwrite charges per-request; inefficient for budget.

**Current State:** Chunking implemented (`ARTICLE_ID_CHUNK_SIZE = 15`) but still requires separate query. No caching between routes.

**Affected Functions:**
- `getPublishedArticles()` — Lines 88-102
- `getFeaturedArticles()` — Lines 105-119
- `getArticleBySlug()` — Lines 122-174 (fallback search path makes 3-4 queries)
- `getArticlesByCategory()` — Lines 177-195
- `searchPublishedArticles()` — Lines 206-269 (field search loops, up to 3 queries per field)

**Fix Approach:**
- Consider Appwrite database relationships (if available) to avoid manual joins
- Implement SvelteKit route caching with `depends()` for invalidation
- Add request-level cache for translations within same pageload
- For search, batch all translation queries before fetching masters

---

## Low Severity / Design Decisions

### Large Component Size

**Issue:** ArticleEditor.svelte is 750 lines (beyond 300-line guideline)

**File:** `apps/web-svelte/src/lib/components/ArticleEditor.svelte:1-750`

**Why It Exists:** Multi-language editing, Tiptap integration, image upload, and translation state management require tight integration.

**Current Mitigation:** Component uses `$state` runes for reactive state management, reducing closures. Logic is still dense.

**Refactoring Path (if needed):**
- Extract translation management logic into a separate store (`stores/translation.ts`)
- Extract Tiptap editor setup into a composable
- Split rendering into subcomponents: `<EditorToolbar />`, `<LanguageTabs />`, `<TranslationPanel />`

**Status:** By design; monitor if this becomes a test burden.

---

### Manual Sanitization in Form Handling

**Issue:** Custom `sanitize()` function used instead of declarative schema

**Files:** `apps/web-svelte/src/routes/admin/artigos/[id]/edit/+page.server.ts:53-62`

```typescript
const sanitize = (data: any) => {
    const clean: any = {};
    const forbidden = ['updatedAt', 'createdAt'];
    for (const key in data) {
        if (!key.startsWith('$') && !forbidden.includes(key)) {
            clean[key] = data[key];
        }
    }
    return clean;
};
```

**Impact:** Sanitization logic lives in the action handler, making it easy to forget on new routes. No single source of truth for "allowed fields."

**Current State:** Works correctly but scattered across `+page.server.ts` files.

**Fix Approach:**
- Move sanitization into a reusable utility: `$lib/server/sanitize.ts`
- Define schemas for Article and ArticleTranslation with `.omit()` for internal fields
- Use `Zod` or similar to enforce field whitelisting

---

### Console Logging in Production

**Issue:** Console statements used throughout codebase (25+ instances)

**Files:** Sample instances
- `apps/web-svelte/src/lib/data/article-read.ts:148` — console.error
- `apps/web-svelte/src/routes/admin/artigos/[id]/edit/+page.server.ts:32` — console.error
- Multiple test files use console (acceptable context)

**Impact:** Sensitive debugging info (error stacks, article IDs) could leak to browser console in production. No centralized error reporting to external service.

**Current State:** Logger utility exists (`createLogger()`) but not used everywhere. Some files use bare `console.error()` instead.

**Fix Approach:**
- Replace all `console.*` with `logger.*` calls
- Ensure logger respects `dev` flag: DEBUG in dev, INFO+ in production
- Add optional integration with error tracking service (e.g., Sentry) for production errors

---

### Hardcoded Limits and Magic Numbers

**Issue:** Query limits are scattered with magic constants

**Files:**
- `apps/web-svelte/src/lib/data/article-read.ts:10` — `TRANSLATION_JOIN_LIMIT_CAP = 2500`
- `apps/web-svelte/src/lib/data/article-read.ts:11` — `TRANSLATION_JOIN_MIN = 50`
- `apps/web-svelte/src/lib/data/article-read.ts:12` — `TRANSLATIONS_PER_ARTICLE_HEADROOM = 10`
- `apps/web-svelte/src/lib/data/article-read.ts:21` — `ARTICLE_ID_CHUNK_SIZE = 15`
- Various routes use `limit(100)`, `limit(50)`, `limit(20)` without centralization

**Impact:** If Appwrite changes document limits or performance regresses, multiple files need updating. Hard to reason about pagination boundaries.

**Fix Approach:**
- Create `$lib/server/queries.config.ts` with all constants
- Define query profiles: `PROFILES = { tiny: 10, small: 20, medium: 50, large: 100 }`
- Use profile names instead of magic numbers

---

### No Input Validation on Search

**Issue:** Search queries accept raw user input without length/character validation

**Files:** `apps/web-svelte/src/lib/data/article-read.ts:206-269` (searchPublishedArticles)

```typescript
export async function searchPublishedArticles(searchTerm: string, language = 'pt-br', limit = 20): Promise<Article[]> {
    const normalizedTerm = searchTerm.trim();  // ← Only trims, no length check
    if (!normalizedTerm) {
        return getPublishedArticles(language, limit);
    }
    // Passes directly to Query.search(field, normalizedTerm)
}
```

**Impact:** Very long or special-character search terms could:
- Cause Appwrite query timeouts
- Create expensive database scans
- Allow regex injection (if Appwrite's search supports it)

**Current State:** Works for normal usage but no guards against abuse.

**Fix Approach:**
- Add validation before query:
  ```typescript
  if (normalizedTerm.length < 2 || normalizedTerm.length > 100) {
      return [];
  }
  ```
- Define allowed characters (alphanumeric + common punctuation)
- Add rate limiting at the API boundary

---

### Incomplete Cookie Security Settings (SSR Context)

**Issue:** Cookie `secure` flag depends on `isPublicHttps()` check that may not cover all scenarios

**Files:** `apps/web-svelte/src/lib/server/session-cookie.ts:21`

```typescript
secure: isPublicHttps(url, request)
```

**Reference:** `$lib/server/public-origin.ts` determines HTTPS via `PUBLIC_ORIGIN` env var or adapter detection.

**Impact:** If `PUBLIC_ORIGIN` is missing and adapter detection fails, cookies could be set as insecure (non-HTTPS) even on production sites behind proxies, allowing session hijacking.

**Current State:** Fallback exists but relies on `ORIGIN` adapter header, which may not be present in all deployment environments.

**Fix Approach:**
- Add validation on server startup to ensure `PUBLIC_ORIGIN` is set in production (`NODE_ENV === 'production'`)
- Log warning if HTTPS detection is ambiguous
- Add integration test for cookie flags in both HTTP and HTTPS contexts

---

## Performance Observations

### Repeated Translation Queries in Search

**Issue:** `searchPublishedArticles()` may query translations 3+ times for overlapping results

**Files:** `apps/web-svelte/src/lib/data/article-read.ts:224-241` (loop over 3 fields)

**Pattern:**
```typescript
for (const field of translationSearchFields) {  // title, excerpt, content
    const response = await databases.listDocuments(..., Query.search(field, term));
    // May return same articles multiple times
}
```

**Impact:** Duplicate translation fetches if same article matches multiple fields. With limit=20 per field, up to 60 DB queries for one search.

**Better Approach:**
- Deduplicate article IDs from all field searches before fetching translations
- Use `Set` to track seen articles

---

## Test Coverage Gaps

### No Tests for Cookie Fallback Logic

**Issue:** Session cookie fallback (project-specific → generic `a_session_*`) is untested

**Files:** `apps/web-svelte/src/lib/server/appwrite.ts:46-51`

**Risk:** If fallback is buggy, users on old cookies cannot log in. Only discovered in production.

**Fix:** Add test case to `tests/phase2/oauth_callback.test.ts` or new `cookie-fallback.test.ts`

---

### Missing Sanitization Tests

**Issue:** Article field sanitization has only one regression test

**Files:** `tests/integration/admin_save_regression.test.ts:31` — One test covers sanitization

**Risk:** Future changes to sanitization logic could leak Appwrite internal fields or allow forbidden fields.

**Fix:** Add specific test suite for sanitization:
- Test removal of `$id`, `$createdAt`, `$updatedAt`
- Test removal of custom forbidden fields
- Test that allowed fields are preserved

---

## Decision Log

### Why `as unknown as T` instead of proper type guards?

**Answer:** Appwrite SDK types are loose (`any` return type). Adding Zod would be a medium refactor across all data fetching. Currently accepted as tech debt with low risk (crashes caught in staging).

### Why separate `getAll()` cookie lookup with `any`?

**Answer:** SvelteKit `Cookies` API only exposes `.get()` by default. The `getAll()` method is internal. The fallback is defensive but brittle.

### Why N+1 queries instead of Appwrite relationships?

**Answer:** Article-to-Translation relationship may not be configured or supported in target Appwrite version. Manual joins are explicit and easier to optimize locally.

---

*Concerns audit: 2026-04-26*
