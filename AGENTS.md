# Astrobiologia — AI Agent Instructions

> **Multi-agent context** — This is the canonical project context for **Claude Code**, **Cursor**, **Cline**, **Aider**, **OpenCode**, **Gemini CLI**, and other AGENTS.md-native tools. All agents read this file.

Coding agents working in this repository must follow an **Evidence-First Workflow** before reading or changing source files. The behavioral guidelines below bias toward **caution over speed**. For trivial tasks (obvious one-liners, typos), use judgment.

## Project

Astrobiologia.com — multilingual astrobiology news platform.
Stack: **Astro 5, React 19, TypeScript, pnpm monorepo, Appwrite BaaS, BigBase deploy**

| Action     | Command                                                |
| ---------- | ------------------------------------------------------ |
| Dev        | `pnpm --filter @astrobiologia/web-astro dev`           |
| Build      | `pnpm --filter @astrobiologia/web-astro build`         |
| Typecheck  | `pnpm --filter @astrobiologia/web-astro check`         |
| Unit tests | `pnpm --filter @astrobiologia/web-astro test:unit`     |
| Coverage   | `pnpm --filter @astrobiologia/web-astro test:coverage` |
| API tests  | `pnpm --filter @astrobiologia/web-astro test:api`      |
| E2E (P0)   | `pnpm --filter @astrobiologia/web-astro test:e2e:p0`   |
| Preflight  | `pnpm preflight`                                       |
| Full CI    | `gh pr checks` / push to main                          |

## Architecture

Monorepo with `apps/web-astro` as the primary Astro SSR app. Content managed via Appwrite Databases (articles, translations, categories). Admin panel at `/admin` with React components. E2E tests use Playwright + playwright-bdd (BDD). Deployed to both Appwrite Sites and BigBase. E2E gracefully skips when Appwrite free-tier project is paused.

## Conventions

- Conventional Commits (`feat:`, `fix:`, `docs:`, `ci:`, `chore:`)
- Pre-commit hooks: prettier → typecheck → unit tests (lint-staged)
- Coverage gates: statements ≥15%, branches ≥50%, functions ≥45%
- E2E locators: `getByTestId` primary, `getByRole` secondary, no CSS classes
- Never use `__dirname` in E2E infra — use `import.meta.url` + `fileURLToPath` (Playwright loads as ESM)
- Read specs/ and CONVENTIONS.md before writing code

## Evidence-First Workflow

**ALWAYS gather evidence before reading source files or making code changes.**

### Before ANY Code Modification

1. Check what depends on the symbol (grep importers, dependency graph)
2. Check git history for why it exists (`git log`, `git blame`)
3. Only then read and edit the specific lines required

### Task-Specific Context

If ctxo MCP tools are available, use them:

- **Bug:** `get_context_for_task(taskType: "fix")`
- **Feature:** `get_context_for_task(taskType: "extend")`
- **Refactor:** `get_context_for_task(taskType: "refactor")`

## Clean Code Rules

1. **300-line limit** — No file should exceed 300 lines. Decompose large files.
2. **Small functions** — 4–20 lines ideal. Fits in a single attention window.
3. **Grep-friendly names** — Unique, descriptive symbol names. A search should return exactly one target.
4. **Why-comments** — Explain intent and business rules, not what the code does.

## Behavioral Guidelines

### 1. Think Before Coding

State assumptions explicitly. Surface tradeoffs. If something is unclear, ask — don't guess.

### 2. Simplicity First

Minimum code that solves the problem. No features beyond what was asked. No abstractions for single-use code. If 200 lines could be 50, rewrite.

### 3. Surgical Changes

Touch only what you must. Match existing style. Don't "improve" adjacent code. Remove only imports/variables YOUR changes made unused.

### 4. Goal-Driven Execution

Define success criteria. Loop until verified. Run tests after every change. Show evidence before declaring done.

### 5. Test Quality

All tests must follow the F.I.R.S.T rubric (Fast, Independent, Repeatable, Self-Validating, Timely). E2E tests in `tests/` follow GEMINI.md quality mandates.

## Never

- Never edit a function without knowing what it breaks
- Never skip checking git intent on modified code
- Never dismiss reproducible gate failures as pre-existing
- Never proceed on red CI — invoke fix-bug first
- Never use `__dirname` in E2E test infra files
- Never use `page.waitForTimeout()` in Playwright tests

## Subdirectory Instructions

- [Tests](./apps/web-astro/tests/GEMINI.md): Test quality mandates, locator strategies, waiting patterns
