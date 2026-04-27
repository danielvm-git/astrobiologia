# PRD: Quality gates, bug tracking, and regression safety

## Problem Statement

The editorial news portal is feature-complete in intent but exhibits multiple defects in real use. There is no consolidated backlog of open problems—only a history of what was already fixed—so new failures are hard to prioritize and communicate. Requirements live across planning artifacts, but verification is not systematically tied to issues or to automated tests. The team wants to stop shipping regressions: every meaningful change should be guarded by the same test and commit discipline, aligned with Conventional Commits and (where adopted) automated semantic versioning, without relying on ad-hoc bug lists or informal channels.

## Solution

Adopt a single source of truth for **open** defects: **GitHub issues**, with a small, consistent template (requirement reference, reproduction, severity, area). Run **requirements-based exploration** against the official checklist (UAT, milestone requirements, and phase validation docs), in **reader-first** order on **local** against the real Appwrite stack, with a **production smoke** pass for critical paths, and **admin** flows only with a **dedicated test account**. For each **fixed** bug, follow the structured bug-fix workflow: minimum fix, **regression test**, `pnpm test` and `pnpm check`, optional e2e where appropriate, and append a row to a **bug log CSV** for auditability. Commits use **`fix` / `feat` / `BREAKING CHANGE`** as appropriate so future **semantic-release**-style automation can map commits to version impact without rewrites.

## User Stories

1. As a **site reader**, I want the home, listing, article, search, and not-found experiences to work reliably, so that I can trust the publication.
2. As a **reader**, I want **consistent language and URLs** where i18n is in scope, so that I am not sent to the wrong locale or mixed content.
3. As a **site editor (Danilo)**, I want to **log in** and **manage articles** (draft/publish, rich text, images, categories) without data loss, so that publishing stays efficient.
4. As a **maintainer**, I want every **new defect** recorded as a **GitHub issue** with a **link to the requirement** under test, so that work is traceable and discussable in one place.
5. As a **maintain er**, I want **bug titles** to use a **`bug(<scope>):`** pattern for open items and **Conventional Commits** for merge commits, so that releases and changelogs stay predictable.
6. As a **maintainer**, I want **CI** to run **typecheck, unit tests, and P0 e2e** on each PR and main, so that broken code rarely reaches production deploy.
7. As a **maintain er**, I want a **regression test** for every **fix**, so the same class of bug does not reappear silently.
8. As a **release owner**, I want **fix** commits to map to **patch** releases and **feat** to **minor** when semantic versioning is fully wired, so marketing and support can reason about impact.
9. As a **contributor**, I want **clear labels** (bug, severity, priority, and optional area) on issues, so that triage and sprint planning are fast.
10. As a **QA-minded developer**, I want **exploratory validation** to follow a **checklist** derived from UAT and validation docs, not only free browsing, so coverage matches agreed requirements.
11. As a **security-conscious maintainer**, I want **admin testing** to use a **test user**, not a personal production account, so credentials and data stay safe in issue descriptions.
12. As an **incident reviewer**, I want a **post-fix log row** in CSV for closed bugs, so audits and “what we fixed when” are recoverable without digging through chat.
13. As a **developer**, I want **Playwright** to cover **critical P0 user journeys** and **Vitest** to cover **isolated domain and server logic**, so tests stay fast and meaningful.
14. As a **maintainer**, I want **optional production smoke** (home, article, language, 404) after local passes, so deployment-specific issues are visible early.
15. As a **project lead**, I want **out-of-scope** items (e.g. full i18n v1.1) explicitly documented, so the stabilization effort does not sprawl.
16. As a **reader**, I want **search** behavior to match the agreed requirement (client vs server) without silent 500s, so the experience feels professional.
17. As an **editor**, I want **OAuth and email** login paths to stay consistent between browser and server session cookies, so I do not get stuck in half-authenticated states.
18. As a **maintain er**, I want **debug notes in planning** treated as *hints*, not as extra requirements, so issues do not duplicate old investigations.
19. As a **CI consumer**, I want the **Appwrite deploy** to run only after **green** checks on main, so bad builds do not go live.
20. As a **future automator**, I want the repo ready for **commitlint** or **semantic-release** without redoing all history, so incremental adoption is possible.

