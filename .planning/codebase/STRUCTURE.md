# Codebase Structure

**Analysis Date:** 2026-04-26

## Directory Layout

```
apps/web-svelte/
├── src/
│   ├── routes/                          # SvelteKit route tree (filesystem-based routing)
│   │   ├── +layout.server.ts           # Root layout (global data: isAdmin, baseUrl)
│   │   ├── +page.server.ts             # Home page (featured articles)
│   │   ├── admin/                       # Admin routes (protected by handleAdminAuth hook)
│   │   │   ├── +layout.server.ts       # Admin layout (loads user from session)
│   │   │   ├── +layout.ts              # Client-side admin layout
│   │   │   ├── +page.server.ts         # Admin home/dashboard redirect
│   │   │   ├── dashboard/+page.server.ts
│   │   │   ├── login/+page.server.ts   # Email/password login + form action
│   │   │   ├── logout/+page.server.ts
│   │   │   ├── artigos/                # Article CMS
│   │   │   │   ├── +page.server.ts     # List all articles (admin)
│   │   │   │   ├── new/+page.server.ts # Create article action
│   │   │   │   ├── [id]/               # Edit article
│   │   │   │   │   └── edit/+page.server.ts
│   │   │   ├── settings/
│   │   │   └── seo/
│   │   ├── artigos/                    # Public article routes
│   │   │   ├── +page.server.ts         # Articles list (public)
│   │   │   └── [slug]/+page.server.ts  # Single article by slug
│   │   ├── busca/                      # Search
│   │   ├── categorias/[category]/      # Category browse
│   │   ├── api/                        # API routes (no SSR)
│   │   │   ├── health/+server.ts       # Health check
│   │   │   ├── upload/+server.ts       # File upload endpoint
│   │   │   ├── translate/+server.ts    # DeepL proxy
│   │   │   ├── artigos/                # Future REST endpoints
│   │   │   └── populate/               # Internal data seed
│   │   ├── oauth/+server.ts            # OAuth callback (receives userId, secret)
│   │   ├── sobre/                      # Static about page
│   │   ├── privacidade/                # Static privacy page
│   │   ├── robots.txt/+server.ts       # SEO robots.txt
│   │   └── sitemap.xml/+server.ts      # SEO sitemap
│   ├── lib/
│   │   ├── server/                     # Server-only utilities (never leak to browser)
│   │   │   ├── appwrite.ts            # Admin + Session clients (node-appwrite)
│   │   │   ├── session-cookie.ts      # httpOnly cookie setter
│   │   │   ├── public-origin.ts       # HTTPS detection for secure cookies
│   │   │   ├── logger.ts              # Structured logging
│   │   │   ├── request-language.ts    # Locale detection from request
│   │   │   └── deepl.ts               # DeepL API proxy
│   │   ├── auth/
│   │   │   └── google-oauth-browser.ts  # Browser SDK: starts Google OAuth
│   │   ├── stores/
│   │   │   └── auth.ts                # Svelte store (auth UI state)
│   │   ├── components/                # Reusable UI components (shadcn/ui)
│   │   ├── i18n/
│   │   │   ├── locale-tag.ts          # Language tag helpers
│   │   │   ├── category-messages.ts   # i18n category names
│   │   │   └── translation-fallback-badge.ts  # i18n status UI
│   │   ├── data/
│   │   │   └── article-read.ts        # Article reading state (progress, timestamps)
│   │   ├── paraglide/                 # Auto-generated i18n (inlang)
│   │   │   ├── runtime.ts
│   │   │   └── messages/              # Locale JSON files
│   │   ├── appwrite.ts                # Browser SDK + public helpers
│   │   ├── appwrite-datasets.ts       # Browser SDK initialization
│   │   ├── utils.ts                   # Generic utilities
│   │   ├── index.ts                   # Barrel export
│   │   └── seo.ts                     # SEO metadata helpers
│   ├── app.d.ts                        # TypeScript global types (App.Locals, App.PageData)
│   ├── hooks.server.ts                 # Global request middleware
│   └── paraglide/                      # Auto-generated locale config (inlang)
├── tests/                               # Test suites
│   ├── e2e/                            # Playwright end-to-end tests
│   ├── phase*/                         # Phase-specific tests
│   ├── atdd/                           # Acceptance test fixtures
│   ├── factories/                      # Test data factories (Article, etc.)
│   ├── mocks/                          # Mock implementations
│   └── integration/                    # Integration test suites
├── svelte.config.js                     # SvelteKit + Vite configuration
├── tsconfig.json                        # TypeScript configuration
├── vite.config.ts                       # Vite build config
└── package.json                         # Dependencies + scripts
```

