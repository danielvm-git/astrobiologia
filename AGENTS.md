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
- **Authentication**: Always use project-specific session cookies (`a_session_${PROJECT_ID}`) for SSR to maintain sync with the client-side SDK. **Google OAuth** is started in the browser via `$lib/auth/google-oauth-browser.ts` using **`account.createOAuth2Token(provider, success, failure)`** (positional); success URL is **`/oauth`** so `src/routes/oauth/+server.ts` can exchange `userId`/`secret` and set the httpOnly cookie. **Email/password** login uses server actions only. For **`secure`** cookies behind proxies, `$lib/server/public-origin.ts` (`isPublicHttps`, optional **`PUBLIC_ORIGIN`** / adapter **`ORIGIN`**) applies.
- **Admin Routing**: Use server-side load functions (`+page.server.ts`) for all authenticated admin data fetching to avoid 401 errors in the browser.
- **Appwrite SDK Split**: Two SDKs with DIFFERENT APIs are in use:
  - `appwrite` (client, v17, browser): positional args — `createEmailPasswordSession(email, password)`, **`createOAuth2Token(OAuthProvider.Google, successUrl, failureUrl)`** for Google login
  - `node-appwrite` (server, v24, SSR): named params — `createEmailPasswordSession({ email, password })`, `createSession({ userId, secret })` on the OAuth callback route only — **do not** call `createOAuth2Token` from server form actions for browser OAuth
- **Svelte 5**: Use runes (`$state`, `$derived`, etc.) and modern Svelte 5 patterns.

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

## Svelte MCP
You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

### Available Svelte MCP Tools:
1. **list-sections**: Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths. When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.
2. **get-documentation**: Retrieves full documentation content for specific sections. Accepts single or multiple sections. After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.
3. **svelte-autofixer**: Analyzes Svelte code and returns issues and suggestions. You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.
4. **playground-link**: Generates a Svelte Playground link with the provided code. After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

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
