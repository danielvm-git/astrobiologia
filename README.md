<!-- generated-by: gsd-doc-writer -->

# Astrobiologia.com.br

A professional journalistic portal covering astrobiology, maintained by Danilo Albergaria. This project focuses on news, interviews, and Brazilian research regarding life in the universe.

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Current Status

**Phase 2: Administrative CMS (Articles CRUD)** - Currently implementing and polishing the content management system and article workflows.

## Tech Stack

- **Frontend**: [Astro](https://astro.build/) with React islands
- **Backend**: [Appwrite Cloud](https://appwrite.io/) (Auth, Database, Storage)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Internationalization**: Built-in locale system (pt-br, en, es, nl, ja, zh)
- **Package Manager**: [pnpm](https://pnpm.io/)

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/daniloalbergaria/astrobiologia.git
   cd astrobiologia
   ```

2. **Install dependencies**:

   ```bash
   pnpm install --frozen-lockfile
   ```

3. **Configure Environment Variables**:
   Copy the example environment file and fill in your Appwrite Cloud credentials:
   ```bash
   cp .env.example .env
   ```
   _Note: You will need an Appwrite Cloud project, database, and collection IDs as specified in `.env.example`._

## Quick Start

1. **Run the development server**:

   ```bash
   pnpm dev
   ```

2. **Open the application**:
   Navigate to `http://localhost:4321` in your browser.

3. **Access Admin Panel**:
   Go to `/admin/login` to access the CMS (requires valid Appwrite credentials).

## Project Structure

- `apps/web-astro/`: Main Astro application
  - `src/routes/`: Astro routes including public portal and admin CMS
  - `src/lib/`: Shared utilities (Appwrite client, locale helpers, article logic)
  - `src/components/`: React island components (ArticleCard, SearchBox, etc.)
  - `src/components/admin/`: Admin panel components (Dashboard, ArticleEditor, etc.)
  - `src/pages/api/`: API routes for auth, articles, settings, upload
  - `src/middleware/index.ts`: Request middleware (locale detection, auth redirects)
- `messages/`: Translation files for i18n

## Testing

### Test Suite Overview

The project uses a two-tier testing strategy:

| Tier          | Tool                | Scope                                          | Count                                |
| ------------- | ------------------- | ---------------------------------------------- | ------------------------------------ |
| Unit tests    | Vitest              | Pure functions, utilities, business logic      | 49 tests across 4 files              |
| E2E/BDD tests | Playwright + BDDGen | User flows, page interactions, admin workflows | 27 scenarios across 10 feature files |

### Running Tests

#### Unit Tests

```bash
# Run all unit tests
cd apps/web-astro && pnpm run test:unit

# Run with coverage report
pnpm run test:coverage

# Watch mode (development)
pnpm run test:unit:watch
```

#### Type Check

```bash
# TypeScript type check (no emit)
pnpm run check

# Astro diagnostics
pnpm run check:astro
```

#### E2E Tests

```bash
# Run all E2E tests (requires Appwrite credentials)
cd apps/web-astro && pnpm run test:e2e

# Run P0 (critical path) tests only
pnpm run test:e2e:p0

# Run with Playwright UI
pnpm run test:ui
```

### Coverage Requirements

Coverage thresholds are enforced in CI. Builds fail if any metric falls below its threshold:

| Metric     | Threshold | Current |
| ---------- | --------- | ------- |
| Statements | >= 8%     | 8.63%   |
| Branches   | >= 45%    | 79.1%   |
| Functions  | >= 25%    | 61.7%   |

View the full coverage report after running `pnpm run test:coverage`:

```bash
open apps/web-astro/coverage/index.html
```

### Test Organization

**Unit tests** (`src/lib/__tests__/`):

- `locale.test.ts` -- Locale tag normalization and matching (16 tests)
- `article-locales.test.ts` -- Article locale label resolution (8 tests)
- `article-read.test.ts` -- Translation selection logic (12 tests)
- `appwrite.test.ts` -- Appwrite client helpers, env vars, session cookies (13 tests)

**Test fixtures** (`tests/fixtures/`):

- `articles.ts` -- Factory functions for Article and ArticleTranslation test data
- `users.ts` -- Factory functions for User test data (admin, editor, reader roles)

**BDD features** (`tests/features/`):

- `homepage.feature` -- Homepage loading, empty states
- `articles.feature` -- Article reading, navigation, empty states
- `search.feature` -- Search with results, no results, empty query
- `categories.feature` -- Category browsing, non-existent categories
- `admin/auth.feature` -- Login with valid/invalid credentials
- `admin/dashboard.feature` -- Dashboard stats, quick actions, auth redirects
- `admin/editor.feature` -- Article creation, validation, editing
- `admin/settings.feature` -- Theme persistence, password change, metadata
- `admin/translation.feature` -- DeepL translation, validation, duplicates
- `bugs.feature` -- Regression tests for fixed bugs

### Writing New Tests

#### Unit Test Guidelines

- Place test files in `src/lib/__tests__/` alongside the code they test
- Use the naming convention `<module>.test.ts`
- Follow AAA pattern (Arrange, Act, Assert)
- Use fixture factories from `tests/fixtures/` for test data
- Keep tests focused: one assertion per test case when possible
- Mock external dependencies (Appwrite SDK) using `vi.mock()` or `vi.spyOn()`

#### BDD Feature Guidelines

- Place feature files in `tests/features/` (use `tests/features/admin/` for admin features)
- Tag scenarios with priority: `@p0` (critical path), `@p1` (important), `@wip` (work in progress)
- Tag with `@smoke` for smoke test candidates
- Use `@admin` tag for scenarios requiring authentication
- Keep scenarios independent -- each should set up its own preconditions

### CI Quality Gates

Every PR and push to main runs the following gates:

| Gate    | Description                               |
| ------- | ----------------------------------------- |
| G.1     | All unit tests must pass                  |
| G.2     | P0 E2E tests must pass (Chromium)         |
| G.3     | TypeScript type check must pass           |
| G.4     | Test suite must complete within 5 minutes |
| G.7     | CI runs on every PR                       |
| G.8     | CI fails on any failing test              |
| S.1-S.4 | Coverage thresholds enforced              |

### Quality Expectations

- All new functions must have at least one unit test
- All bug fixes must include a regression test
- All new user-facing features must include BDD scenarios
- Tests must pass locally before pushing
- Coverage must meet or exceed thresholds
- Type check must pass with zero errors

## Deployment

The project is optimized for deployment on **Appwrite Sites**. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## License

This project is licensed under the MIT License.