## Implementation Decisions

- **Source of requirements for validation:** UAT files, milestone requirements, and per-phase validation docs under the project planning area; context and plan-only docs inform understanding but are not pass/fail by themselves. Debug notes in planning are used to prioritize known gaps, not to add new scope unless re-validated.
- **Bug intake:** New findings become GitHub issues with scope in the title, requirement citation, environment (local first), steps, expected vs actual, and severity or priority for labeling. Historical “fixed only” lists are superseded by this pipeline for *open* work.
- **Deep modules to favor for tests** (proposed; confirm with team):  
  - **Auth and session bridge** (browser OAuth vs server session, cookie policy).  
  - **Article lifecycle** (create/update/publish, slugs, categories, featured media).  
  - **Public read model** (listing, article detail, not-found, SEO-related loaders).  
  - **Search contract** (query shape, error handling, empty states).  
  - **i18n shell** (when in scope: route locale, paraglide integration, sitemap or hreflang behavior).  
  Each should expose a small surface (pure helpers or narrow server APIs) that tests can call without re-implementing Svelte pages.
- **Process alignment:** After a fix, append a structured row to a bug log artifact for release forensics. Commits for fixes use the **`fix`**, optional scope, and **`Closes #N`** in the body. Infrastructure-only changes use `chore`, `test`, or `ci` as appropriate. Breaking changes use `!` or `BREAKING CHANGE` in the footer. Align with semantic version mapping when a release tool is added.
- **Environments:** Primary reproduction and fixes validated on local with Appwrite; production used for smoke, not for sole reproduction where avoidable. Admin flows require a test identity whose credentials are not pasted into public issues.
- **CI alignment:** Current pipeline already runs Svelte check, Vitest, and P0 Playwright; deploy to hosting follows success on main. No new infrastructure is *mandated* in this PRD except filling gaps in tests and issues—optional future steps include commitlint and semantic release automation.

## Testing Decisions

- **Good tests** assert **observable behavior** (HTTP status, rendered text, redirect, data returned from server helpers) rather than private implementation details, unless a pure function boundary is the unit under test.
- **Modules to cover with automated tests (priority):**  
  - Regression tests next to or under existing phase-style suites for **auth**, **CRUD/save paths**, and **i18n hooks** as they touch the bug class.  
  - **E2E P0** continues to protect **public home, article, not found, busca, admin login**; extend with new cases only when they encode a *closed* issue or a requirement gap.  
  - **Prior art:** Existing Vitest layout by phase, mock Appwrite in unit/integration tests, Playwright in `p0` / `p1` folders as already organized.
- **Definition of “no regressions” for a fix:** Failing test added first or in the same change as the fix; `pnpm test` and `pnpm check` pass locally and in CI; e2e updated if user-visible flow changed.
- **Exploratory validation** complements automation: a human pass in reader-first order against the written checklist, recording gaps as new issues.

## Out of Scope

- Rewriting or re-scoping full **v1.1** i18n or **server-side search** unless a bug directly breaks current in-scope behavior; those remain roadmap items unless explicitly pulled in.
- **Full semantic-release** and **npm package publishing** as in the reference fork, unless the project explicitly adopts a versioned site or package release process (deploy-on-green may remain the primary “release”).
- **Manual editing** of auto-generated changelogs if a release tool generates them; avoid duplicate bug lists outside issues + post-fix log.
- **Non-authenticated** stress or penetration testing; security hardening is limited to what falls out of normal bug triage.
- **Large visual redesign** or content strategy—this PRD is about **stability, traceability, and tests**.

## Further Notes

- The milestone requirements archive already marks one item **partial** (search) and defers i18n; stabilization should respect that, opening issues for **concrete** failures only.
- If the team confirms which **deep modules** get tests first, implementation can be sequenced: public read path + auth + CMS save, then i18n edge cases, then search hardening.
- This PRD is suitable for a single **epic** or **umbrella** GitHub issue; child issues can map one-to-one to bugs with labels `bug`, `severity:*`, `priority:*`, and optional `area:*`.

