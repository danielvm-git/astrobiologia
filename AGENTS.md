# Project: Astrobiologia.com.br

## Overview
A professional journalistic portal covering astrobiology, maintained by Danilo Albergaria. Focuses on news, interviews, and Brazilian research in life in the universe.

## Tech Stack
- **Frontend**: SvelteKit (Svelte 5)
- **Backend**: Appwrite Cloud (Auth, Database, Storage, Functions, Sites)
- **Styling**: Tailwind CSS 4
- **Deployment**: Appwrite Sites

## Key Commands
- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm check`: Type check Svelte components

## Project Rules
- **Aesthetics**: Follow "New Scientist" / "Universe Today" premium scientific design.
- **Simplicity**: Prioritize low maintenance and free tier usage.
- **Language**: Core content is in Portuguese, but the project supports multi-language (i18n).
- **Backend**: Use Appwrite Cloud for all backend needs. Do not introduce self-hosted components.
- **Svelte 5**: Use runes (`$state`, `$derived`, etc.) and modern Svelte 5 patterns.
- **Tailwind 4**: Use Tailwind 4 features and avoid legacy configurations.

## Current Status
- **Active Phase**: Phase 2: Administrative CMS (Articles CRUD).
- **Milestone**: Milestone 1: MVP - Functional Portal & Admin.

## Skills
This project uses the Agent Skills framework for domain-specific guidance.

### GSD Workflow
- **Location**: `.agent/skills/gsd-*`
- **Use when**: Managing project progress, planning phases, and executing tasks.
- **Key principle**: Follow the `discuss -> plan -> execute` workflow.

### leanspec-sdd - Spec-Driven Development
- **Location**: `.github/skills/leanspec-sdd/SKILL.md`
- **Use when**: Working with specs, planning features, multi-step changes.
- **Key principle**: Run `board` or `search` before creating specs.

## Operational Rules

### Agent Behavior & Execution Discipline
- **SEARCH FIRST**: Exhaustively search the codebase before implementing new logic.
- **REUSE FIRST**: Prioritize extending existing patterns/utilities over creating new ones.
- **NO ASSUMPTIONS**: Base actions only on read files and tool outputs.
- **CHALLENGE IDEAS**: Surface flaws and alternative approaches before coding.
- **LOG CHECK**: Always verify changes by inspecting relevant logs (browser/server/CI).
- **SELF-CHECK**: Periodically re-read rules to maintain compliance.
- **Coding Standards**: Plan in one paragraph before coding; keep imports alphabetically sorted; keep files under 300 lines; use AAA (Arrange-Act-Assert) for tests.
- **Prohibitions**: Never write documentation unless asked; never run `pnpm dev` (assume it's running); never suppress TS errors without a `// TODO(tech-debt)` comment.

### Clean Code Operating Manual
- **Core Principles**: Follow the Boy Scout Rule (leave code cleaner); optimize for readability; prefer deletion of dead code.
- **Naming**: Use intention-revealing, searchable, and pronounceable names. Classes are nouns; methods are verbs.
- **Functions**: Target ≤ 20 lines; do exactly one thing; maintain one level of abstraction.
- **Comments**: View every comment as an apology for code that fails to express itself. Avoid redundant narration.
- **Error Handling**: Prefer exceptions over return codes; never return or pass `null` across boundaries.

### Bug Fix Workflow
- **Reproduce**: State error, location, root cause, and trigger condition.
- **Plan**: List file changes and assess risk (Low/Medium/High).
- **Implement**: Minimum necessary changes; no "drive-by" refactors.
- **Prevent**: Use type guards, Zod schema updates, or assertions to prevent recurrence.
- **Test**: A regression test is **mandatory**; run the full suite, type-check, and linter.

### Conventional Commits
- **Format**: `<type>(<scope>): <subject>` (e.g., `feat(auth): add login flow`).
- **Subject Line**: Imperative mood, lowercase first letter, no trailing period, max 72 characters.
- **Hard Rules**: **Never** use `git add .` or `git add -A`; one logical change per commit.
