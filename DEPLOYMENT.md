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
| `PUBLIC_ARTICLES_COLLECTION_ID`| Yes | Public | Articles Collection ID |

> [!IMPORTANT]
> You MUST set these variables in the **Settings > Environment Variables** section of your site in the Appwrite Console. Mark `APPWRITE_API_KEY` as a **Secret**.

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
