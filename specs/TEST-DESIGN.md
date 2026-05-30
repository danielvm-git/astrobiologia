# Test Design: Admin & Public Portal (Epic)

**Workflow:** BMAD TEA `test-design` (epic-level)  
**Date:** 2026-05-28  
**App:** `@astrobiologia/web-astro`

## Test level decisions

| Concern                        | Level                  | Rationale                                 |
| ------------------------------ | ---------------------- | ----------------------------------------- |
| pt-br title validation         | Unit + API integration | Pure function + route handler contract    |
| Slug derivation (CJK)          | Unit                   | Pure function in `article-editor-slug.ts` |
| Article CRUD persistence       | API integration        | Appwrite mocked; proves handler logic     |
| Auth session cookie            | API integration        | Login route contract                      |
| DeepL translate route          | API integration        | Mock `fetch`; no external API in CI       |
| Admin create/edit journey      | E2E (thin)             | API setup + UI assertion only             |
| Public homepage / article read | E2E smoke              | Read-only; parallel-safe                  |
| Settings / dashboard           | E2E P1                 | Lower risk; nightly/main                  |

## Priority matrix (P0–P3)

### P0 — CI gate (deterministic, no external APIs)

| ID       | Scenario                               | Level | Tags                      |
| -------- | -------------------------------------- | ----- | ------------------------- |
| TD-P0-01 | Admin login smoke                      | E2E   | `@p0 @smoke`              |
| TD-P0-02 | Homepage shows article cards (seeded)  | E2E   | `@p0 @smoke`              |
| TD-P0-03 | Admin creates article                  | E2E   | `@p0 @admin`              |
| TD-P0-04 | Admin saves manual English translation | E2E   | `@p0 @admin @translation` |
| TD-P0-05 | Article POST rejects empty pt-br title | API   | —                         |
| TD-P0-06 | Auth login 401 / 200 + cookie          | API   | —                         |

### P1 — Main / nightly

| ID       | Scenario                                | Level | Tags                      |
| -------- | --------------------------------------- | ----- | ------------------------- |
| TD-P1-01 | Editor title validation (client)        | E2E   | `@p1 @admin`              |
| TD-P1-02 | Slug preserved on title edit            | E2E   | `@p1 @admin`              |
| TD-P1-03 | Clear optional EN content still saves   | E2E   | `@p1 @admin @translation` |
| TD-P1-04 | Settings, dashboard, search, categories | E2E   | `@p1`                     |
| TD-P1-05 | Homepage empty state (controlled DB)    | E2E   | `@p1 @isolated`           |

### P2 — Optional / weekly

| ID       | Scenario                            | Level | Tags         |
| -------- | ----------------------------------- | ----- | ------------ |
| TD-P2-01 | DeepL translates content (live API) | E2E   | `@deepl @p2` |

### P3 — Manual / exploratory

| ID       | Scenario                  | Notes             |
| -------- | ------------------------- | ----------------- |
| TD-P3-01 | Full cross-browser matrix | Not in current CI |

## Explicit demotion

**Removed from P0:** "Admin translates via DeepL button" — external dependency, weak assertion on title-only. Replaced by TD-P0-04 (manual EN save) + TD-P2-01 (live DeepL optional).

## Parallelism rules

- **public-smoke:** parallel workers OK (read-only)
- **admin-crud:** serial (`workers: 1`) — shared Appwrite test DB mutations
- **admin-extended (P1):** parallel with `testDataPrefix` isolation
- **external (DeepL):** serial, separate CI job

## References

- [2026-05-12 Gherkin testing spec](../docs/superpowers/specs/2026-05-12-modern-gherkin-testing-suite-design.md)
- BMAD TEA: test-levels-framework, data-factories, network-first
