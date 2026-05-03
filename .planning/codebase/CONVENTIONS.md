# Coding Conventions

**Analysis Date:** 2026-04-26

## Naming Patterns

**Files:**
- `camelCase` for TypeScript/JavaScript utility files: `src/lib/appwrite.ts`, `src/lib/utils.ts`
- `PascalCase.svelte` for Svelte components: `ArticleCard.svelte`, `Header.svelte`, `ArticleEditor.svelte`
- `+page.svelte`, `+page.server.ts`, `+layout.server.ts` for SvelteKit routes (mandatory convention)
- `*.test.ts`, `*.spec.ts` for test files: `login_action.test.ts`, `appwrite_crud.test.ts`
- `snake_case.js` for utility scripts: `populate_db.js`, `wipe_db.js`

**Functions:**
- `camelCase` for all function names: `getCurrentUser()`, `createArticle()`, `formatDate()`
- `create*` prefix for factory/builder functions: `createArticle()`, `createArticleTranslation()`, `createFullArticle()`
- `get*` prefix for retrieval/data fetching: `getCurrentUser()`, `getImageUrl()`, `getArticleBySlug()`
- `is*`, `should*` prefix for boolean checks/predicates: `isLoggedIn`, `isLoading`, `shouldShowTranslationFallbackBadge()`
- Descriptive, multi-word names over abbreviations: `formatShortDate()` not `formatSDt()`

**Variables:**
- `camelCase` for all local and exported variables: `authStore`, `mockSession`, `articleId`
- Const/state names clearly indicate intent: `initialState`, `mockClient`, `SESSION_COOKIE`
- Underscore prefix reserved for internal/private patterns (rarely used): instead prefer scoping to modules

**Types & Interfaces:**
- `PascalCase` for interfaces: `AuthState`, `Article`, `ArticleTranslation`, `Category`, `User`, `SEOMetaTags`
- `PascalCase` for type aliases: `AppwriteSessionSecretFields`
- Suffix with `State` for store/reactive state types: `AuthState`
- Import interfaces at top with other types: alphabetically sorted with domain types

**Stores:**
- Suffix with `Store`: `authStore` — lowercase variable holding store instance
- Export store functions alongside store: `authStore.setUser()`, `authStore.clearUser()`

## Code Style

**Formatting:**
- Tool: Prettier 3.8.3
- Indentation: 2 spaces (no tabs)
- Line width: 80 characters
- Semicolons: Required on all statements
- Quotes: Double quotes `"` (not single)
- Trailing commas: ES5 style (comma in arrays/objects, not after last function param)
- Arrow functions: Always use parentheses around params: `(x) => x + 1` not `x => x + 1`

**Svelte-Specific:**
- Parser override: `prettier-plugin-svelte` enabled
- Svelte files use Svelte parser, TypeScript uses default

**TypeScript Compiler Options:**
- Strict mode: `enabled` (`"strict": true`)
- Check JS: `enabled` (catch errors in .js files)
- Module resolution: `bundler` (modern ES modules)
- Resolve JSON module: `enabled`
- Force consistent casing: `enabled`
- Skip lib check: `enabled` (faster builds, external types trusted)
- Source maps: `enabled` (debugging)

## Import Organization

**Order:**
1. External libraries (alphabetically): `import { ID, Query, OAuthProvider } from "appwrite";`
2. SvelteKit/Vite imports: `import { page } from "$app/state";`
3. Internal lib imports (aliased paths): `import { authStore } from "$lib/stores/auth";`
4. Component imports: `import Header from "$lib/components/Header.svelte";`
5. Type-only imports at end: `import type { PageServerLoad } from "./$types";`

**Path Aliases:**
- `$lib` → `./src/lib` (all shared utilities, stores, data)
- `$components` → `./src/lib/components` (all Svelte components)
- `$env/dynamic/public` → public runtime env vars
- `$env/dynamic/private` → private server-only env vars
- `$app/state` → SvelteKit app state
- `$app/environment` → environment flags (browser, dev, building)

