# Architecture

**Analysis Date:** 2025-02-23

## Pattern Overview

**Overall:** SvelteKit + Appwrite Headless CMS with Master-Translation Pattern

**Key Characteristics:**
- **Master-Translation Pattern:** Separates content-neutral metadata (master) from localized content (translations).
- **Localized Routing:** Uses Paraglide-js for path-based localization and runtime translation switching.
- **Server-Side Rendering (SSR):** Optimized for SEO with data fetching in `+page.server.ts`.
- **Svelte 5 Runes:** Modern reactive state management using `$state`, `$derived`, and `$effect`.

## Layers

**Presentation Layer:**
- Purpose: Renders the user interface and handles client-side interaction.
- Location: `src/routes/` and `src/lib/components/`
- Contains: Svelte components, Svelte 5 runes, CSS (Tailwind 4).
- Depends on: `src/lib/appwrite.ts`, `src/lib/paraglide/runtime.js`
- Used by: End users.

**Infrastructure Layer (Appwrite):**
- Purpose: Data persistence, authentication, and file storage.
- Location: `src/lib/appwrite.ts` (client) and `src/lib/server/appwrite.ts` (server).
- Contains: Appwrite client initializations and data fetching wrappers.
- Depends on: `appwrite` (client SDK), `node-appwrite` (server SDK).
- Used by: Presentation layer and Server hooks.

**Internationalization (i18n):**
- Purpose: Handles multi-language support and routing.
- Location: `src/lib/paraglide/`, `messages/`, and `project.inlang/`
- Contains: Generated runtime, translation JSON files, and Inlang config.
- Depends on: `@inlang/paraglide-js`
- Used by: Entire application via `src/hooks.server.ts` and component imports.

## Data Flow

**Master-Translation Fetching:**

1. **Detection:** `src/hooks.server.ts` detects the locale from the URL via `paraglideMiddleware`.
2. **Request:** `+page.server.ts` calls a data helper (e.g., `getPublishedArticles(lang)`).
3. **Master Fetch:** Server fetches "master" articles from the `articles` collection (filtered by status, etc.).
4. **Translation Fetch:** Server fetches documents from `article_translations` matching the article IDs and the detected language.
5. **Join:** The helper merges the master metadata with the specific translation document.
6. **SSR:** SvelteKit renders the page with the joined data.

**State Management:**
- Global state is handled via Svelte 5 runes and `$app/state`.
- Localized state is managed by Paraglide's runtime.

## Key Abstractions

**Article:**
- Purpose: Represents the core metadata of a news item (status, category, featured).
- Examples: `src/lib/appwrite.ts` (`Article` interface).
- Pattern: Master record.

**ArticleTranslation:**
- Purpose: Represents the localized version of an article (title, slug, content).
- Examples: `src/lib/appwrite.ts` (`ArticleTranslation` interface).
- Pattern: Child translation record.

**paraglideMiddleware:**
- Purpose: SvelteKit handle hook for localization.
- Examples: `src/hooks.server.ts`
- Pattern: Middleware / Interceptor.

## Entry Points

**Server Hooks:**
- Location: `src/hooks.server.ts`
- Triggers: Every server-side request.
- Responsibilities: Localization detection, authentication session verification, and redirects.

**Global Layout:**
- Location: `src/routes/+layout.svelte`
- Triggers: Initial page load and route changes.
- Responsibilities: Header/Footer rendering, global SEO setup, and progress bar.

## Error Handling

**Strategy:** Graceful degradation with localized error feedback.

**Patterns:**
- **Server Load Catch:** `try-catch` blocks in `+page.server.ts` returning fallback data (e.g., empty arrays).
- **SvelteKit Errors:** Standard `+error.svelte` for unhandled or thrown errors.

## Cross-Cutting Concerns

**Logging:** Standard `console.log/warn/error` for server-side debugging.
**Validation:** TypeScript interfaces for Appwrite documents and function parameters.
**Authentication:** Appwrite session-based auth, managed in `src/hooks.server.ts` and `src/lib/server/appwrite.ts`.

---

*Architecture analysis: 2025-02-23*