## Directory Purposes

**src/routes/:**
- Purpose: HTTP route handlers; each directory = URL path
- Contains: `+page.server.ts` (SSR load), `+layout.server.ts` (nested layouts), `+server.ts` (API/streaming)
- Key files: Admin routes protected by hook; public routes prerendered; API routes proxy to services

**src/lib/server/:**
- Purpose: Server-only code; never imported by browser (enforced by SvelteKit config)
- Contains: Appwrite clients, session management, secrets
- Key files: `appwrite.ts` (admin + session client factories), `session-cookie.ts` (httpOnly setter)

**src/lib/auth/:**
- Purpose: Authentication logic split by SDK
- Contains: Browser OAuth initiation (must use browser SDK, not node-appwrite)
- Key files: `google-oauth-browser.ts` (browser-only, calls `account.createOAuth2Token`)

**src/lib/components/:**
- Purpose: Reusable UI components
- Contains: shadcn/ui library + custom components
- Key files: Button, Dialog, Form, etc. (inherited from shadcn setup)

**src/lib/paraglide/:**
- Purpose: Auto-generated internationalization (inlang)
- Contains: Locale JSON files, runtime utilities
- Key files: `runtime.ts` (exported helpers: `localizeHref()`, `locales` array)

**src/app.d.ts:**
- Purpose: Global TypeScript definitions for SvelteKit
- Contains: `App.Locals` (request-scoped data), `App.PageData` (load function return type)
- Key types: `Locals.user` (set by hook), `Locals.paraglide` (set by hook)

## Key File Locations

**Entry Points:**

| Route | File |
|-------|------|
| Home `/` | `src/routes/+page.server.ts` |
| Public articles `/artigos` | `src/routes/artigos/+page.server.ts` |
| Admin dashboard `/admin/dashboard` | `src/routes/admin/dashboard/+page.server.ts` |
| Admin login `/admin/login` | `src/routes/admin/login/+page.server.ts` |
| Article edit `/admin/artigos/[id]/edit` | `src/routes/admin/artigos/[id]/edit/+page.server.ts` |
| OAuth callback `/oauth` | `src/routes/oauth/+server.ts` |
| Health check `/api/health` | `src/routes/api/health/+server.ts` |

**Configuration:**

| Config | File |
|--------|------|
| SvelteKit + Vite | `svelte.config.js` |
| Build options | `vite.config.ts` |
| TypeScript | `tsconfig.json` |
| Playwright tests | `playwright.config.ts` |
| Environment vars | `.env` (never committed) |

**Core Logic:**

| Module | File |
|--------|------|
| Session client (node-appwrite) | `src/lib/server/appwrite.ts` |
| Browser SDK (Appwrite SDK) | `src/lib/appwrite-datasets.ts` |
| Database queries | `src/lib/appwrite.ts` |
| Auth middleware | `src/hooks.server.ts` |
| Google OAuth browser | `src/lib/auth/google-oauth-browser.ts` |

**Testing:**

| Suite | Location |
|-------|----------|
| End-to-end (Playwright) | `tests/e2e/p0/`, `tests/e2e/p1/` |
| Phase-specific | `tests/phase1/`, `tests/phase2/`, etc. |
| Integration | `tests/integration/` |
| Unit/Auth | `tests/atdd/`, `tests/mocks/` |

## Naming Conventions

