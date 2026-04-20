# Codebase Concerns

**Analysis Date:** 2025-05-23

## Tech Debt

**Hybrid i18n Schema:**
- Issue: Articles currently exist in a hybrid state where some content is in the `articles` collection and some in `article_translations`. Legacy fields like `title`, `slug`, and `content` remain in the `articles` collection for backward compatibility.
- Files: `src/lib/appwrite.ts`, `scripts/update-schema-i18n.js`
- Impact: Increased complexity in data fetching logic and potential for data desynchronization.
- Fix approach: Complete the migration of all content to `article_translations` and remove legacy fields from the `articles` collection schema.

**Manual Relationship Management:**
- Issue: Relationships between articles and their translations are handled manually in application logic rather than by the database.
- Files: `src/lib/appwrite.ts`
- Impact: Risk of orphaned records and inconsistent state if a multi-step operation (like `deleteArticle`) fails partially.
- Fix approach: Implement robust error handling and potentially a cleanup script to identify and remove orphaned translations.

## Potential Risks

**Hydration Stability (Svelte 5):**
- Risk: Potential for hydration mismatch between server-rendered HTML and client-side initialization, especially with Svelte 5 runes (`$state`, `$derived`) if they depend on values that differ between environments.
- Files: `src/routes/+page.svelte`, `src/lib/components/ArticleCard.svelte`
- Current mitigation: Minimal use of browser-only globals in root components.
- Recommendations: Ensure all browser-only logic is wrapped in `onMount` or protected by `browser` checks from `$app/environment`.

**Build-time Appwrite Connectivity:**
- Risk: The project uses `prerender = true` in the root layout, meaning SvelteKit attempts to fetch content from Appwrite during the build process.
- Files: `src/routes/+layout.server.ts`, `src/lib/server/appwrite.ts`
- Current mitigation: `admin` routes explicitly disable prerendering.
- Recommendations: Ensure build environment (CI/CD) has all necessary `PUBLIC_*` and `PRIVATE_*` environment variables and network access to the Appwrite endpoint. Consider disabling prerendering for content-heavy pages if the build time becomes too long or unreliable.

## Performance Bottlenecks

**Sequential Appwrite Queries:**
- Problem: Fetching articles requires multiple sequential requests to Appwrite (one for master records, one for translations).
- Files: `src/lib/appwrite.ts` (functions `getPublishedArticles`, `getFeaturedArticles`)
- Cause: Appwrite's NoSQL nature and lack of native joins for this schema design.
- Improvement path: Implement a caching layer (e.g., Redis or SvelteKit's built-in fetch cache) to reduce the number of requests to Appwrite.

**Hardcoded Query Limits:**
- Problem: `getAllArticles` and other fetchers use hardcoded limits (e.g., `Query.limit(100)`).
- Files: `src/lib/appwrite.ts`
- Cause: Lack of pagination implementation in some admin views.
- Improvement path: Implement proper cursor-based or offset-based pagination across all article lists.

## Test Coverage Gaps

**Integration Testing:**
- What's not tested: Complex i18n data fetching and the manual join logic between collections.
- Files: `src/lib/appwrite.ts`
- Risk: Logic errors in joining translations could lead to incorrect content being displayed or 404s for existing articles.
- Priority: High

**Edge Case Error Handling:**
- What's not tested: Application behavior when Appwrite is unreachable or returns partial errors during multi-document operations.
- Files: `src/lib/appwrite.ts`, `src/routes/+page.server.ts`
- Risk: Potential for "white screen of death" or unhandled exceptions in production.
- Priority: Medium

---

*Concerns audit: 2025-05-23*
