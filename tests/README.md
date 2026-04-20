# Astrobiologia Testing Architecture

This project uses a hybrid testing strategy with Vitest for unit/integration logic and Playwright for End-to-End (E2E) UI flows.

## 🧪 Test Levels

### 1. Unit & Integration (Vitest)
- **Location**: `tests/phase*/*.test.ts` and `tests/atdd/*.test.ts`
- **Scope**: Appwrite helpers, SSR Auth Hooks, Business Logic.
- **Run**: `npm run test` or `npm run test:api`
- **Mocking**: Centralized Appwrite mocks in `tests/mocks/appwrite.ts`.

### 2. End-to-End (Playwright)
- **Location**: `tests/e2e/*.spec.ts`
- **Scope**: User journeys, Admin UI flows.
- **Run**: `npm run test:e2e`
- **Setup**: Requires `npx playwright install` after `npm install`.

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
Tests are automatically run in the CI pipeline during the `preflight` check.
E2E tests generate traces and screenshots on failure for easy debugging.
