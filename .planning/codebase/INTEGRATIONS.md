# External Integrations

**Analysis Date:** 2025-05-14

## APIs & External Services

**BaaS (Backend as a Service):**
- Appwrite Cloud - Primary backend for Auth, DB, and Storage.
  - SDK/Client: `appwrite` (browser), `node-appwrite` (server)
  - Auth: `PUBLIC_APPWRITE_PROJECT_ID`, `APPWRITE_API_KEY` (server-side)

**Internationalization (i18n):**
- Paraglide-js - Compile-time i18n integration.
  - SDK/Client: `@inlang/paraglide-js`
  - Implementation: `src/lib/paraglide` (generated), `messages/` (source)

## Data Storage

**Databases:**
- Appwrite Databases (Relational Schema)
  - Connection: `PUBLIC_APPWRITE_ENDPOINT`, `PUBLIC_DATABASE_ID`
  - Collections:
    - `articles`: Master records containing metadata (category, author, status, featured).
    - `article_translations`: Localized content (title, slug, content) linked to master articles via `article_id`.
    - `categories`: (Interface defined in `src/lib/appwrite.ts`, currently static in code).

**File Storage:**
- Appwrite Storage
  - Bucket: `images` (STORAGE_BUCKET_ID)
  - Usage: Uploading and retrieving article featured images and content images.

**Caching:**
- SvelteKit native fetch caching and Appwrite CDN.

## Authentication & Identity

**Auth Provider:**
- Appwrite Auth (Custom + Social)
  - Implementation: Email/Password login and Google OAuth2.
  - Admin access controlled via session cookies (`a_session`) and `src/hooks.server.ts` guards.

## Monitoring & Observability

**Error Tracking:**
- Console logging (Standard for MVP).

**Logs:**
- Browser console and server-side logs during SSR/API handling.

## CI/CD & Deployment

**Hosting:**
- Appwrite Sites

**CI Pipeline:**
- `preflight` script in `package.json` (npm run check, test, build).

## Environment Configuration

**Required env vars:**
- `PUBLIC_APPWRITE_ENDPOINT`: Appwrite API URL
- `PUBLIC_APPWRITE_PROJECT_ID`: Project identification
- `PUBLIC_DATABASE_ID`: Main database ID
- `PUBLIC_ARTICLES_COLLECTION_ID`: Articles collection ID
- `APPWRITE_API_KEY`: Secret key for server-side admin operations

**Secrets location:**
- Managed via `.env` files (local) and Appwrite Project Settings / CI secrets.

## Webhooks & Callbacks

**Incoming:**
- `/oauth`: Redirect endpoint for Google OAuth2 callbacks.

**Outgoing:**
- None detected.

---

*Integration audit: 2025-05-14*
