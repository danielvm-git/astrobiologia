# Technology Stack

**Analysis Date:** 2026-04-26

## Overview

Astrobiologia.com.br is a monorepo hosting two parallel web applications (SvelteKit and Nuxt 3), both targeting Appwrite Cloud as the backend. The SvelteKit app is the primary active implementation; the Nuxt app is under development.

## Languages

**Primary:**
- TypeScript 5.7.3 - Browser (client-side) and server-side code
- Svelte 5.33.0 - UI components (SvelteKit app)
- Vue 3.5.32 - UI components (Nuxt app)

**Secondary:**
- JavaScript (for config files)
- HTML/CSS (via Tailwind CSS 4.1.8)

## Runtime

**Environment:**
- Node.js ≥ 20.0.0 (per package.json engines)

**Package Manager:**
- pnpm (monorepo workspaces)
- Lockfile: pnpm-lock.yaml (present)

## Frameworks & Core Libraries

### SvelteKit App (`apps/web-svelte`)

**Frontend Framework:**
- SvelteKit 2.57.1 - Meta-framework for Svelte 5
- Svelte 5.33.0 - Reactive component framework with runes (`$state`, `$derived`)
- Vite 6.3.3 - Build tool and dev server

**Adapter:**
- @sveltejs/adapter-node 5.5.4 - Deploy to Node.js servers (Appwrite Sites compatible)

**Styling:**
- Tailwind CSS 4.1.8 - Utility-first CSS framework
- @tailwindcss/vite 4.1.8 - Vite integration for Tailwind
- @tailwindcss/typography 0.5.16 - Prose plugin for article content

**i18n & Localization:**
- @inlang/paraglide-js 2.15.2 - Compile-time i18n with URL/cookie/baseLocale strategies
- Compiles to `src/lib/paraglide/` at build time

**Rich Text Editor:**
- TipTap 3.22.4 - Headless WYSIWYG editor
  - @tiptap/core, @tiptap/starter-kit, @tiptap/extension-{image,link,placeholder}
  - @tiptap/pm - ProseMirror integration
- svelte-tiptap 3.0.1 - Svelte component binding for TipTap
- lucide-svelte 0.503.0 - Icon library

**Utilities:**
- clsx 2.1.1 - Conditional className builder
- tailwind-merge 3.3.1 - Merge Tailwind class conflicts

### Nuxt App (`apps/web-nuxt`)

**Framework:**
- Nuxt 3.21.2 - Meta-framework for Vue 3
- Vue 3.5.32 - Reactive component framework
- Vue Router 5.0.4 - Routing

**i18n:**
- @nuxtjs/i18n 10.3.0 - Nuxt integration for i18n

**UI Library:**
- shadcn-vue 2.6.2 - Vue port of shadcn/ui
- reka-ui 2.9.6 - Unstyled, accessible UI components
- Tailwind CSS 4.2.4 - Styling

**Utilities:**
- class-variance-authority 0.7.1 - Type-safe CSS class composition
- clsx 2.1.1 - Conditional className builder
- tailwind-merge 3.5.0 - Merge Tailwind conflicts
- tw-animate-css 1.4.0 - CSS animation helpers
- date-fns 4.1.0 - Date manipulation library
- lucide-vue-next 1.0.0 - Icon library

## Testing & Development

### Test Frameworks

**Unit & Integration:**
- Vitest 4.1.4 - Vite-native test runner
  - @vitest/ui 4.1.4 - Browser UI for test results
  - jsdom 29.0.2 - DOM environment for unit tests
- @testing-library/svelte 5.3.1 - Svelte component testing utilities
- @testing-library/jest-dom 6.9.1 - DOM matchers

**E2E Testing:**
- @playwright/test 1.50.0 - Cross-browser E2E testing
- Config: `playwright.config.ts`
- Test dir: `tests/e2e/`
- Runs built app on port 4173 via `vite preview`

### Development Tools

**Linting & Formatting:**
- Prettier 3.8.3 - Code formatter
  - prettier-plugin-svelte 3.5.1 - Svelte support
- Husky 9.1.7 - Git hooks
- lint-staged 16.4.0 - Pre-commit hook runner

**Type Checking:**
- svelte-check 4.2.1 - Svelte type validation
- TypeScript 5.7.3 - Language & compiler

**Code Analysis:**
- @ctxo/lang-typescript 0.7.1 - Context-aware code analysis (dependency tracking)

## Backend SDKs

### Appwrite SDKs (Dual Client/Server Pattern)

**Browser/Client SDK:**
- appwrite 17.0.0 (SvelteKit) / 24.2.0 (Nuxt) - Client-side SDK
  - Used in `src/lib/appwrite-datasets.ts` (SvelteKit)
  - Provides: Account, Databases, Storage
  - API: positional args — `createEmailPasswordSession(email, password)`, `createOAuth2Token(OAuthProvider.Google, successUrl, failureUrl)`

