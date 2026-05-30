# Scope: BMAD Test Suite Enhancement

**Initiative:** Harden Astrobiologia automated tests — fix flaky/shallow E2E, add API integration layer, align CI with P0/P1 priorities.

## In scope

- API integration tests for admin articles, auth login, translate (mocked DeepL)
- Deterministic E2E test data (`testRunId`, prefix-scoped cleanup)
- API-first article setup helpers (Appwrite admin client + session login)
- Playwright project split (public vs admin serial vs external DeepL)
- CI: unit+api job, split E2E P0, burn-in script, optional P1 on main
- E2E scenario fixes: manual EN translation P0, DeepL demoted to `@deepl @p2`, empty-state Given, bugs.feature completion
- Bigpowers artifacts: `TEST-DESIGN.md`, `RELEASE-PLAN.md`, `TRACEABILITY.md`, `TEST-REVIEW.md`, `STATE.md`

## Out of scope

- Pact / contract tests (no microservice boundary)
- Astro Container component tests (defer)
- Installing `_bmad/tea` agent in repo
- Changing production Appwrite schema or admin UI features unrelated to testability

## Success criteria

1. P0 CI runs without live DeepL
2. `pnpm test:api` covers article CRUD validation + auth + translate errors
3. No no-op Gherkin preconditions for DB state
4. `specs/TEST-REVIEW.md` overall score ≥ 90
