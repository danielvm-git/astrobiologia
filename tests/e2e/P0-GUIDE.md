# P0 E2E — step-by-step

Follow these steps once; after that, day-to-day is just steps 7–9.

## 1. Prerequisites

- Node 20+
- Dependencies installed: `npm ci`
- Playwright browsers: `npx playwright install chromium` (full install: `npx playwright install`)

## 2. Understand what runs in CI

GitHub Actions runs **`npm run test:e2e:p0`**, which executes only **`tests/e2e/p0/**/*.spec.ts`** on **Chromium**. Your PR gate stays small and fast.

## 3. Know the locale URLs

Default locale is **Portuguese (`pt-br`)**. With your Paraglide URL rules, Portuguese uses **no** `/pt-br` prefix (`/` not `/pt-br/`). English lives under **`/en/…`**.

P0 specs target **`/`**, **`/busca`**, **`/artigos/<slug>`** on that default locale.

## 4. Environment for local E2E

Playwright starts **`npm run build && npm run preview`** automatically (see `playwright.config.ts`). The preview server loads **your local `.env`** via SvelteKit for Appwrite calls.

For **pure UI structure** tests (hero, headings, 404 shell), Appwrite does not need to succeed; the home loader still renders the hero if lists are empty.

If a test ever needs **real articles**, ensure `.env` points at a project/database that has data (or duplicate collections — see `.env.example`).

## 5. Run only P0 locally

```bash
npm run test:e2e:p0
```

Equivalent:

```bash
npx playwright test tests/e2e/p0 --project=chromium
```

## 6. Run full E2E (all folders + all browsers)

When you widen coverage:

```bash
npm run test:e2e
```

## 7. Add a new P0 test

1. Create or edit a file under **`tests/e2e/p0/`** (e.g. `something.spec.ts`).
2. Prefer **role-based** selectors: `getByRole`, `getByPlaceholder`. Avoid brittle CSS-only selectors.
3. Prefer **stable copy** tied to `messages/*.json` or visible UI strings.
4. Tag the title with **`[P0]`** so reports stay readable.

## 8. Promote tests out of P0 when you widen CI

When the suite is stable:

- Move specs from **`p0/`** → **`p1/`** or **`tests/e2e/`** root.
- Update **`package.json`** script **`test:e2e:p0`** path/grep if you change the convention, or keep P0 folder as the contract for “must pass on PR”.

## 9. Enable admin login E2E (later)

When you have isolated credentials and collections:

1. Unskip tests in **`tests/e2e/p0/admin-login.spec.ts`** (or move to **`p1/`** if login is no longer P0 gate).
2. Provide secrets via **GitHub Actions** encrypted secrets and map them into **`env`** for the **`e2e-p0`** job (`TEST_USER_EMAIL`, `TEST_USER_PASSWORD`), and ensure the user exists in your **non-production** Appwrite data.

---

## Troubleshooting

| Issue | What to try |
| :--- | :--- |
| **`webServer` timeout** | Production `npm run build` often takes **over 60s**. This repo sets `timeout: 180000` in `playwright.config.ts` for `webServer`. With a preview already running on port **4173**, Playwright can reuse it when **not** in `CI` (`reuseExistingServer`). |
| **404 page text** | SSR error pages typically show **`Not Found`**, not your custom `error(404, '…')` message. Assertions should target **`404`** + **`Not Found`** + “Voltar…” link pattern. |
| **Flaky redirects** | Use `await page.goto(url, { waitUntil: 'networkidle' })` only if needed (slower); prefer assertions with Playwright auto-wait. |
| **`baseURL`** | Defined in `playwright.config.ts` (`BASE_URL` or default `http://localhost:4173`). |
