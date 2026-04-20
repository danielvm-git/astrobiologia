<!-- generated-by: gsd-doc-writer -->
# Deployment Guide: Astrobiologia.com.br

## Deployment targets
The primary deployment target is **Appwrite Sites**, which hosts the static build of the SvelteKit application. This aligns with the goal of minimizing infrastructure management by staying within the Appwrite Cloud ecosystem.

- **Appwrite Sites**: Primary production host for the frontend.
- **Vercel**: (Optional) Alternative host for SSR or advanced features.

## Build pipeline
The build process generates a server-side rendered (SSR) bundle for **Appwrite Sites**, which now supports Node.js runtimes.

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Paraglide Compilation**:
   The project uses Paraglide for i18n. While the Vite plugin usually handles this, ensure messages are fully compiled to avoid `ENOENT` errors during build:
   ```bash
   npx paraglide-js compile --project ./project.inlang --outdir ./src/lib/paraglide
   ```

3. **Production Build**:
   ```bash
   npm run build
   ```
   **Note**: The project uses `@sveltejs/adapter-node`. Ensure the site is configured as an **SSR** site in the Appwrite Console.

## Environment setup
To ensure the build process is resilient and secure on Appwrite Cloud, we use **Dynamic Environment Variables**.

**Key Lesson**: Do NOT use `$env/static/public` or `$env/static/private` for variables that are provided by the Appwrite Console. Using static variables will cause the build to fail on Appwrite Cloud because they are not present in the shell during the `npm run build` phase.

**Solution**: Use `$env/dynamic/public` and `$env/dynamic/private`. This allows the build to complete without a `.env` file, with SvelteKit resolving the values at runtime from the environment.

| Variable | Required | Scope | Description |
| :--- | :--- | :--- | :--- |
| `PUBLIC_APPWRITE_ENDPOINT` | Yes | Public | Appwrite Cloud endpoint URL |
| `PUBLIC_APPWRITE_PROJECT_ID` | Yes | Public | Appwrite Project ID |
| `APPWRITE_API_KEY` | Yes | Private (Secret) | Admin API Key for SSR Auth |
| `PUBLIC_DATABASE_ID` | Yes | Public | Appwrite Database ID |
| `PUBLIC_ARTICLES_COLLECTION_ID` | Yes | Public | Articles collection ID |
| `PUBLIC_ARTICLES_TRANSLATIONS_COLLECTION_ID` | No | Public | Translations collection (default `article_translations`); set to a parallel collection for E2E/CI in the same project. |
| `PUBLIC_CATEGORIES_COLLECTION_ID` | No | Public | Categories collection (default `categories`). |
| `PUBLIC_STORAGE_BUCKET_ID` | No | Public | Image storage bucket (default `images`); use a second bucket for automation if needed. |

> [!IMPORTANT]
> You MUST set these variables in the **Settings > Environment Variables** section of your site in the Appwrite Console. Mark `APPWRITE_API_KEY` as a **Secret**.

### OAuth / Google login on Appwrite Sites

Google OAuth (`createOAuth2Token`) rejects redirects that are not allowlisted and must use the same scheme as configured (typically **`https`**).

