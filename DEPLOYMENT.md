<!-- generated-by: gsd-doc-writer -->

# Deployment Guide: Astrobiologia.com.br

## Deployment targets

The primary deployment target is **Appwrite Sites**, which hosts the SSR build of the Nuxt 3 application.

- **Appwrite Sites**: Primary production host for the frontend.
- **Vercel**: (Optional) Alternative host for SSR or advanced features.

## Build pipeline

The build process generates a server-side rendered (SSR) bundle for **Appwrite Sites**, which supports Node.js runtimes via Nitro.

1. **Install Dependencies**:

   ```bash
   pnpm install
   ```

2. **Production Build**:
   ```bash
   pnpm build
   ```
   **Note**: The project uses the `appwrite` Nitro preset (configured in `nuxt.config.ts`). Ensure the site is configured as an **SSR** site in the Appwrite Console.

## Appwrite Sites Configuration

In the Appwrite Console for your Site, use these settings:

- **Build Command**: `pnpm build`
- **Publish Directory**: `apps/web-nuxt/.output`
- **Runtime**: `node-22` (or latest available)

### Environment setup

To ensure the build process is resilient and secure on Appwrite Cloud, we use **Dynamic Environment Variables**.

| Variable                                         | Required | Scope            | Description                                                           |
| :----------------------------------------------- | :------- | :--------------- | :-------------------------------------------------------------------- |
| `NUXT_PUBLIC_APPWRITE_ENDPOINT`                  | Yes      | Public           | Appwrite Cloud endpoint URL (e.g. `https://nyc.cloud.appwrite.io/v1`) |
| `NUXT_PUBLIC_APPWRITE_PROJECT_ID`                | Yes      | Public           | Appwrite Project ID                                                   |
| `NUXT_APPWRITE_API_KEY`                          | Yes      | Private (Secret) | Admin API Key for SSR Auth                                            |
| `NUXT_PUBLIC_DATABASE_ID`                        | Yes      | Public           | Appwrite Database ID                                                  |
| `NUXT_PUBLIC_ARTICLES_COLLECTION_ID`             | Yes      | Public           | Articles collection ID                                                |
| `NUXT_PUBLIC_ARTICLE_TRANSLATIONS_COLLECTION_ID` | Yes      | Public           | Translations collection                                               |
| `NUXT_PUBLIC_CATEGORIES_COLLECTION_ID`           | Yes      | Public           | Categories collection                                                 |
| `NUXT_PUBLIC_STORAGE_BUCKET_ID`                  | Yes      | Public           | Image storage bucket                                                  |
| `NUXT_DEEPL_API_KEY`                             | No       | Private (Secret) | [DeepL](https://www.deepl.com/pro-api) API key for translations       |

> [!IMPORTANT]
> You MUST set these variables in the **Settings > Environment Variables** section of your site in the Appwrite Console. Mark `NUXT_APPWRITE_API_KEY` as a **Secret**.

## GitHub Actions ↔ Appwrite Sites

### Appwrite Git (recommended for previews)

In **Appwrite Console → Sites → your site → Settings → Git repository**, connect this GitHub repo.
Ensure the **Root Directory** is set to `/` and the **Build Command** and **Publish Directory** match the settings above.

## Troubleshooting

### Timeout Issues

If you experience timeouts (Bad Gateway) in production:

1. Ensure `nitro.preset: 'appwrite'` is set in `nuxt.config.ts`.
2. Verify that the **Publish Directory** is set to `.output` (relative to the app directory) or `apps/web-nuxt/.output` (from root).
3. Check the **Execution Timeout** in Appwrite Settings (default 15s might be too low for some SSR pages; try increasing it if possible).
4. The application includes optimized middleware to reduce redundant API calls to Appwrite.

### Screenshot Capturing Failed

This often happens if the site is not publicly accessible or takes too long to load during the cold start. It does not necessarily mean the deployment failed.
