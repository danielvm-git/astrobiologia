# Testing Patterns

**Analysis Date:** 2026-04-26

## Test Framework

**Unit & Integration Tests:**
- Runner: Vitest 4.1.4
- Config: `apps/web-svelte/vite.config.ts`
- Command: `npm run test` (run once), `npm run test:watch` (watch mode), `npm run test:ui` (dashboard)
- Coverage: No enforced threshold; available but not gated
- Environment: jsdom (DOM simulation for browser testing)

**E2E Tests:**
- Runner: Playwright 1.50.0
- Config: `apps/web-svelte/playwright.config.ts`
- Command: `npm run test:e2e` (all), `npm run test:e2e:p0` (priority 0 only)
- Timeout: 60 seconds per test, 5 seconds per expect() assertion
- Retry: 0 retries locally, 2 retries on CI
- Parallelization: Unlimited workers locally, 1 worker on CI
- Browsers: Chromium (default), Firefox, WebKit
- BaseURL: http://localhost:4173 (preview server)
- Screenshots/Videos: Retained on failure

**Assertion Library:**
- Vitest: Built-in (`expect()`)
- Testing Library: `@testing-library/svelte` (component testing)
- Jest DOM: `@testing-library/jest-dom` (DOM matchers)

## Test File Organization

**Location:**
- Unit tests: `tests/` directory, co-located by domain/phase
- Alternative: `.test.ts` files adjacent to implementation (not currently used)
- Playwright E2E: `tests/e2e/` with subdirectories by phase/priority

**Naming:**
- Vitest unit: `src/**/*.test.{js,ts}` or `tests/**/*.test.{js,ts}`
- Pattern: `[feature].test.ts` or `[feature]_[scenario].test.ts`
- Examples: `login_action.test.ts`, `appwrite_crud.test.ts`, `auth_guard.test.ts`

**Structure:**
```
tests/
├── phase1/                 # Phase 1 specific tests
│   ├── appwrite.test.ts
│   └── health.test.ts
├── phase2/                 # Phase 2 specific tests
│   ├── login_action.test.ts
│   ├── oauth_callback.test.ts
│   ├── editor_logic.test.ts
│   ├── appwrite_crud.test.ts
│   ├── request-language.test.ts
│   ├── public-origin.test.ts
│   └── auth_guard.test.ts
├── integration/            # Cross-system integration
│   └── admin_save_regression.test.ts
├── e2e/                    # Playwright end-to-end
│   ├── p0/                 # Priority 0 (critical path)
│   │   ├── admin-login.spec.ts
│   │   ├── article-not-found.spec.ts
│   │   ├── busca.spec.ts
│   │   └── public-home.spec.ts
│   ├── p1/                 # Priority 1 (important features)
│   │   ├── invalid-login.spec.ts
│   │   └── localization.spec.ts
│   └── P0-GUIDE.md
├── factories/              # Test data builders
│   └── article.factory.ts
├── mocks/                  # Centralized mocks
│   └── appwrite.ts
├── support/                # Test helpers
│   └── fixtures/
│       └── auth.fixture.ts
├── lib/                    # Utility function tests
│   └── i18n/
│       └── locale-tag.test.ts
├── atdd/                   # Acceptance test data
│   ├── fixtures.ts
│   └── hooks-auth.test.ts
├── phase5/                 # Phase 5 tests (i18n)
│   └── i18n.test.ts
├── phase6/                 # Phase 6 tests (SEO)
│   └── seo_search.test.ts
└── README.md
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('login server action', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('[P0] sets SESSION_COOKIE with session.secret before redirecting', async () => {
		// Arrange
		const event = makeEvent('admin@astrobiologia.com', 'valid-password');

		// Act
		try {
			await actions.login(event as any);
		} catch (err: any) {
			// Assert
			expect(event.cookiesSet).toHaveBeenCalledWith(...);
		}
	});

	it('[P1] returns fail(400) when email is missing', async () => {
		// Arrange
		const event = makeEvent('', 'some-password');
		
		// Act
		const result = await actions.login(event as any);
		
		// Assert
		expect(result).toBeDefined();
	});
});
```

**Patterns:**
- Arrange-Act-Assert (AAA) per test visible as comments
- Test names prefixed with priority: `[P0]` (critical), `[P1]` (important), `[P2+]` (nice-to-have)
- One logical assertion group per test; multiple asserts within same concept OK
- Test guards against regression: docstring explains the bug being prevented
- BeforeEach clears mocks: `vi.clearAllMocks()`

## Mocking

**Framework:** Vitest `vi` (drop-in Vitest mock replacement)

**Pattern:**
```typescript
// Mock a module at top level
vi.mock('$lib/appwrite', () => ({
	databases: {
		listDocuments: vi.fn().mockResolvedValue({ documents: [] })
	},
	DATABASE_ID: 'test-db'
}));

// Override a specific mock in a test
vi.mocked(createAdminClient).mockReturnValueOnce({
	account: { createEmailPasswordSession: vi.fn().mockRejectedValue(...) }
});
```

**Centralized Mocks:**
- `tests/mocks/appwrite.ts` exports reusable mock implementations
- Example: `mockAccount`, `mockDatabases`, `mockStorage`, `appwriteMockImplementation`
- Allows consistent mocking across multiple test files

