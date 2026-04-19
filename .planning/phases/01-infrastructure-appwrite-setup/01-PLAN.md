# Phase 1: Infrastructure & Appwrite Setup - Plan

This phase finalizes the backend configuration and the foundational design system to ensure the portal is ready for content and administration.

## Wave 1: Appwrite Integration & Verification
Establish a robust connection with Appwrite Cloud and ensure environment variables are correctly mapped.

- **Task 1: Environment Variable Audit [type: execute]**
  - `<read_first>`: `src/lib/appwrite.ts`, `.env.example`
  - `<action>`: Ensure `.env` contains `PUBLIC_APPWRITE_ENDPOINT`, `PUBLIC_APPWRITE_PROJECT_ID`, `PUBLIC_APPWRITE_DATABASE_ID`, and `APPWRITE_API_KEY`.
  - `<acceptance_criteria>`: `grep` finds all required keys in `.env`.
- **Task 2: Appwrite Client Hardening [type: execute]**
  - `<read_first>`: `src/lib/appwrite.ts`
  - `<action>`: Refine `src/lib/appwrite.ts` to use `$env/static/public` and `$env/static/private` for better type safety and security in SvelteKit.
  - `<acceptance_criteria>`: `src/lib/appwrite.ts` uses `$env/static/public`.

## Wave 2: Schema & Type Alignment
Align the Svelte frontend types with the Appwrite collection schema.

- **Task 3: Article Type Refinement [type: execute]**
  - `<read_first>`: `src/lib/appwrite.ts`, `REQUIREMENTS.md`
  - `<action>`: Ensure the `Article` interface includes all fields from requirements (metaTitle, metaDescription, featuredImageAlt, etc.).
  - `<acceptance_criteria>`: `Article` interface in `src/lib/appwrite.ts` contains `metaTitle` and `metaDescription`.

## Wave 3: Foundational Design & Premium Polish
Implement "New Scientist" inspired design tokens and subtle interactive polish.

- **Task 4: Tailwind 4 Design Tokens [type: execute]**
  - `<read_first>`: `src/app.css`
  - `<action>`: Enhance `@theme inline` in `src/app.css` with a custom "scientific" color palette and fluid typography tokens.
  - `<acceptance_criteria>`: `src/app.css` contains custom `--color-accent` variations.
- **Task 5: Root Layout Polish [type: execute]**
  - `<read_first>`: `src/routes/+layout.svelte`
  - `<action>`: Add a subtle loading bar (SvelteKit navigation) and smooth page transitions to the root layout.
  - `<acceptance_criteria>`: `src/routes/+layout.svelte` imports `navigating` from `$app/stores`.

## Wave 4: Verification
- **Task 6: Infrastructure UAT [type: execute]**
  - `<read_first>`: `src/lib/appwrite.ts`
  - `<action>`: Create a temporary test route `/api/health` to verify Appwrite connection.
  - `<acceptance_criteria>`: `curl http://localhost:5173/api/health` returns status 200 and database connection status.

## Verification Criteria
- [ ] Appwrite client correctly initialized using static environment variables.
- [ ] TypeScript types for Articles and Categories are comprehensive.
- [ ] Global CSS reflects a premium "New Scientist" aesthetic.
- [ ] Health check endpoint confirms connectivity to Appwrite Cloud.

## Must-Haves
- Validated Appwrite connection.
- Svelte 5 runes used for layout state.
- Tailwind 4 design system correctly configured.