**Server/SSR SDK:**
- node-appwrite 24.0.0 - Server-side SDK (SSR)
  - Used in `src/lib/server/appwrite.ts` (SvelteKit)
  - Used in `server/utils/appwrite.ts` (Nuxt)
  - API: named params — `createEmailPasswordSession({ email, password })`, `createSession({ userId, secret })`
  - Provides: Account, Databases, Storage with admin privileges

**Why Dual SDKs:**
- Client SDK (appwrite 17.0.0) does NOT have session callback support
- Server SDK (node-appwrite 24.0.0) is required for OAuth session creation on callback route (`/oauth`)
- Versions differ because client SDK is pinned to 17.0.0 for OAuth browser flow compatibility

### Third-Party Services

**Translation API:**
- DeepL API (optional) - Server-side REST API integration
  - Endpoint: `https://api.deepl.com/v2/translate` (paid) or `https://api-free.deepl.com/v2/translate` (free tier)
  - Config: `DEEPL_API_KEY` env var (detected at runtime)
  - Used by: `/api/translate` endpoint (admin-only)
  - Implementation: `src/lib/server/deepl.ts`

## Configuration

### Environment Variables

**Public (exposed to browser):**
- `PUBLIC_APPWRITE_ENDPOINT` - Appwrite API endpoint (default: `https://cloud.appwrite.io/v1`)
- `PUBLIC_APPWRITE_PROJECT_ID` - Appwrite project ID
- `PUBLIC_DATABASE_ID` - Database UUID
- `PUBLIC_ARTICLES_COLLECTION_ID` - Articles collection ID
- `PUBLIC_ARTICLES_TRANSLATIONS_COLLECTION_ID` - Translations collection ID
- `PUBLIC_CATEGORIES_COLLECTION_ID` - Categories collection ID
- `PUBLIC_STORAGE_BUCKET_ID` - File storage bucket ID
- `PUBLIC_ORIGIN` - Optional canonical URL for secure cookies behind proxies (set on Appwrite Sites)

**Secret (server-side only):**
- `APPWRITE_API_KEY` - Admin API key for server operations
- `DEEPL_API_KEY` - Optional DeepL translation API key (with `:fx` suffix for free tier)

**Testing:**
- `BASE_URL` - Test app URL (default: `http://localhost:4173`)
- `TEST_USER_EMAIL` - Admin test account email
- `TEST_USER_PASSWORD` - Admin test account password

### Build Configuration

**SvelteKit:**
- `svelte.config.js` - SvelteKit adapter (Node.js), prerendering, path aliases
- `vite.config.ts` - Vite config with Tailwind, SvelteKit, Paraglide plugins
- `tsconfig.json` - TypeScript compiler options
- `playwright.config.ts` - E2E test runner config

**Nuxt:**
- `nuxt.config.ts` or `nuxt.confing.js` - Nuxt config (runtime config, modules)
- Tailwind CSS 4.2.4 configured via Nuxt integration

## API Structure

### REST Endpoints (SvelteKit)

**Authentication:**
- `POST /api/login` - Email/password login (server action)
- `POST /admin/login` - HTML form login (server action)
- `GET /oauth` - OAuth callback handler (exchanges `userId`/`secret` for session)
- `POST /admin/logout` - Logout (server action)

**Content Management:**
- `POST /api/upload` - File upload (authenticated, returns fileId)
- `POST /api/translate` - Text translation via DeepL (admin-only)

**Public Content:**
- `GET /artigos` - List published articles
- `GET /artigos/[slug]` - Single article view
- `GET /categorias/[category]` - Articles by category
- `GET /busca` - Search articles
- `GET /sitemap.xml` - XML sitemap
- `GET /robots.txt` - Robots exclusion file

**Health & Status:**
- `GET /api/health` - Health check endpoint

## Deployment Target

**Hosting:**
- Appwrite Sites - Deploys SvelteKit Node.js adapter output
- Static prerendering enabled for public pages

**Build Output:**
- `npm run build` produces Vite + SvelteKit build artifacts
- `npm run preview` runs built app on port 4173 for testing

## Key Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| appwrite | 17.0.0 (SvelteKit) | Browser OAuth & data access |
| node-appwrite | 24.0.0 | Server-side admin operations |
| svelte | 5.33.0 | UI framework (SvelteKit) |
| sveltekit | 2.57.1 | Meta-framework |
| tailwindcss | 4.1.8 / 4.2.4 | CSS utility framework |
| @inlang/paraglide-js | 2.15.2 | Compile-time i18n |
| @tiptap/* | 3.22.4 | WYSIWYG editor |
| vitest | 4.1.4 | Unit test runner |
| playwright | 1.50.0 | E2E tests |
| typescript | 5.7.3 | Type system |

---

*Stack analysis: 2026-04-26*
