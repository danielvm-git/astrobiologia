# Astrobiologia Testing Architecture

This project uses a hybrid testing strategy with Vitest for unit/integration logic and Playwright for End-to-End (E2E) UI flows.

## 🧪 Test Levels

### 1. Unit & Integration (Vitest)

- **Location**: `tests/phase*/*.test.ts` and `tests/atdd/*.test.ts`
- **Scope**: Appwrite helpers, SSR Auth Hooks, Business Logic.
- **Run**: `npm run test` or `npm run test:api`
- **Mocking**: Centralized Appwrite mocks in `tests/mocks/appwrite.ts`.

### 2. End-to-End (Playwright)

- **Hands-on checklist**: [`tests/e2e/P0-GUIDE.md`](./e2e/P0-GUIDE.md)
- **Location**: `tests/e2e/**/*.spec.ts` — **P0** gate in `tests/e2e/p0/` (CI); **P1+** under `tests/e2e/p1/` etc.
- **Scope**: User journeys, Admin UI flows.
- **Run**: `npm run test:e2e` (full suite) · **PR gate**: `npm run test:e2e:p0` (P0 + Chromium only)
- **Setup**: Requires `npx playwright install` after `npm install`.

## Environment contract (one Appwrite project)

To keep **one** Appwrite project and still avoid trashing production data in automation:

- **Database & resources** are selected with public env vars in `src/lib/appwrite.ts` (`PUBLIC_DATABASE_ID`, `PUBLIC_*_COLLECTION_ID`, `PUBLIC_STORAGE_BUCKET_ID`). Defaults match your current collection and bucket **names/ids**; override in **CI env** or a local **`.env.test`**-style file (load with your shell or SvelteKit’s normal env flow) to point at **parallel** collections or a second bucket you create in the same project.
- **Server key** stays in `APPWRITE_API_KEY` (never public). E2E/CI that need a real session should use a **dedicated test user** and the same isolation as above.
- See **`.env.example`** for the full list and short comments.

## 🏗️ Infrastructure

### Data Factories

Located in `tests/factories/`, these allow generating consistent test data:

- `article.factory.ts`: Generate Article and Translation objects.

### Fixtures

Located in `tests/support/fixtures/`:

- `auth.fixture.ts`: Shared authentication logic for E2E tests.

### Shared Mocks

Located in `tests/mocks/`:

- `appwrite.ts`: Standardized mocks for Appwrite Client, Account, Databases, and Storage.

## 🛠️ Best Practices

- **Isolation**: Use `beforeEach` to clear mocks and reset state.
- **Selectors**: Prefer `data-testid` or user-facing selectors (Role, Placeholder).
- **Factories**: Always use factories for complex objects to ensure type safety.

## 🚀 CI Integration

GitHub Actions runs **Svelte check**, **Vitest**, and **Playwright P0** on each PR. E2E uses Playwright’s `webServer` (build + preview) and can be pointed at isolated `PUBLIC_*` values via repository **Environment** or **Variables** when you are ready.
