# Astrobiologia Conventions

All agents and contributors must follow these rules.

## Architecture

- **Monorepo** with pnpm workspaces: `apps/web-astro` (primary Astro app), `scripts/` (data loaders)
- **Content layer**: Appwrite Databases (articles, translations, categories, site_settings)
- **Deploy**: Appwrite Sites (primary) + BigBase (secondary/backup)
- **Auth**: Appwrite email/password sessions, cookie-based for admin panel
- **i18n**: 6 locales (pt-br, en, nl, es, ja, zh), DeepL API for machine translation

## Code Quality

### TypeScript

- `strict: true` (extends `astro/tsconfigs/strict`)
- No implicit `any`, no unused locals
- Path alias: `@/*` → `./src/*`

### React Components

- Named exports for components
- `data-testid` on all interactive elements (E2E contract)
- No default prop drilling — use explicit props

### Astro

- `.astro` for pages/layouts, `.tsx` for interactive islands
- Static pre-rendering where possible, SSR for admin routes
- `server:defer` for non-critical interactive components

## Testing

### Unit Tests (Vitest)

- Co-located in `__tests__/` alongside source
- Mock Appwrite at module level (`vi.mock("node-appwrite")`)
- F.I.R.S.T rubric mandatory

### API Integration Tests

- Mock Appwrite via `mock-appwrite.ts` helpers
- Test auth, CRUD, translate endpoints
- Each test imports the endpoint handler dynamically

### E2E Tests (Playwright + playwright-bdd)

- BDD `.feature` files in `tests/features/`
- Step definitions in `tests/steps/`
- Locators: `getByTestId` primary, `getByRole` secondary
- **Never** `page.waitForTimeout()` — use `expect().toBeVisible()` with timeouts
- **Never** `__dirname` in test infra — use `import.meta.url` + `fileURLToPath`
- Tags: `@p0` (CI gate), `@p1` (extended), `@deepl` (external, separate project), `@admin` (auth-required)

## Git & Workflow

### Conventional Commits

- `feat:`, `fix:`, `docs:`, `ci:`, `chore:`, `test:`, `refactor:`
- Scope: `(e2e)`, `(ci)`, `(admin)`, omitted when repo-wide
- Breaking changes: `BREAKING CHANGE:` footer

### Pre-commit Hooks (lint-staged)

1. prettier (format)
2. `pnpm check` (typecheck)
3. `pnpm test:unit` (69 unit tests)

### CI Gates

- Typecheck + unit tests + coverage + API tests
- E2E P0 (Playwright Chromium), gracefully skips when Appwrite paused
- Deploy to BigBase on push to main (skips when secrets unconfigured)

## Security

- No secrets in code — use `.env` (gitignored)
- Appwrite API key in CI via GitHub Secrets
- Cookie attributes: `HttpOnly`, `SameSite=Lax`, `Secure` on HTTPS
- Admin routes protected by session middleware
- DeepL API key never exposed to client

## Project Structure

```
apps/web-astro/
├── src/
│   ├── components/     — React/Astro components
│   ├── lib/            — shared logic, types, appwrite client
│   ├── pages/          — Astro pages + API routes
│   ├── middleware/     — auth middleware
│   └── content/        — Astro content collections (if any)
├── tests/
│   ├── features/       — BDD .feature files
│   ├── steps/          — step definitions
│   ├── fixtures/       — Playwright fixtures
│   └── helpers/        — test utilities
├── playwright.config.ts
├── vitest.config.ts
└── astro.config.mjs
specs/
├── bugs/               — bug registry
├── TEST-REVIEW.md      — test quality review
└── state.yaml          — bigpowers state
```

## Defensive Code Categories

- **Timeout** — All network calls (E2E: max 60s per test, CI jobs: max 60min)
- **Graceful degradation** — Appwrite paused → E2E skips, deploy skips
- **Validation** — All API inputs validated server-side
- **Retry** — CI E2E retries: 2 on failure

## Never

- Never use `any` without explicit justification comment
- Never commit secrets, `.env` files, or coverage output
- Never use `__dirname` in E2E test infrastructure
- Never use `page.waitForTimeout()` in Playwright tests
- Never disable coverage gates to get CI green
- Never push when CI is red
