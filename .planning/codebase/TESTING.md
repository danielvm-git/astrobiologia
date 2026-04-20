# Testing Patterns

**Analysis Date:** 2025-05-15

## Test Framework

**Runner:**
- **Vitest**: Standard for Vite/Svelte projects.
- Config: `vite.config.ts` (contains `test` block).
- Setup: `src/test-setup.ts`.

**Assertion Library:**
- Vitest's `expect` (compatible with Jest).

**UI Testing:**
- **Svelte Testing Library**: For component rendering and interaction tests.
- **JSDOM**: Browser environment for Vitest.

**Run Commands:**
```bash
pnpm test              # Run all tests once
pnpm test:watch        # Continuous watch mode
pnpm test:ui           # Launch Vitest UI
```

## Test Organization

**Location:**
- Logic & Integration: `tests/` directory (categorized by phase/module).
- Unit tests: Can be co-located with `.test.ts` or in `tests/`.

**Structure:**
- `tests/phase1/`: Core infrastructure (Appwrite connection, health).
- `tests/phase2/`: CMS logic (CRUD, Auth guards, Slug generation).
- `tests/phase5/`: i18n logic (Translations, URL localization).

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ModuleName', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should perform a specific action', async () => {
        // Arrange
        const data = { ... };
        // Act
        const result = await myFunction(data);
        // Assert
        expect(result).toBe(expected);
    });
});
```

**Component Test Example:**
```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import MyComponent from './MyComponent.svelte';

it('renders correctly', () => {
    render(MyComponent, { props: { name: 'World' } });
    expect(screen.getByText('Hello World')).toBeInTheDocument();
});
```

## Mocking

**Framework:** Vitest Built-in (`vi`).

**SvelteKit Mocking:**
- Done globally in `src/test-setup.ts` for `$env` and `$app`.
- Use `vi.mock('@sveltejs/kit', ...)` for specific functions like `redirect`.

**Service Mocking (Appwrite):**
- Mock the SDK using `vi.hoisted` and `vi.mock('appwrite', ...)`.
- Pattern found in `tests/phase5/i18n.test.ts`:
  ```typescript
  const mocks = vi.hoisted(() => ({
      mockListDocuments: vi.fn(),
  }));
  vi.mock('appwrite', () => ({
      Databases: vi.fn().mockImplementation(() => ({
          listDocuments: mocks.mockListDocuments
      })),
      // ... other mocks
  }));
  ```

## i18n Testing

**Locale Detection:**
- Mock `locals.paraglide.lang` in server hooks tests.
- Mock `$lib/paraglide/runtime` functions in UI tests.

**Data Flow:**
- Test that correct language tags are passed to `getPublishedArticles(lang)`.
- Verify that translation logic handles missing translations gracefully (e.g., returning null or fallback).

## Coverage

**Requirements:**
- Core business logic (Appwrite interactions) should have 80%+ coverage.
- UI components: Coverage of critical interactive logic (e.g., Article Editor).

**View Coverage:**
- Use `pnpm vitest --coverage` (requires `c8` or `v8` provider).

## Common Patterns

**Async Testing:**
- Use `async/await` in test functions.
- Set reasonable timeouts for network-bound tests.

**Error Testing:**
- Verify `redirect` behavior by catching the thrown `Redirect` error.
- Verify handled Appwrite errors (e.g., `401 Unauthorized`) return expected state.

---

*Testing analysis: 2025-05-15*
