# Deployment Guide: Astrobiologia.com.br

## Primary Deployment: Appwrite Sites
As per the project roadmap, the primary deployment target is **Appwrite Sites**. This minimizes infrastructure management and keeps everything within the Appwrite Cloud ecosystem.

### Prerequisites
1. **Appwrite Cloud Project**: Ensure your project is created at [cloud.appwrite.io](https://cloud.appwrite.io).
2. **Database & Collections**:
   - Database ID: `69e464fb0006a1b3c4eb` (defined in `src/lib/appwrite.ts`)
   - Collections: `articles`, `categories`
3. **Storage**:
   - Bucket ID: `images`
4. **Environment Variables**:
   - `PUBLIC_APPWRITE_ENDPOINT`: `https://nyc.cloud.appwrite.io/v1`
   - `PUBLIC_APPWRITE_PROJECT_ID`: Your Appwrite Project ID

### Step 1: Build the Project
Run the build command to generate the static files:
```bash
pnpm build
```
SvelteKit will generate the output in the `.svelte-kit/output` directory (or `build` depending on the adapter).

### Step 2: Deploy to Appwrite Sites
1. Go to the **Sites** section in your Appwrite Console.
2. Create a new site.
3. Upload the contents of the build directory.
4. (Optional) Connect your custom domain `astrobiologia.com.br`.

## Alternative Deployment: Vercel
If you choose to use Vercel for SSR or advanced features:

1. **Connect Repo**: Push code to GitHub and import to Vercel.
2. **Environment Variables**:
   - Add `PUBLIC_APPWRITE_ENDPOINT`
   - Add `PUBLIC_APPWRITE_PROJECT_ID`
3. **Build Command**: `pnpm build`
4. **Output Directory**: `.svelte-kit/output` (or default for SvelteKit)

## Post-Deployment Checklist
- [ ] Test homepage loads with premium "New Scientist" aesthetics.
- [ ] Verify Appwrite connection (articles loading).
- [ ] Test Admin login at `/login`.
- [ ] Ensure images are served from Appwrite Storage.
- [ ] Check SEO meta tags and social sharing previews.

## Monitoring & Maintenance
- **Backups**: Use Appwrite's built-in data export features.
- **Analytics**: Use a privacy-focused solution like Plausible or simple Vercel Analytics if using Vercel.
- **Updates**: Monthly dependency checks with `pnpm update`.

## Development & Commit Rules

### Agent Behavior
- **SEARCH FIRST**: Exhaustively search the codebase before implementing new logic.
- **REUSE FIRST**: Prioritize extending existing patterns/utilities over creating new ones.
- **LOG CHECK**: Always verify changes by inspecting relevant logs (browser/server/CI).
- **Coding Standards**: Plan in one paragraph before coding; keep imports alphabetically sorted; keep files under 300 lines.

### Clean Code
- **Core Principles**: Follow the Boy Scout Rule; optimize for readability.
- **Functions**: Target ≤ 20 lines; do exactly one thing.
- **Error Handling**: Prefer exceptions over return codes.

### Conventional Commits
- **Format**: `<type>(<scope>): <subject>` (e.g., `feat(auth): add login flow`).
- **Subject Line**: Imperative mood, lowercase first letter, no trailing period.
- **Hard Rules**: **Never** use `git add .` or `git add -A`; one logical change per commit.
