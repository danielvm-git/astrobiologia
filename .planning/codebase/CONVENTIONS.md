# Coding Conventions

**Analysis Date:** 2025-05-15

## Naming Patterns

**Files:**
- **Components:** PascalCase (e.g., `ArticleCard.svelte`, `LanguageSwitcher.svelte`).
- **Routes:** SvelteKit standard (`+page.svelte`, `+layout.svelte`, `+page.server.ts`, `+error.svelte`).
- **Utilities/Logic:** camelCase (e.g., `appwrite.ts`, `utils.ts`, `seo.ts`).
- **Tests:** `.test.ts` suffix (e.g., `appwrite.test.ts`).

**Functions:**
- camelCase, verb-based (e.g., `getPublishedArticles`, `localizeHref`, `toggleMenu`).

**Variables:**
- camelCase (e.g., `currentLang`, `isOpen`, `articles`).
- UPPER_SNAKE_CASE for constants or environment variables.

**Types/Interfaces:**
- PascalCase (e.g., `Article`, `Translation`, `Props`).
- Use `interface` for component props.

## Svelte 5 Patterns

**Runes:**
- **$props:** Always use for component properties. Define an `interface Props` for clarity.
  ```typescript
  interface Props {
      title: string;
      featured?: boolean;
  }
  let { title, featured = false }: Props = $props();
  ```
- **$state:** Use for all local reactive variables. Avoid `let` without runes for reactive data.
- **$derived:** Use for values computed from other state/props.
- **$effect:** Use sparingly for side effects (DOM interactions, logging). Prefer derived state where possible.

**Event Handling:**
- Use standard HTML attributes (e.g., `onclick`, `oninput`, `onsubmit`) instead of `on:click`.
- Use `bubbles` or callbacks for custom events.

**Snippet/Render Tags:**
- Use `{#snippet ...}` for reusable UI blocks within a component.

## Code Style

**Formatting:**
- Handled by Prettier. Standard Svelte plugin.
- Svelte components: `<script>` -> `HTML` -> `<style>`.

**Linting:**
- Handled by `svelte-check` and TypeScript compiler.
- Strict null checks enabled in `tsconfig.json`.

## Import Organization

**Order:**
1. Svelte/SvelteKit built-ins (`$app/*`, `$env/*`).
2. Third-party libraries (`appwrite`, `lucide-svelte`).
3. Local library aliases (`$lib/*`).
4. Relative imports (`../`, `./`).

**Path Aliases:**
- `$lib`: Points to `src/lib`.
- `$app`: SvelteKit runtime.
- `$env`: SvelteKit environment variables.

## i18n Conventions (Paraglide-JS)

**Locale Management:**
- Primary locale: `pt-br`.
- Secondary locale: `en`.
- Use `getLocale()` from `$lib/paraglide/runtime` to detect current language.

**Navigation:**
- Use `localizeHref(path, { locale })` for internal links.
- Use `deLocalizeHref(path)` when checking raw paths.

**Data Fetching:**
- Pass the language code (e.g., `lang`) to backend services.
- Models should handle translations as related documents (Appwrite pattern).

## Error Handling

**Patterns:**
- Use `try/catch` blocks around external service calls (Appwrite).
- Throw `error()` from `@sveltejs/kit` in `load` functions for handled errors.
- Never return `null` across boundaries without clear type indication; prefer empty arrays or typed error objects.

## Logging

**Framework:** `console` (Standard)

**Patterns:**
- `console.error` for caught exceptions in server-side logic.
- Avoid `console.log` in production code; use for development debugging only.

---

*Convention analysis: 2025-05-15*