**Alphabetical Sorting:**
- Multiple imports from same module: sorted alphabetically
- Multiple path imports: grouped by type, then alphabetically within group

Example from `src/lib/appwrite.ts`:
```typescript
import { ID, Query, OAuthProvider } from "appwrite";
import {
  account,
  databases,
  storage,
  DATABASE_ID,
  COLLECTIONS,
  STORAGE_BUCKET_ID,
} from "./appwrite-datasets";
```

## Error Handling

**Patterns:**
- Try-catch blocks wrap Appwrite/external service calls
- Return null on expected failures: `catch { return null; }`
- Throw descriptive errors for unexpected failures: `throw new Error(err.error || "Upload failed")`
- Server routes use SvelteKit's `error()` and `redirect()` helpers
- Form actions use `fail()` for validation errors: `fail(400, { message: "..." })`

**Logging:**
- Use `createLogger()` helper for structured logging: `const logger = createLogger('MODULE-NAME');`
- Log level `debug` for tracing, `info` for normal operation, `error` for failures
- Module-scoped logger prevents global pollution: one logger per file/module

## Validation

**Type Guards:**
- TypeScript strict mode catches most type errors at compile time
- Runtime validation via Zod schema preferred for external data (user input, API responses)
- Optional chaining and nullish coalescing used defensively: `article?.translation?.title ?? article?.title`

**CSS/Styling:**
- Tailwind CSS 4 with utility-first approach
- No custom CSS—only Tailwind utilities and component library
- `clsx()` + `tailwind-merge()` via `cn()` utility for conditional classes
- Example: `cn("px-4 py-2", variant === "featured" && "bg-accent")`

## Comments

**When to Comment:**
- Documented regression tests explaining the bug and fix: `Guards against: issue#...`
- Non-obvious business logic requiring domain knowledge
- Complex algorithm explanation
- Disable rule justifications

**JSDoc/TSDoc:**
- Public functions exported from `src/lib/` have JSDoc blocks
- Example:
```typescript
/**
 * Creates an Appwrite client with admin privileges using the API Key.
 * Use this for administrative tasks that don't depend on a user session.
 */
export function createAdminClient() { ... }
```
- Internal utility functions typically omit JSDoc

## Function Design

**Size:** Target ≤ 20 lines; most utility functions 4–10 lines

**Parameters:**
- Single object parameter for complex functions: `createArticle(data: Omit<Article, ...>)`
- Positional args for simple 1–2 parameter functions: `formatDate(date, locale)`
- Rest parameters for variadic functions: `cn(...inputs: ClassValue[])`

**Return Values:**
- Explicit return type annotations on exported functions
- Promise-based for all async: `async function login(...): Promise<User>`
- Single responsibility: function does one thing (fetch, transform, validate)

## Module Design

**Exports:**
- Named exports for utilities: `export function createArticle(...)`
- Default export for Svelte components: `export default Svelte_component`
- Barrel exports from `src/lib/index.ts` for public API discovery
- Types exported alongside implementations

**Barrel Files:**
- `src/lib/appwrite.ts` re-exports both types and functions from submodules
- Pattern: `export { X, Y } from "./submodule"`

**File Organization:**
- One concern per file (Single Responsibility)
- Utilities grouped by domain: `src/lib/server/`, `src/lib/auth/`, `src/lib/stores/`
- Tests co-located with implementation or grouped in `tests/` by phase

## TypeScript Conventions

**Any Type:**
- Avoid `any` unless casting from external library: `return user as User;`
- Use `unknown` for untyped external data, then narrow: `const data = await response.json(); const typedData = data as Article;`

**Type Assertions:**
- Minimal casting—prefer type inference
- Document why cast is needed: `// Legacy support during migration` before casting

**Interfaces vs Types:**
- `interface` for object contracts (components, API shapes, state)
- `type` for unions, tuples, aliases: `type AppwriteSessionSecretFields = { ... }`

---

*Convention analysis: 2026-04-26*
