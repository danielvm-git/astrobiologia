# Architecture

**Analysis Date:** 2026-04-26

## Pattern Overview

**Overall:** SvelteKit Server-Side Rendering (SSR) with Appwrite backend, session-based authentication, and layered separation between public content and admin dashboard.

**Key Characteristics:**
- SSR + prerendering for public pages (faster static delivery, SEO-friendly)
- Server-first authentication with httpOnly session cookies
- Split SDK usage: browser Appwrite SDK for OAuth, node-appwrite for server operations
- Multi-language (i18n) via Paraglide with server-side language detection
- Public/Admin route split with centralized auth guard in hooks

## Layers

**Route Layer (SvelteKit +page.server.ts / +layout.server.ts):**
- Purpose: Entry points for HTTP requests; load data, return component props, handle form actions
- Location: `apps/web-svelte/src/routes/**/*.server.ts`
- Contains: Page/layout server load functions, form actions (POST/DELETE), API endpoints
- Depends on: `$lib/server/appwrite` (session client), `$lib/appwrite` (browser SDK), Paraglide i18n
- Used by: Svelte components receive `data` prop, form actions receive `event.request`

**Auth/Hook Layer (hooks.server.ts):**
- Purpose: Global request middleware that verifies sessions before any route handler runs
- Location: `apps/web-svelte/src/hooks.server.ts`
- Contains: `handleAdminAuth` (session verification, redirect unauthenticated admins), `handleParaglide` (i18n)
- Depends on: `$lib/server/appwrite` (session client), route detection logic
- Used by: SvelteKit automatically invokes before every request; sets `event.locals.user`, `event.locals.paraglide`

**Server Utilities (lib/server/*):**
- Purpose: Server-only operations: session management, admin clients, logging, language detection
- Location: `apps/web-svelte/src/lib/server/`
- Contains: `appwrite.ts` (admin/session clients), `session-cookie.ts` (httpOnly cookie setter), `logger.ts`, `public-origin.ts` (HTTPS detection for secure cookies)
- Depends on: `node-appwrite` SDK (admin API with API key)
- Used by: Route handlers, hooks, OAuth callback

**Browser SDK Layer (lib/appwrite-datasets.ts, lib/appwrite.ts):**
- Purpose: Client-side Appwrite SDK initialization and public data queries (no auth)
- Location: `apps/web-svelte/src/lib/appwrite-datasets.ts`, `apps/web-svelte/src/lib/appwrite.ts`
- Contains: `account`, `databases`, `storage` objects from browser SDK; helper functions (`getPublishedArticles`, `getArticleBySlug`)
- Depends on: Browser `appwrite` SDK (v17, positional args)
- Used by: Public pages for reading published articles, OAuth callback (browser-initiated)

**Component Layer (lib/components/*, routes/*/+page.svelte):**
- Purpose: UI rendering; display data from load functions, emit form actions
- Location: `apps/web-svelte/src/lib/components/`, `apps/web-svelte/src/routes/**/*.svelte`
- Contains: Reusable UI components (shadcn/ui), page-specific components
- Depends on: Route data, form actions, stores
- Used by: SvelteKit renders components with props

**Store Layer (lib/stores/auth.ts):**
- Purpose: Client-side reactive state management for auth UI
- Location: `apps/web-svelte/src/lib/stores/auth.ts`
- Contains: Auth state machine (subscriber pattern)
- Depends on: None
- Used by: Admin pages for showing/hiding auth UI based on `locals.user`

**Data Access Layer (lib/appwrite.ts, lib/server/appwrite.ts):**
- Purpose: Database query builders and type definitions
- Location: `apps/web-svelte/src/lib/appwrite.ts`, `apps/web-svelte/src/lib/server/appwrite.ts`
- Contains: TypeScript interfaces (Article, Category, User), query helpers
- Depends on: Appwrite SDK (browser or node)
- Used by: Route handlers, components

## Data Flow

**Public Article View (SSR + Prerendering):**

1. Browser requests `/artigos/[slug]`
2. SvelteKit routes to `+page.server.ts` (load function)
3. Load function calls `getArticleBySlug(slug, lang)` → `$lib/appwrite.ts` → browser SDK query (public database)
4. Data returned as `data` prop to `+page.svelte`
5. Component renders, SvelteKit precompiles HTML
6. Browser receives static HTML (fast, SEO-friendly)

**Admin Article Create (Server Action):**

1. Admin logs in via `/admin/login` (email/password)
2. `+page.server.ts` action calls `createAdminClient()` → `account.createEmailPasswordSession(email, password)` (node-appwrite)
3. Session returns `{ userId, secret, expire }`
4. `setAppwriteSessionCookie()` writes httpOnly cookie: `a_session_${PROJECT_ID}`
5. Next request: `handleAdminAuth` hook reads cookie, calls `createSessionClient(event)`, verifies session via `account.get()`
6. `event.locals.user` populated; admin pages load
7. Admin fills form, POSTs to `/admin/artigos/new` action
8. Action calls `createAdminClient()` (API key auth), creates article master doc + translation docs
9. Form action returns success; browser redirects to articles list

**OAuth Flow (Google):**

1. Admin clicks "Login with Google" button
2. Browser calls `startGoogleOAuth()` → `account.createOAuth2Token(OAuthProvider.Google, successUrl, failureUrl)` (browser SDK only)
3. Appwrite opens Google login popup
4. On success, redirects to `/oauth?userId=...&secret=...`
5. Server `+server.ts` (OAuth callback) receives params
6. `createAdminClient()` exchanges `{ userId, secret }` for a session via `account.createSession({ userId, secret })` (node-appwrite)
7. `setAppwriteSessionCookie()` sets httpOnly cookie
8. Redirects to `/admin/dashboard`

