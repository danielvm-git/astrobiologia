<!-- generated-by: gsd-doc-writer -->
# Deployment Guide: Astrobiologia.com.br

## Deployment targets
The primary deployment target is **Appwrite Sites**, which hosts the static build of the SvelteKit application. This aligns with the goal of minimizing infrastructure management by staying within the Appwrite Cloud ecosystem.

- **Appwrite Sites**: Primary production host for the frontend.
- **Vercel**: (Optional) Alternative host for SSR or advanced features.

## Build pipeline
The build process must generate a static site for compatibility with Appwrite Sites.

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```
2. **Paraglide Compilation**:
   The project uses Paraglide for i18n. Ensure messages are compiled before or during the build process:
   ```bash
   npx paraglide-js compile --project ./project.inlang
   ```
   *Note: The `paraglideVitePlugin` in `vite.config.ts` handles this automatically during `pnpm build`, but it must be present in the build environment.*

3. **Production Build**:
   ```bash
   pnpm build
   ```
   **Important**: For Appwrite Sites, the project should be configured with `@sveltejs/adapter-static`. Ensure `svelte.config.js` is updated to use the static adapter and that `prerender` is enabled for all routes.

## Environment setup
Appwrite Sites hosts static files. Consequently, all environment variables must be available at build time to be "baked into" the client-side code.

**Requirement**: Use `$env/static/public` for all public configuration. Static environment variables ensure that values are correctly bundled into the generated files for the browser. Dynamic environment variables (`$env/dynamic/public`) will not work on a static host like Appwrite Sites.

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `PUBLIC_APPWRITE_ENDPOINT` | Yes | `https://cloud.appwrite.io/v1` | Appwrite Cloud endpoint URL |
| `PUBLIC_APPWRITE_PROJECT_ID` | Yes | - | Appwrite Project ID |
| `PUBLIC_DATABASE_ID` | Yes | `69e464fb0006a1b3c4eb` | Appwrite Database ID |
| `PUBLIC_ARTICLES_COLLECTION_ID`| Yes | `articles` | Articles Collection ID |

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