**Files:**

- Route files: `+page.server.ts` (server load), `+page.svelte` (component), `+layout.server.ts` (nested layout)
- API routes: `+server.ts` (POST/GET handlers, no component)
- Library files: PascalCase for exports (e.g., `ArticleFactory.ts`), lowercase for utilities (e.g., `utils.ts`)
- Svelte components: PascalCase (e.g., `ArticleCard.svelte`)
- Test files: `*.test.ts`, `*.spec.ts`

**Directories:**

- URL paths: lowercase, kebab-case (e.g., `/admin/artigos`, `/api/health`)
- Dynamic segments: wrapped in brackets (e.g., `[id]`, `[slug]`, `[category]`)
- Feature directories: grouped by domain (e.g., `admin/`, `artigos/`, `api/`)
- Utility directories: `lib/` → services/stores/components/utils grouped by concern

**Exports & Functions:**

- Type names: PascalCase (e.g., `User`, `Article`, `ArticleTranslation`)
- Function names: camelCase (e.g., `getPublishedArticles`, `createAdminClient`, `setAppwriteSessionCookie`)
- Constant names: UPPER_SNAKE_CASE (e.g., `DATABASE_ID`, `SESSION_COOKIE`, `COLLECTIONS`)
- Hook names: prefix with `handle*` (e.g., `handleAdminAuth`, `handleParaglide`)

## Where to Add New Code

**New Public Page:**
1. Create directory: `src/routes/[page-name]/`
2. Add `+page.server.ts` with load function
3. Add `+page.svelte` component
4. If needing data: call existing queries from `$lib/appwrite.ts` or add new helper

**New Admin Page:**
1. Create directory: `src/routes/admin/[feature]/`
2. Add `+page.server.ts` with load function + actions
3. Add `+page.svelte` component
4. Auth guard handled automatically by `handleAdminAuth` hook
5. Use `createSessionClient(event)` for session-scoped queries; `createAdminClient()` for admin operations

**New API Endpoint:**
1. Create file: `src/routes/api/[endpoint]/+server.ts`
2. Export `GET`, `POST`, `PUT`, `DELETE` functions
3. No component needed (API route)
4. Use admin client for external service proxying or database operations

**New Component:**
1. Create file: `src/lib/components/[ComponentName].svelte`
2. Follow shadcn/ui pattern (copy from existing components)
3. Import and use in pages/layouts

**New Utility:**
1. If server-only: `src/lib/server/[utility].ts`
2. If client-safe: `src/lib/[utility].ts`
3. Export from `src/lib/index.ts` for convenience

**New Query or Type:**
1. Add to `src/lib/appwrite.ts` (shared SDK queries)
2. Or add to `src/lib/server/appwrite.ts` (admin/session-specific)
3. Define TypeScript interface at top of file

**New Test:**
1. Colocate with feature: `src/routes/[path].test.ts`
2. Or organize in `tests/` by suite (e2e, integration, unit)
3. Follow AAA pattern (Arrange, Act, Assert)

## Special Directories

**src/paraglide/ (Auto-generated):**
- Purpose: Inlang i18n output; locale JSON files and runtime
- Generated: Yes (via `inlang build`)
- Committed: No (generated, excluded from .gitignore)
- Do NOT edit manually

**src/lib/paraglide/ (Auto-generated):**
- Purpose: Inlang runtime for Svelte
- Generated: Yes (via `inlang build`)
- Committed: No (generated)
- Do NOT edit manually

**build/, .svelte-kit/:**
- Purpose: SvelteKit build output and generated types
- Generated: Yes (via `npm run build`)
- Committed: No (node_modules-style, excluded from .gitignore)
- Contents: Compiled routes, type definitions, adapter output

**tests/:**
- Purpose: All test files (e2e, integration, unit)
- Organization: By test type (e2e/, phase*/, atdd/, mocks/)
- Key files: Fixtures (factories/), mocks/appwrite.ts, playwright.config.ts

---

*Structure analysis: 2026-04-26*
