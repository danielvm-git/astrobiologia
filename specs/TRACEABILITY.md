# Traceability: Test Suite Enhancement

Maps `specs/RELEASE-PLAN.md` stories to implementing code and verification commands.

| Story | Implementation                                                                                                   | Verify                                               |
| ----- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| T1.1  | `src/pages/api/__tests__/articles.test.ts`                                                                       | `pnpm --filter @astrobiologia/web-astro test:api`    |
| T1.2  | `src/pages/api/__tests__/auth-login.test.ts`, `translate.test.ts`                                                | `pnpm --filter @astrobiologia/web-astro test:api`    |
| T2.1  | `tests/helpers/testRunId.ts`, `tests/steps/admin.steps.ts`                                                       | `pnpm --filter @astrobiologia/web-astro test:unit`   |
| T2.2  | `tests/helpers/appwriteTestClient.ts`, `adminApiSession.ts`, `createArticleViaUi.ts`, `fixtures/base.fixture.ts` | `pnpm --filter @astrobiologia/web-astro check`       |
| T3.1  | `tests/features/admin/translation.feature`, `tests/steps/admin.steps.ts`                                         | `pnpm --filter @astrobiologia/web-astro test:e2e:p0` |
| T3.2  | `tests/steps/common.steps.ts`, `tests/features/bugs.feature`, `tests/global-setup.ts`                            | `pnpm --filter @astrobiologia/web-astro test:e2e:p0` |
| T4.1  | `playwright.config.ts` (projects)                                                                                | `pnpm --filter @astrobiologia/web-astro test:e2e:p0` |
| T4.2  | `package.json` (`test:burn-in`), `.github/workflows/ci.yml`                                                      | CI / `test:burn-in`                                  |
| T5.1  | `specs/TEST-REVIEW.md`, `specs/TRACEABILITY.md`, `specs/STATE.md`                                                | manual                                               |

## Test-design ID mapping

| ID       | Level | Location                                               |
| -------- | ----- | ------------------------------------------------------ |
| TD-P0-01 | E2E   | `tests/features/admin/auth.feature`                    |
| TD-P0-02 | E2E   | `tests/features/homepage.feature`                      |
| TD-P0-03 | E2E   | `tests/features/admin/editor.feature`                  |
| TD-P0-04 | E2E   | `tests/features/admin/translation.feature` (manual EN) |
| TD-P0-05 | API   | `articles.test.ts` POST 400                            |
| TD-P0-06 | API   | `auth-login.test.ts`                                   |
| TD-P2-01 | E2E   | `translation.feature` `@deepl @p2`                     |
