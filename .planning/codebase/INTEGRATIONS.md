# External Integrations

**Analysis Date:** 2026-04-26

## Appwrite Cloud Platform

**Provider:** Appwrite Cloud (https://cloud.appwrite.io)

**Project Configuration:**
- Endpoint: `https://cloud.appwrite.io/v1`
- Project ID: `astrobiologia-portal` (via `PUBLIC_APPWRITE_PROJECT_ID`)

**Services Used:**

### Authentication & Sessions

**Email/Password Login:**
- Method: `account.createEmailPasswordSession(email, password)` (client SDK)
- Cookie Storage: httpOnly, Secure, SameSite
- Cookie Name: `a_session_{PROJECT_ID}` (e.g., `a_session_astrobiologia-portal`)
- Implementation: `src/lib/server/appwrite.ts` (server-side session creation)

**Google OAuth 2.0:**
- Browser Flow: `account.createOAuth2Token(OAuthProvider.Google, successUrl, failureUrl)` (client SDK)
- Success URL: `/oauth` endpoint
- Server-Side Exchange: POST to `/oauth?userId={userId}&secret={secret}`
  - Exchange happens at `src/routes/oauth/+server.ts`
  - Uses server SDK: `account.createSession({ userId, secret })`
  - Sets httpOnly cookie on success
- Redirect Target: `/admin/dashboard` (localized)
- Error Handling: Redirects to `/admin/login?error=...` on failure

**Session Cookie Pattern:**
- Uses project-specific session cookie name: `a_session_{PROJECT_ID}`
- Fallback detection: if project cookie missing, searches for any `a_session_*` cookie
- Implementation: `src/lib/server/session-cookie.ts`

### Database (Appwrite Databases)

**Database ID:** `69e464fb0006a1b3c4eb` (via `PUBLIC_DATABASE_ID`)

**Collections:**

| Collection ID | Name | Purpose |
|---|---|---|
| `articles` | Articles | Master article records (category, status, tags, dates) |
| `article_translations` | Article Translations | Translated content (title, slug, excerpt, content per language) |
| `categories` | Categories | Article categories (hardcoded in app, not retrieved from DB) |

**Access Patterns:**
- Client SDK: Read published articles, limited write via form actions
- Server SDK: Full admin CRUD for authenticated users
- Implementation: `src/lib/appwrite.ts`, `src/lib/server/appwrite.ts`

**Article Schema:**
- Master collection: category, tags, featuredImage, status (draft/published), featured flag, authorId, authorName, publishedAt, ogImage
- Translation collection: article_id (FK), language, title, slug, excerpt, content, metaTitle, metaDescription

**Queries Used:**
- `Query.equal("article_id", id)` - Find translations for article
- List/get operations for category filtering and search

### File Storage (Appwrite Storage)

**Bucket ID:** `images` (via `PUBLIC_STORAGE_BUCKET_ID`)

**Upload Endpoint:** `POST /api/upload`
- Form field: `file`
- Returns: `{ success: true, fileId, url }`
- Uses: `storage.createFile(bucketId, ID.unique(), file)` (server SDK)
- Authentication: Requires user session (401 if not authenticated)
- Implementation: `src/routes/api/upload/+server.ts`

**Image Retrieval:**
- Preview URLs: `storage.getFilePreview(bucketId, fileId, width, height)`
- Example widths: 800px (featured images), 600px (default height)
- Fallback: URLs starting with `http` are passed through directly
- Helper: `getImageUrl(fileId, width, height)` in `src/lib/appwrite.ts`

**Usage:**
- Article featured images
- Article OG images
- Admin editor image uploads

## DeepL API (Translation Service)

**Provider:** DeepL (optional integration)

**Configuration:**
- API Key: `DEEPL_API_KEY` (server-side secret)
- Tier Detection: Key ending with `:fx` indicates free tier
- Endpoint (Paid): `https://api.deepl.com/v2/translate`
- Endpoint (Free): `https://api-free.deepl.com/v2/translate`

**Usage:**
- Endpoint: `POST /api/translate` (admin-only)
- Source Language: Portuguese (`PT`)
- Target Languages: English (EN-US), Dutch, Spanish, Japanese, Chinese, Portuguese-BR
- Features:
  - HTML tag handling: `tag_handling=html` for rich text
  - Fallback: If key not configured, translation API returns 503 with `deepl_unconfigured` code
  - UI Fallback: "Copiar do inglês" (Copy from English) option for editors when DeepL is unavailable

**Request/Response:**
```typescript
POST /api/translate
Body: { text: string, targetLang: string, isHtml?: boolean }
Response: { translated: string }
OR
Response: { error: string, code?: string }
```

**Implementation:**
- Core translation logic: `src/lib/server/deepl.ts`
- API handler: `src/routes/api/translate/+server.ts`
- Language map: `pt-br` → `PT-BR`, `en` → `EN-US`, etc.

**Authentication:**
- Header: `Authorization: DeepL-Auth-Key {DEEPL_API_KEY}`
- Content-Type: `application/x-www-form-urlencoded`

## Google OAuth Configuration

**Provider:** Google Cloud Console

**OAuth Flow:**
1. User clicks "Login com Google" on `/admin/login`
2. Browser calls `account.createOAuth2Token(OAuthProvider.Google, successUrl, failureUrl)` (client SDK)
3. User authenticates at Google login page
4. Google redirects to success URL: `/oauth?userId={userId}&secret={secret}`
5. `/oauth` handler exchanges credentials for session via server SDK
6. Redirect to `/admin/dashboard` on success, `/admin/login?error=...` on failure

**Configuration Required:**
- Redirect URI in Google Console: `https://astrobiologia.appwrite.network/oauth` (or localhost for dev)
- Credential Type: OAuth 2.0 Client ID
- Project: Astrobiologia.com.br (configured in Appwrite Console under Auth Providers)

**Session Sync:**
- Appwrite client SDK and server SDK automatically sync session state
- Browser cookie set by server: `a_session_{PROJECT_ID}`
- Used for subsequent authenticated requests

## i18n & Localization (Paraglide)

**Provider:** Inlang Paraglide-JS (compile-time i18n)

**Configuration:**
- Project file: `project.inlang` (YAML/JSON)
- Compiled output: `src/lib/paraglide/` (generated at build time)
- Strategy: URL-based (`/pt-br/`, `/en/`), cookie fallback, base locale fallback
- Vite plugin: Recompiles on changes during dev

**Integration:**
- Runtime: `src/lib/paraglide/runtime`
- Helper: `localizeHref(href)` - adds locale prefix to URLs
- Used in redirects: OAuth callbacks, error handlers

**Languages Supported:**
- Portuguese (pt-br) - primary
- English (en)
- Additional: Dutch, Spanish, Japanese, Chinese (via DeepL support)

## Analytics & Logging

**Monitoring:** Not configured (None detected)

**Logging:**
- Custom logger: `src/lib/server/logger.ts`
- Console-based logging (no external service)
- Log levels: debug, info, error
- Used by: Appwrite server operations, OAuth flow, API handlers

## Health & Status Monitoring

**Health Check Endpoint:** `GET /api/health`

**Purpose:** Verify app and Appwrite connectivity

**Implementation:** `src/routes/api/health/+server.ts`

## Environment & Secrets Management

**Appwrite Project Credentials:**
- API Key: `APPWRITE_API_KEY` (server-side, never exposed to browser)
- Project ID: `PUBLIC_APPWRITE_PROJECT_ID` (public)
- Endpoint: `PUBLIC_APPWRITE_ENDPOINT` (public, defaults to Appwrite Cloud)

**Third-Party Keys:**
- DeepL API Key: `DEEPL_API_KEY` (optional, server-side)
- Google OAuth Client ID: Configured in Appwrite Console (not in .env)

**Storage Location:**
- Development: `.env.local` (gitignored)
- CI/CD: GitHub Secrets (for Appwrite Sites deployment)
- Appwrite Sites: Environment variables set in dashboard

## API Boundaries & Data Flow

### Client → Server → Appwrite

**Authenticated Requests:**
1. Browser sends request with session cookie `a_session_{PROJECT_ID}`
2. Server middleware extracts session and creates `createSessionClient(event)`
3. Server SDK uses session token to authenticate with Appwrite
4. Appwrite enforces document-level permissions based on user session
5. Response returned to client

**Example: Article Upload with Image**
```
Browser (POST /api/upload)
  → Server handler: createSessionClient(event)
  → Appwrite Storage: createFile(bucketId, ID.unique(), file)
  → Returns: fileId
  → Browser: stores fileId in article form
  
Browser (POST /admin/artigos/new)
  → Server action: createArticle({ ..., featuredImage: fileId })
  → Appwrite Databases: createDocument(DATABASE_ID, ARTICLES, ...)
  → Article created with image reference
```

### Public Content (No Auth Required)

**Read-Only Access:**
- Unauthenticated browsers can read published articles
- Client SDK used directly from browser
- Appwrite permissions restrict to published status

**Queries:**
- `Query.equal("status", "published")`
- Language-aware: returns translations for requested locale

## Deployment & Environment Configuration

**Appwrite Sites:**
- Deployment target for SvelteKit app
- Environment variables set in Appwrite Console
- Auto-scaling, HTTPS, custom domain support

**Production URL:**
- `https://astrobiologia.appwrite.network` (Appwrite Sites subdomain)
- Custom domain: `https://astrobiologia.com.br` (via CNAME)

**Build & Deploy:**
- `npm run build` generates Node.js build for adapter-node
- Appwrite Sites runs built app with Node.js runtime
- Environment variables provided by Appwrite (not in code)

---

*Integration audit: 2026-04-26*