**Public Articles List (Server-Side Data):**

1. Browser requests `/artigos`
2. `+page.server.ts` load calls `getRequestLanguage(locals)` → detects lang from cookie/header
3. Calls `getPublishedArticles(lang, limit)` → queries Appwrite via browser SDK
4. Returns articles to component
5. Component renders list

## State Management

**Authentication State:**
- **Server Side:** `event.locals.user` (populated by `handleAdminAuth` hook from session cookie)
- **Client Side:** Optional store (`$lib/stores/auth.ts`) for reactive UI (login form state, etc.)
- **Boundary:** Route layouts pass `{ user }` via `data` prop; components read from `data.user`

**Session Persistence:**
- Stored in httpOnly cookie `a_session_${PROJECT_ID}`
- Secure flag enabled when `isPublicHttps()` returns true (detects HTTPS or proxy)
- SameSite=lax for cross-site requests (OAuth redirects)
- Set on successful login/OAuth; deleted on logout or expiration

**Page Data:**
- Loaded server-side via `+page.server.ts` load function
- Passed to component as `data` prop
- Client hydration updates reactive bindings (Svelte 5 runes: `$state`, `$derived`)

## Key Abstractions

**Appwrite Client Factory Pattern:**

Two factories manage SDK instantiation:

- `createAdminClient()` → `node-appwrite` with API key → elevated permissions (admin operations, article creation/deletion)
- `createSessionClient(event)` → `node-appwrite` with session cookie → user-scoped permissions (articles by user, limited updates)

Both return lazy-loaded `{ account, databases, storage }` objects.

**Session Cookie Management:**

`SESSION_COOKIE` constant: `a_session_${PUBLIC_APPWRITE_PROJECT_ID}`

Follows Appwrite's naming convention for multi-project support. `setAppwriteSessionCookie()` utility encapsulates:
- Cookie name resolution
- Expiration date parsing from Appwrite session object
- Secure flag conditional on HTTPS (via `isPublicHttps()`)
- httpOnly + SameSite=lax defaults

**Article Master + Translations Pattern:**

Two collections:
- `COLLECTIONS.ARTICLES` → master metadata (category, tags, status, author, publishedAt)
- `COLLECTIONS.ARTICLES_TRANSLATIONS` → language-specific content (title, slug, content, SEO fields)

Admin pages load master + all translations in one query; display as grid with language badges.

**Multi-Language Routing:**

Paraglide (inlang) middleware:
- Detects language from URL prefix (`/pt-br/artigos` vs `/en/artigos`)
- Falls back to Accept-Language header
- Sets `event.locals.paraglide = { lang: locale }`
- Transforms page HTML with locale-specific strings (`%paraglide.lang%`, `%paraglide.dir%`)

## Entry Points

**Public Home (`/`):**
- Location: `apps/web-svelte/src/routes/+page.server.ts`
- Triggers: Browser request to `https://astrobiologia.com.br/`
- Responsibilities: Load featured articles, categories for display

**Admin Dashboard (`/admin/dashboard`):**
- Location: `apps/web-svelte/src/routes/admin/dashboard/+page.server.ts`
- Triggers: Authenticated admin request
- Responsibilities: Load user stats, recent articles, admin summary data
- Protection: `handleAdminAuth` redirects unauthenticated users to `/admin/login`

**Admin Article Editor (`/admin/artigos/new`, `/admin/artigos/[id]/edit`):**
- Location: `apps/web-svelte/src/routes/admin/artigos/new/+page.server.ts`, etc.
- Triggers: Admin POST/PUT with form data
- Responsibilities: Create/update master article + all language translations

**OAuth Callback (`/oauth`):**
- Location: `apps/web-svelte/src/routes/oauth/+server.ts`
- Triggers: Appwrite OAuth redirect with `userId` and `secret` query params
- Responsibilities: Exchange OAuth credentials for httpOnly session cookie

**API Routes (Health, Upload, Translate):**
- Location: `apps/web-svelte/src/routes/api/**/*.ts`
- Triggers: Direct HTTP requests (healthchecks, file uploads, translation service calls)
- Responsibilities: Server-side proxying to external services (DeepL, etc.)

## Error Handling

**Strategy:** Exceptions thrown in load functions become HTTP error responses; form actions return `{ error }` objects.

**Patterns:**

- **Load function errors:** `throw error(404, "Not found")` → SvelteKit renders error page with status code
- **Action errors:** `return fail(400, { message: "..." })` → form component displays inline error
- **Logging:** `createLogger()` utility logs to console/external service with context (email, path, error message)
- **Session errors:** Invalid/expired session caught in hook → cookie deleted, user redirected to login

## Cross-Cutting Concerns

**Logging:** 
- Utility: `createLogger(module)` → returns logger with `.info()`, `.debug()`, `.error()`, `.warn()`
- Used in: hooks, route handlers, server utilities
- Format: Structured JSON with context (`{ email, path, err }`)

**Validation:**
- Form data validated in route actions before Appwrite operations
- Database queries use Appwrite `Query` builder (type-safe query DSL)
- TypeScript interfaces enforce shape at compile time

**Authentication:**
- Centralized in hooks + server utilities
- No auth checks in components (relies on `data.user` passed from server)
- Admin routes protected by conditional redirects in hooks

**Internationalization:**
- Paraglide middleware handles locale detection + routing
- Language selection stored in URL path (not cookies)
- Article queries parameterized by language (e.g., `getPublishedArticles(lang, limit)`)

---

*Architecture analysis: 2026-04-26*
