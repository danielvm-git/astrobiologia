# Astrobiologia

A multilingual astrobiology news platform — professional science journalism covering research on life in the universe, maintained by Danilo Albergaria. Published in 6 languages via DeepL machine translation.

[![CI](https://github.com/danielvm-git/astrobiologia/actions/workflows/ci.yml/badge.svg)](https://github.com/danielvm-git/astrobiologia/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Motivation

Astrobiology research is global but fragmented across language barriers. This platform aggregates and publishes science journalism in Portuguese, English, Spanish, Dutch, Japanese, and Chinese — all from a single admin panel with DeepL-powered translation. Every design decision prioritizes editorial workflows: structured translations, slug management, and publish/draft states.

## Tech stack

| Layer           | Technology                                                       |
| --------------- | ---------------------------------------------------------------- |
| Framework       | [Astro 5](https://astro.build) with React 19 islands             |
| Styling         | [Tailwind CSS 4](https://tailwindcss.com/)                       |
| Backend         | [Appwrite Cloud](https://appwrite.io/) (Auth, Database, Storage) |
| i18n            | Built-in locale system (pt-br, en, es, nl, ja, zh)               |
| Translation     | [DeepL API](https://www.deepl.com/pro-api)                       |
| Testing         | Vitest + Playwright + playwright-bdd                             |
| Package manager | [pnpm](https://pnpm.io/) workspaces                              |
| CI/CD           | GitHub Actions → Appwrite Sites + BigBase                        |

## Features

- **6-language publishing** — write in Portuguese, translate to 5 other languages with one click
- **Admin panel** — full CMS with article editor, translation management, settings, and dashboard
- **Auto-slug generation** — derived from Portuguese title, with per-locale suffixes
- **Category browsing** — articles organized by research category
- **Full-text search** — cross-locale search with result highlighting
- **Dark mode** — persisted theme preference
- **P0 E2E gate** — Playwright BDD tests for critical admin flows

## Installation

```bash
git clone https://github.com/danielvm-git/astrobiologia.git
cd astrobiologia
pnpm install --frozen-lockfile
```

Configure environment (see `.env.test.example` for required vars):

```bash
cp apps/web-astro/.env.test.example apps/web-astro/.env.test
```

## Quick start

```bash
# Development server
pnpm --filter @astrobiologia/web-astro dev    # → http://localhost:4321

# Admin panel
# → http://localhost:4321/admin/login

# Build for production
pnpm --filter @astrobiologia/web-astro build  # → dist/

# Preview production build
pnpm --filter @astrobiologia/web-astro preview
```

## Code Example

```typescript
// src/lib/article-editor-translate.ts — translate an article to any locale
import type { ArticleTranslation } from "./article-editor-types";

export async function buildTranslatedLocaleFields(
  source: ArticleTranslation,
  targetLang: string
): Promise<ArticleTranslation> {
  const fields = [
    "title",
    "excerpt",
    "content",
    "metaTitle",
    "metaDescription",
  ];
  const translations = await Promise.all(
    fields.map((field) =>
      fetch("/api/admin/translate", {
        method: "POST",
        body: JSON.stringify({ text: source[field], targetLang }),
      }).then((r) => r.json())
    )
  );
  return {
    language: targetLang,
    title: translations[0].translated,
    slug: `${source.slug}-${targetLang}`,
    excerpt: translations[1].translated,
    content: translations[2].translated,
    metaTitle: translations[3].translated,
    metaDescription: translations[4].translated,
  };
}
```

## Project structure

```
apps/web-astro/
├── src/
│   ├── components/          — React/Astro UI components
│   │   └── admin/           — Admin panel (Dashboard, ArticleEditor, Settings)
│   ├── lib/                 — shared logic, types, Appwrite client
│   ├── pages/               — Astro pages + API routes
│   │   └── api/admin/       — articles CRUD, translate, settings
│   └── middleware/           — locale detection, auth redirects
├── tests/
│   ├── features/            — BDD .feature files
│   │   └── admin/           — admin-specific scenarios
│   ├── steps/               — step definitions
│   └── helpers/             — E2E utilities, Appwrite test client
├── playwright.config.ts
└── vitest.config.ts
specs/
├── bugs/                    — bug registry
└── TEST-REVIEW.md           — test quality review (92/100)
```

## Tests

```bash
# TypeScript typecheck
pnpm --filter @astrobiologia/web-astro check

# Unit tests (69 tests, 10 files)
pnpm --filter @astrobiologia/web-astro test:unit

# API integration tests (14 tests, 3 files)
pnpm --filter @astrobiologia/web-astro test:api

# Coverage with gates (statements ≥15%, branches ≥50%, functions ≥45%)
pnpm --filter @astrobiologia/web-astro test:coverage

# Preflight (typecheck + unit + api + build)
pnpm preflight

# E2E P0 (Playwright Chromium, requires Appwrite)
pnpm --filter @astrobiologia/web-astro test:e2e:p0
```

### Test architecture

| Tier            | Tool                        | Scope                                     | Tests         |
| --------------- | --------------------------- | ----------------------------------------- | ------------- |
| Unit            | Vitest                      | Pure functions, utilities, business logic | 69            |
| API integration | Vitest                      | Auth, articles CRUD, translate endpoints  | 14            |
| E2E BDD         | Playwright + playwright-bdd | User flows, admin workflows               | ~20 scenarios |

- **Locators**: `getByTestId` primary, `getByRole` secondary. No CSS classes, no `waitForTimeout`.
- **Coverage gates**: statements ≥15%, branches ≥50%, functions ≥45% (enforced in CI).
- **P0 E2E**: runs on every PR/push. Gracefully skips when Appwrite free-tier project is paused.

## CI

Every push and PR runs:

| Gate             | Description                                      |
| ---------------- | ------------------------------------------------ |
| Typecheck        | `tsc --noEmit`                                   |
| Unit + API tests | Vitest with coverage thresholds                  |
| P0 E2E           | Playwright Chromium (skips when Appwrite paused) |
| Deploy           | Appwrite Sites + BigBase (on main)               |

## Deploy

- **Primary**: [Appwrite Sites](https://appwrite.io/) via `appwrite.json`
- **Secondary**: [BigBase](https://bigbase.click) via `danielvm-git/.github/actions/bigbase-deploy`
- **Live**: [astrobiologia.bigbase.click](https://astrobiologia.bigbase.click)

## Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing`)
3. Commit changes (`git commit -m 'feat: add amazing thing'`)
4. Push (`git push origin feat/amazing`)
5. Open a Pull Request

See [CONVENTIONS.md](CONVENTIONS.md) for coding standards and [AGENTS.md](AGENTS.md) for AI agent instructions.

## License

MIT © Daniel Valente de Macedo