- **Symptom:** Appwrite API error **`Invalid redirect`** when clicking “Continue with Google” in production only.
- **Cause (scheme):** Some edges send **`X-Forwarded-Proto: http`** even though the browser hits **`https://`**. Prefer fixing at the platform layer: for `@sveltejs/adapter-node`, set **`ORIGIN=https://<your-public-host>`** (see [SvelteKit adapter-node](https://svelte.dev/docs/kit/adapter-node) env vars), or set optional **`PUBLIC_ORIGIN`** to that same URL in site env. The codebase also prefers **`event.url`** when it is already **`https:`** so OAuth callback URLs stay HTTPS.
- **Cause (hostname — most common once URLs are already `https://`):** **`success`** / **`failure`** hosts must match a **Web** platform registered on the Appwrite **project**. In **Appwrite Console → your project → Auth → Platforms**, add **Web** with hostname **`astrobiologia.appwrite.network`** (hostname only — no `https://`, no path). Use a wildcard like **`*.appwrite.network`** only if previews use different subdomains. Deployed URLs that are not localhost will **not** work until this exists — see [community threads](https://appwrite.io/threads/1327716367025045565).
- **Cause (Google Cloud OAuth client):** In **Google Cloud Console → APIs & Services → Credentials → your OAuth 2.0 Client**, **Authorized redirect URIs** must match **exactly** the redirect URI shown in **Appwrite Console → Auth → Settings → Google** (copy-paste from Appwrite; do not hand-type). A typo or stray character in the path invalidates the URI. For a **Web application** client, add **`https://astrobiologia.appwrite.network`** under **Authorized JavaScript origins** if Google requires it for your client type.

## GitHub Actions ↔ Appwrite Sites

There are **two** supported ways to connect your repo and Appwrite; you can use **one or both**.

### A — Appwrite Git (recommended for previews)

In **Appwrite Console → Sites → your site → Settings → Git repository**, connect this GitHub repo.

| Event | Behavior (per [Appwrite Git deployments](https://appwrite.io/docs/products/sites/deploy-from-git)) |
| :--- | :--- |
| Push to **production branch** (usually `main`) | New deployment is built and **activated** on your primary domain. |
| Push to **other branches** | New deployment is created **but not activated**; a **[preview link](https://appwrite.io/docs/products/sites/previews)** is generated (access is limited to **members of your Appwrite organization**). |

**Quality gate:** Require the GitHub Actions **CI** workflow to pass before merging into `main` (branch protection). After merge, the production push either goes to Appwrite via Git **or** via the CLI job below—**do not** run two competing production deploy pipelines unless you intend to.

### B — GitHub Actions deploy after tests (CLI push)

This repo includes a **`deploy-appwrite-sites`** job in [`.github/workflows/ci.yml`](.github/workflows/ci.yml). It runs **only** when:

1. The workflow was triggered by a **push** to `main` or `master`,
2. **`appwrite.config.json`** exists in the repository root,
3. Required **secrets** are set (see below).

It runs **after** `check-and-unit` and `e2e-p0` succeed. The CLI uses [non-interactive mode](https://appwrite.io/docs/tooling/command-line/non-interactive): API key authentication, then `appwrite push sites --activate`.

**Setup:**

1. Copy `appwrite.config.json.example` → `appwrite.config.json`, or generate/sync with the CLI using [`appwrite pull sites`](https://appwrite.io/docs/tooling/command-line/sites) after `appwrite login` locally.
2. Verify `installCommand`, `buildCommand`, `outputDirectory`, `adapter`, and `buildRuntime` match your Appwrite Sites settings (`@sveltejs/adapter-node` outputs to **`build`** by default).
3. Commit **`appwrite.config.json`** (it holds IDs, not secrets). Keep **`APPWRITE_API_KEY`** out of git.
4. In **GitHub → Settings → Secrets and variables → Actions**, add:

| Secret | Purpose |
| :--- | :--- |
| `APPWRITE_ENDPOINT` | e.g. `https://<REGION>.cloud.appwrite.io/v1` |
| `APPWRITE_PROJECT_ID` | Project ID |
| `APPWRITE_API_KEY` | API key with permission to manage Sites (scoped key recommended) |
| `APPWRITE_SITE_ID` | Same `$id` as your site in `appwrite.config.json` |

If `appwrite.config.json` is missing, the deploy job is **skipped** so CI still passes.

### Preview URL “only from GitHub”

True PR previews that **wait** for Actions are **not** the same as Appwrite’s branch previews. Typical pattern:

- **PR:** run tests only (or deploy to a **non-Appwrite** preview host).
- **Branch previews on Appwrite:** enable **Git integration** above; non–production-branch pushes get an **Appwrite preview URL** (org-only per docs).
- **Production:** merge after CI green → either Appwrite builds from `main` (Git) or the **CLI deploy** job pushes and activates.

## Rollback procedure
- **Appwrite Sites**: To roll back, re-upload the previous successful build directory (`build/` or `.svelte-kit/output/`) to the Appwrite Sites console.
- **Vercel**: Use the Vercel dashboard to "Promote to Production" a previous successful deployment.

## Post-Deployment Checklist
- [ ] Test homepage loads with premium "New Scientist" aesthetics.
- [ ] Verify Appwrite connection (articles loading).
- [ ] Test Admin login at `/admin`.
- [ ] Ensure images are served from Appwrite Storage.
- [ ] Check SEO meta tags and social sharing previews.
- [ ] Verify i18n switching works (Paraglide runtime).

## Monitoring & Maintenance
- **Appwrite Console**: Monitor database traffic, storage usage, and API request logs.
- **Backups**: Use Appwrite's built-in data export features for the database.
- **Updates**: Monthly dependency checks with `pnpm update`.
- **Analytics**: Use a privacy-focused solution like Plausible or simple Vercel Analytics if using Vercel.
