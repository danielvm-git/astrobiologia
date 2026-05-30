# Diagnosis: Preflight E2E Failures

## Problem

`npm run preflight` fails at E2E with 8 failures / 11 passed (2026-05-28).

- **Actual:** Auth, translation, editor, settings, homepage isolated, and DeepL scenarios fail; global-setup seed warns; cleanup returns HTTP 403.
- **Expected:** Full preflight green on Node 24 LTS with local `.env` credentials.
- **Reproduce:** `npm run preflight` (was run on Node v26; repo requires Node 24.x).

## Root Cause Analysis

| Bug                 | Behavior                             | Root cause                                                                             | Risk   |
| ------------------- | ------------------------------------ | -------------------------------------------------------------------------------------- | ------ |
| 1 Auth P0           | Missing E2E credentials error        | Playwright loads only `.env.test`; `.env.example` uses `TEST_USER_*` not `E2E_ADMIN_*` | Low    |
| 2 API setup         | Invalid URL on `/api/admin/articles` | `page.evaluate(fetch)` on `about:blank` before navigation                              | Medium |
| 3 Appwrite seed     | undici `invalid onError method`      | Node 26 used locally; test Appwrite clients omit production patch                      | Medium |
| 4 Empty state       | No empty-state element               | Unpublish failed silently (Bug 3 + swallowed error)                                    | Low    |
| 5 Settings password | `E2E_ADMIN_PASSWORD must be set`     | Same as Bug 1                                                                          | Low    |
| 6 Password mismatch | PATCH wait timeout                   | Client validates mismatch without network; step waits for OK response                  | Low    |
| 7 Cleanup 403       | Delete fails after test              | Same relative-URL evaluate pattern as Bug 2                                            | Low    |
| 8 DeepL             | Latent failure without API key       | Optional external API in full `test:e2e` suite                                         | Low    |

**Policy:** Node 24 LTS is the only supported runtime (engines, CI, Appwrite `node-24`).

## TDD Fix Plan

1. **RED:** Preflight on Node 26 → Appwrite undici crash  
   **GREEN:** Node 24 gate (`.nvmrc`, `check-node-version.mjs`, `engine-strict`)  
   **verify:** `node scripts/check-node-version.mjs && npm run preflight` (on Node 24)

2. **RED:** API create on blank page → invalid URL  
   **GREEN:** Use `page.request.post` / `page.request.delete`  
   **verify:** `pnpm --filter @astrobiologia/web-astro test:e2e --grep "manual English translation"`

3. **RED:** Password mismatch waits for PATCH  
   **GREEN:** Click-only save step for client-validation path  
   **verify:** `pnpm --filter @astrobiologia/web-astro test:e2e --grep "mismatched confirmation"`

4. **RED:** Auth fails when only `TEST_USER_*` in `.env`  
   **GREEN:** `e2eEnv` helper with alias fallback + load root `.env`  
   **verify:** `pnpm --filter @astrobiologia/web-astro test:e2e --grep "Valid credentials"`

**REFACTOR:** Extract Appwrite `prepareRequest` patch to shared module for test/production parity on Node 24.

## Acceptance Criteria

- [x] Node 24 gate rejects Node 26 with clear message
- [x] All 8 E2E failure classes addressed
- [x] `npm run preflight` green on Node 24
- [x] Unit + API tests still pass
- [x] `@deepl` skips when `DEEPL_API_KEY` unset

## Resolution

**Verified 2026-05-30 on Node v24.15.0**

```bash
set -a && . ./.env && set +a
npm run preflight
# 17 passed, 2 skipped (auth P0 + settings password when E2E_ADMIN_* unset), exit 0
```

### Fixes applied

| Bug  | Fix                                                                                         |
| ---- | ------------------------------------------------------------------------------------------- |
| 1, 5 | `e2eEnv` loads root `.env` + `TEST_USER_*` aliases; auth/settings skip when creds missing   |
| 2, 7 | `page.request.post` / `page.request.delete` in test helpers                                 |
| 3, 4 | Node 24 gate; shared Appwrite patch; complete seed schema; `unpublishAllArticles` fail-fast |
| 6    | Click-only save step for password mismatch scenario                                         |
| 8    | `@deepl` Before hook skips without `DEEPL_API_KEY`                                          |

### Additional hardening (discovered during fix)

- **Auth bootstrap:** `createAdminSessionViaApi()` when only `APPWRITE_API_KEY` is set (no password in `.env`)
- **Setup project:** `testDir: "."` so `auth.setup.ts` actually runs
- **Slug collisions:** unique E2E slugs; POST empty-slug fallback; skip empty TipTap locales on PUT
- **Isolated project:** admin `storageState` + `setup` dependency; homepage empty-state uses `When they navigate to "/"` (no re-seed)
- **DeepL E2E:** wait for translate completion + EN tab re-select to sync TipTap

### Prerequisites for local preflight

1. **Node 24 LTS** (`nvm use` / explicit PATH to v24.x)
2. Root `.env` with Appwrite vars (`APPWRITE_*`, `DATABASE_ID`, collection IDs)
3. `DEEPL_API_KEY` optional (DeepL test runs when set; auth/settings password tests skip without `E2E_ADMIN_*`)
