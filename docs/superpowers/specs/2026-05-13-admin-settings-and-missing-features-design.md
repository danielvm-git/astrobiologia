# Spec: Admin Settings Page + Missing Feature Tests

**Date:** 2026-05-13
**Status:** Draft
**Topic:** Implement the missing admin feature tests (auth, dashboard, settings) and the settings page they require.

---

## 1. Overview

Three feature files were listed in the Gherkin testing suite spec but never implemented: `admin/auth.feature`, `admin/dashboard.feature`, and `admin/settings.feature`. Auth and dashboard have existing pages; settings does not. This spec covers building the settings page stub and writing all three feature files with their step definitions.

## 2. Settings Page Design

### 2.1. Route & Files

| Type                           | Path                                      |
| ------------------------------ | ----------------------------------------- |
| Astro page                     | `src/pages/admin/configuracoes.astro`     |
| React component                | `src/components/admin/Settings.tsx`       |
| API — read/write site metadata | `src/pages/api/admin/settings.ts`         |
| API — update account email     | `src/pages/api/admin/account/email.ts`    |
| API — update account password  | `src/pages/api/admin/account/password.ts` |

Add "Configurações" nav link to `src/layouts/Admin.astro`.

### 2.2. Sections

**Tema** — Light / Dark / System radio buttons. Writes `data-theme` attribute to `<html>` and persists in `localStorage`. A blocking `<script>` in `Base.astro` applies the preference on load to prevent flash. Pure client-side; no API needed.

**Conta** — Two sub-forms: change email and change password. Each submits independently. Calls `PATCH /api/admin/account/email` and `PATCH /api/admin/account/password`, which proxy to the Appwrite account update SDK methods. Show success toast (`data-testid="toast-success"`) or inline error on response.

**Metadados do Site** — Single form: site name, tagline, description. Reads from and writes to `SITE_SETTINGS_COLLECTION_ID` Appwrite collection (already declared in `env.d.ts`) via `GET /api/admin/settings` and `PUT /api/admin/settings`. Uses `data-testid="settings-site-name"`, `data-testid="settings-tagline"`, `data-testid="settings-description"`, `data-testid="settings-save"`.

### 2.3. Data-testid Contract

| Element                              | testid                                      |
| ------------------------------------ | ------------------------------------------- |
| Theme radio group                    | `theme-selector`                            |
| Individual radio (light/dark/system) | `theme-light`, `theme-dark`, `theme-system` |
| Account email input                  | `account-email`                             |
| Account password input               | `account-password`                          |
| Account confirm password             | `account-password-confirm`                  |
| Account save button                  | `account-save`                              |
| Site name input                      | `settings-site-name`                        |
| Tagline input                        | `settings-tagline`                          |
| Description textarea                 | `settings-description`                      |
| Site metadata save button            | `settings-save`                             |
| Success toast (shared pattern)       | `toast-success`                             |

---

## 3. Feature Files

### 3.1. `admin/auth.feature`

Two scenarios:

- `@p0 @smoke` — Valid credentials redirect to `/admin` dashboard
- `@p1` — Invalid credentials show an inline error message (no redirect)

No new step definitions needed beyond what `common.steps.ts` already provides. Auth-specific steps (`the login form should be visible`, `they submit the login form`, `they should be redirected to the admin dashboard`, `they should see a login error`) go in a new `tests/steps/auth.steps.ts`.

### 3.2. `admin/dashboard.feature`

Two scenarios:

- `@p0 @smoke @admin` — Dashboard loads with the four stat cards visible
- `@p1 @admin` — "Novo Artigo" quick action navigates to `/admin/artigos/new`

Steps go in `tests/steps/dashboard.steps.ts`. Uses text-based selectors (no testids in Dashboard.tsx): `h1` with "Painel de Controle", text "Total de Artigos", button/link "Novo Artigo".

### 3.3. `admin/settings.feature`

Three scenarios:

- `@p0 @admin` — Theme toggle persists across page reload (theme radio + localStorage)
- `@p1 @admin` — Account password form submits and shows success toast
- `@p1 @admin @wip` — Site metadata saves successfully (requires `SITE_SETTINGS_COLLECTION_ID` Appwrite collection to be configured)

Steps go in `tests/steps/settings.steps.ts`.

---

## 4. Implementation Strategy

1. Add `data-theme` flash-prevention script to `Base.astro`.
2. Build `Settings.tsx` component with three sections.
3. Create three API routes.
4. Create `configuracoes.astro` page and add sidebar link.
5. Write `auth.feature` + `auth.steps.ts`.
6. Write `dashboard.feature` + `dashboard.steps.ts`.
7. Write `settings.feature` + `settings.steps.ts`.
8. Run `pnpm test:e2e` to verify auth and dashboard pass; confirm settings theme scenario passes.

---

## 5. Self-Review Notes

- **Placeholders:** `SITE_SETTINGS_COLLECTION_ID` collection schema is not defined here — the `@wip` tag on the metadata scenario handles this gap explicitly.
- **Consistency:** testid naming follows existing patterns (`toast-success`, `article-title`, etc.).
- **Scope:** Settings page is a functional stub — theme is fully wired, account uses real Appwrite calls, metadata is wired but gated by `@wip`.
- **Ambiguity:** "Change email" will invalidate the current session in Appwrite; the scenario should not test post-email-change state beyond the success toast.
