# Release Plan: Test Suite Enhancement

Stories use IDs `T{n}.{m}` for traceability in `specs/TRACEABILITY.md`.

## Epic T1: API integration layer

### Story T1.1 — Article route integration tests

- Add `src/pages/api/__tests__/articles.test.ts` with mocked Appwrite
- Cover POST 401, POST 400 empty pt-br title, POST 201 success
- Cover PUT 400 validation, PUT skips empty EN translation

→ verify: `pnpm --filter @astrobiologia/web-astro test:api`

### Story T1.2 — Auth and translate integration tests

- Add `auth-login.test.ts`: 400 missing fields, 401 bad creds, 200 + Set-Cookie
- Add `translate.test.ts`: 503 no DEEPL key, 200 with mocked DeepL fetch

→ verify: `pnpm --filter @astrobiologia/web-astro test:api`

## Epic T2: Deterministic E2E framework

### Story T2.1 — testRunId helper

- Add `tests/helpers/testRunId.ts`
- Replace `Date.now()` / `Math.random()` in step files
- Remove dead `fixtures/users.ts` or wire to auth helpers

→ verify: `pnpm --filter @astrobiologia/web-astro test:unit`

### Story T2.2 — API-first setup + fixture cleanup

- Add `appwriteTestClient.ts`, `adminApiSession.ts`
- Extend `base.fixture.ts` with `testDataPrefix`, loud DELETE cleanup
- Refactor `createArticleViaUi` for API setup where possible

→ verify: `pnpm --filter @astrobiologia/web-astro check`

## Epic T3: E2E scenario fixes

### Story T3.1 — Translation and DeepL tags

- P0: manual EN translation save with content + public page assertions
- P2: DeepL scenario tagged `@deepl @p2`

→ verify: `pnpm --filter @astrobiologia/web-astro test:e2e:p0`

### Story T3.2 — Empty state, bugs, strengthened P0

- Implement `Given no articles are published` via API unpublish
- Fixed seed slug `e2e-seed-article` in global-setup
- Complete bugs.feature Then step
- Strengthen create/homepage/auth assertions

→ verify: `pnpm --filter @astrobiologia/web-astro test:e2e:p0`

## Epic T4: Playwright projects + CI

### Story T4.1 — Project split

- `public-smoke`, `admin-crud`, `admin-extended`, `external` in playwright.config.ts

→ verify: `pnpm --filter @astrobiologia/web-astro test:e2e:p0`

### Story T4.2 — CI jobs and burn-in

- Merge unit + api in check job; split E2E or serial admin
- Add `test:burn-in` script

→ verify: `pnpm --filter @astrobiologia/web-astro test:burn-in` (local) / CI green

## Epic T5: Traceability and review

### Story T5.1 — Specs closure

- Write `specs/TRACEABILITY.md`, `specs/TEST-REVIEW.md`, update `specs/STATE.md`
- Pointer in `apps/web-astro/tests/test-review.md` → specs

→ verify: `[ -f specs/TEST-REVIEW.md ] && grep -q "9[0-9]/100" specs/TEST-REVIEW.md`
