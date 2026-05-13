# Deployment Guide: Astrobiologia.com.br

## Deployment target

**Appwrite Sites** — hosts the SSR build of the Astro application via the `@astrojs/node` adapter in standalone mode.

## Build pipeline

```bash
pnpm install       # install dependencies
pnpm build         # builds apps/web-astro → apps/web-astro/dist/
```

## Appwrite Sites configuration

In the Appwrite Console → Sites → your site → Settings:

| Setting              | Value                         |
| -------------------- | ----------------------------- |
| **Build Command**    | `echo "Already built in GHA"` |
| **Output Directory** | `.`                           |
| **Service Command**  | `node server/entry.mjs`       |
| **Runtime**          | `node-22`                     |

_Note: Since we use GitHub Actions to build the site, Appwrite doesn't need to run the build again._

## Environment variables

Set these in Appwrite Console → Sites → Settings → Environment Variables.

| Variable                             | Required | Secret  | Description                                 |
| ------------------------------------ | -------- | ------- | ------------------------------------------- |
| `APPWRITE_ENDPOINT`                  | Yes      | No      | e.g. `https://nyc.cloud.appwrite.io/v1`     |
| `APPWRITE_PROJECT_ID`                | Yes      | No      | Appwrite project ID                         |
| `APPWRITE_API_KEY`                   | Yes      | **Yes** | Admin API key for SSR                       |
| `DATABASE_ID`                        | Yes      | No      | Appwrite database ID                        |
| `ARTICLES_COLLECTION_ID`             | Yes      | No      | Articles collection ID                      |
| `ARTICLE_TRANSLATIONS_COLLECTION_ID` | Yes      | No      | Translations collection ID                  |
| `CATEGORIES_COLLECTION_ID`           | Yes      | No      | Categories collection ID                    |
| `STORAGE_BUCKET_ID`                  | Yes      | No      | Image storage bucket ID                     |
| `SITE_SETTINGS_COLLECTION_ID`        | Yes      | No      | Site settings collection ID                 |
| `PUBLIC_APPWRITE_ENDPOINT`           | Yes      | No      | Same as `APPWRITE_ENDPOINT` (client-side)   |
| `PUBLIC_APPWRITE_PROJECT_ID`         | Yes      | No      | Same as `APPWRITE_PROJECT_ID` (client-side) |
| `PUBLIC_STORAGE_BUCKET_ID`           | Yes      | No      | Same as `STORAGE_BUCKET_ID` (client-side)   |
| `DEEPL_API_KEY`                      | No       | **Yes** | DeepL API key for auto-translation          |
| `APPWRITE_SITE_ID`                   | No       | No      | Required for the redeploy webhook endpoint  |

> Mark `APPWRITE_API_KEY` and `DEEPL_API_KEY` as **Secret** in the console.

## Git integration

**Recommendation**: Disconnect Git integration in the Appwrite Console.

We use the Appwrite CLI in GitHub Actions to push the pre-built `dist` folder. This avoids redundant builds and ensures that the site is only deployed after all tests pass in GHA.

If you keep Git integration connected, Appwrite will attempt to build the site on every push, which is redundant if GHA is already doing it.

## Local development

```bash
pnpm dev           # starts Astro dev server (apps/web-astro)
pnpm preflight     # type-check + lint + tests + build before pushing
```

Copy `apps/web-astro/.env` and fill in the variables above for local use.

## Troubleshooting

**Cold-start timeouts** — increase the Execution Timeout in Appwrite Console → Sites → Settings (default 15 s may be too low for pages with multiple Appwrite queries on first load).

**Screenshot capture failed** — this is cosmetic; it appears when the site takes too long during Appwrite's screenshot step and does not mean the deployment failed.