**What to Mock:**
- External APIs (Appwrite, DeepL, third-party services)
- Browser APIs (window, document, fetch) on server-side tests
- SvelteKit helpers (`@sveltejs/kit` redirect/fail/error)
- Environment variables (`$env/dynamic/public`, `$env/dynamic/private`)

**What NOT to Mock:**
- Utility functions (formatting, validation, calculation)
- Core business logic (unless integration test)
- Helper libraries (unless testing error handling of the library)

**Mock Scope:**
- Vitest mocks auto-cleared between tests with `beforeEach(() => vi.clearAllMocks())`
- Module-level mocks reset globally; ensure independence

## Fixtures and Factories

**Test Data Builders:**
- Location: `tests/factories/article.factory.ts`
- Pattern: `create*` function returning typed test object with overrides
- Example:
```typescript
export const createArticle = (overrides: Partial<Article> = {}): Article => ({
    $id: 'article_' + Math.random().toString(36).substr(2, 9),
    $createdAt: new Date().toISOString(),
    category: 'noticias',
    status: 'published',
    ...overrides
});

export const createFullArticle = (language = 'pt-br', overrides: Partial<Article> = {}): Article => {
    const article = createArticle(overrides);
    const translation = createArticleTranslation(article.$id, language);
    return { ...article, translation };
};
```

**Playwright Fixtures:**
- Location: `tests/support/fixtures/auth.fixture.ts`
- Pattern: Custom `test` extending base Playwright test with authenticated context
- Example:
```typescript
type AuthFixtures = { adminPage: any };

export const test = base.extend<AuthFixtures>({
    adminPage: async ({ page }, use) => {
        await page.goto('/admin/login');
        await use(page);
    }
});
```

## Coverage

**Requirements:**
- No enforced coverage threshold
- Coverage available via `npm run test -- --coverage` (if enabled)
- Priority: Critical paths (auth, article CRUD) have tests; untested areas documented

**Test Coverage Gaps:**
- Svelte component integration tests minimal (prefer Playwright E2E)
- Some utility functions tested implicitly through integration tests
- Performance tests: not yet implemented

## Test Types

**Unit Tests:**
- Scope: Single function or utility in isolation
- Approach: Mock all dependencies; test function's contract
- Examples: `tests/lib/i18n/locale-tag.test.ts`, `tests/phase2/auth_guard.test.ts`

**Integration Tests:**
- Scope: Multiple components working together (server action + database + auth)
- Approach: Mock external services (Appwrite), test full flow
- Examples: `tests/phase2/appwrite_crud.test.ts`, `tests/integration/admin_save_regression.test.ts`
- Location: `tests/phase*/` or `tests/integration/`

**Acceptance Tests (ATDD):**
- Scope: Full feature validation against requirements
- Approach: Real data flows, mocked third-party APIs
- Location: `tests/atdd/` (acceptance test-driven development)
- Example: `tests/atdd/hooks-auth.test.ts` validates auth lifecycle

**E2E Tests:**
- Scope: Full user journey through browser
- Approach: No mocks; real application running
- Browsers: Chrome, Firefox, Safari
- Examples: `tests/e2e/p0/admin-login.spec.ts`, `tests/e2e/p0/public-home.spec.ts`
- Phase-based organization: `p0/` (critical), `p1/` (important)

## Common Patterns

**Async Testing:**
```typescript
it('should fetch article', async () => {
	const result = await fetchArticle('123');
	expect(result.title).toBe('Expected Title');
});
```

**Error Testing:**
```typescript
it('should return null on fetch failure', async () => {
	const result = await getCurrentUser();
	expect(result).toBeNull();
});

// Or with rejection:
await expect(actions.login(event)).rejects.toMatchObject({
	status: 401,
	message: 'Invalid credentials'
});
```

**Spy & Mock Override:**
```typescript
const { createAdminClient } = await import('$lib/server/appwrite');
vi.mocked(createAdminClient).mockReturnValueOnce({
	account: {
		createEmailPasswordSession: vi.fn().mockRejectedValue(new Error('...'))
	}
});
```

**Setting Up Test Helpers:**
```typescript
function makeEvent(email: string, password: string, protocol = 'http:') {
	const formData = new FormData();
	formData.set('email', email);
	formData.set('password', password);

	return {
		request: { formData: async () => formData } as any,
		cookies: { set: vi.fn(), get: vi.fn() } as any,
		url: { protocol } as any
	};
}
```

## Test Setup

**Global Setup:**
- File: `src/test-setup.ts`
- Configured in Vite: `setupFiles: ['./src/test-setup.ts']`
- Mocks:
  - SvelteKit environment variables (`$env/static/public`, `$env/dynamic/public`, `$env/dynamic/private`)
  - App environment (`$app/environment`)
  - Appwrite SDK (`appwrite`, `node-appwrite`) via `appwriteMockImplementation`
  - Testing Library (`@testing-library/jest-dom`)
- Lifecycle: `beforeEach(() => vi.clearAllMocks())`

---

*Testing analysis: 2026-04-26*
