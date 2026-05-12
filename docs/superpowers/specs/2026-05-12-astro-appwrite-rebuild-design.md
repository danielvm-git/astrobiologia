# Astro + Appwrite Rebuild Design

**Date:** 2026-05-12  
**Status:** Approved  
**Replaces:** Neon + Vercel migration spec (abandoned)

## Context

The existing Nuxt 3 SSR site deployed to Appwrite Sites times out on every request. Appwrite Sites has a hard 30-second timeout cap (enforced, not configurable), and Nuxt 3's Node.js SSR server cold-starts in ~35–60 seconds on the free tier's 0.5 CPU / 512 MB allocation. This is not fixable without switching frameworks.

The hybrid rendering workaround (static generation via `nuxt generate`) eliminates timeouts but breaks the admin area and produces a fully static site that cannot reflect new articles without a redeploy.

**Decision:** Rebuild the web app in Astro with `@astrojs/node` adapter. Astro renders `.astro` templates as pure HTML strings server-side — no Vue/React runtime overhead — cold-starting in ~1–2 seconds. All Appwrite backend resources (project, database, storage, auth) remain unchanged.

---

## Architecture

```
Appwrite Sites (SSR host)
  └── Astro + @astrojs/node (output: 'server')
        ├── .astro pages  — server-rendered HTML, zero JS shipped by default
        ├── React islands — client:only="react" for interactive admin UI
        ├── API routes    — src/pages/api/**/*.ts → Response objects
        ├── Middleware    — defineMiddleware → locals.user session injection
        └── i18n          — Astro built-in, 6 locales, pt-br default
```

Backend (unchanged):

- Appwrite project `69e462f20036d39192ba` (NYC region)
- Collections: `articles`, `article_translations`, `categories`, `site_settings`
- Storage bucket: `images`
- Auth: Appwrite Accounts + session cookies

---

## Pages

### Public (server-rendered, no auth required)

| Route             | Description                        |
| ----------------- | ---------------------------------- |
| `/`               | Homepage — featured articles, hero |
| `/artigos`        | Article listing with pagination    |
| `/artigos/[slug]` | Article detail                     |
| `/sobre`          | About page                         |
| `/contato`        | Contact page                       |
| `/privacidade`    | Privacy policy                     |

All public pages fetch from Appwrite using an admin client with an API key — no user session needed. Server renders full HTML; no JS sent to the browser.

### Admin (React islands, session-gated)

| Route                      | Description                       |
| -------------------------- | --------------------------------- |
| `/admin`                   | Dashboard — stats + quick actions |
| `/admin/artigos`           | Article list                      |
| `/admin/artigos/new`       | New article editor                |
| `/admin/artigos/[id]/edit` | Edit existing article             |
| `/admin/login`             | Login form                        |

Admin pages are `.astro` shells that mount React components with `client:only="react"`. Auth check runs in middleware — unauthenticated requests redirect to `/admin/login`.

### API Routes (`src/pages/api/`)

| Endpoint                   | Method         | Description                              |
| -------------------------- | -------------- | ---------------------------------------- |
| `/api/auth/login`          | POST           | Validate credentials, set session cookie |
| `/api/auth/logout`         | POST           | Delete session cookie                    |
| `/api/admin/articles`      | GET            | List articles with filters               |
| `/api/admin/articles`      | POST           | Create article                           |
| `/api/admin/articles/[id]` | GET/PUT/DELETE | Article CRUD                             |
| `/api/admin/translate`     | POST           | DeepL translation proxy                  |
| `/api/admin/redeploy`      | POST           | Trigger Appwrite Sites VCS redeployment  |
| `/api/upload`              | POST           | Image upload to Appwrite Storage         |

---

## Auth

Session pattern ported directly from the existing Nuxt implementation:

```ts
// src/lib/appwrite.ts
export const SESSION_COOKIE = `a_session_${PROJECT_ID}`;

export function createAdminClient() {
  return new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);
}

export function createSessionClient(request: Request) {
  const cookies = parse(request.headers.get("cookie") ?? "");
  const session = cookies[SESSION_COOKIE];
  if (!session) throw new Error("No session");
  return new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID)
    .setSession(session);
}
```

Middleware (`src/middleware/index.ts`):

```ts
export const onRequest = defineMiddleware(
  async ({ request, locals, redirect }, next) => {
    if (
      request.url.includes("/admin") &&
      !request.url.includes("/admin/login")
    ) {
      try {
        const { account } = createSessionClient(request);
        locals.user = await account.get();
      } catch {
        return redirect("/admin/login");
      }
    }
    return next();
  }
);
```

Session cookie set on login with `httpOnly: true`, `secure: true`, `sameSite: "strict"`, `path: "/"`.

---

## i18n

Astro built-in i18n (`astro.config.mjs`):

```js
i18n: {
  defaultLocale: "pt-br",
  locales: ["pt-br", "en", "es", "ja", "nl", "zh"],
  routing: { prefixDefaultLocale: false },
}
```

Translation strings stay in the same JSON file structure used by the Nuxt app (`public/locales/`). Articles are multilingual via `article_translations` collection — same schema, no changes needed.

---

## Data Layer

No changes to Appwrite schema. The existing collections map directly:

- `articles` — primary article record (status, category, publishedAt, authorName, coverImage)
- `article_translations` — per-locale fields (title, slug, excerpt, content, locale, articleId)
- `categories` — category taxonomy
- `site_settings` — key-value site configuration

Public pages use `createAdminClient()` (API key). Admin API routes use `createSessionClient(request)` (user session). This matches the existing pattern exactly.

---

## Styling

Tailwind CSS v4 (`@astrojs/tailwind` or direct PostCSS plugin). Same design tokens and utility classes as the current site — the visual design is not changing, only the framework rendering it.

---

## Deployment

Appwrite Sites configuration:

| Setting          | Value                             |
| ---------------- | --------------------------------- |
| Adapter          | `@astrojs/node` (standalone mode) |
| Build command    | `pnpm astro build`                |
| Output directory | `./dist`                          |
| Install command  | `pnpm install`                    |
| Start command    | `node ./dist/server/entry.mjs`    |
| Framework        | Astro                             |

Environment variables (same values as current Nuxt site):

- `APPWRITE_ENDPOINT`
- `APPWRITE_PROJECT_ID`
- `APPWRITE_API_KEY`
- `DATABASE_ID`
- `ARTICLES_COLLECTION_ID`
- `ARTICLE_TRANSLATIONS_COLLECTION_ID`
- `CATEGORIES_COLLECTION_ID`
- `STORAGE_BUCKET_ID`
- `SITE_SETTINGS_COLLECTION_ID`
- `DEEPL_API_KEY`
- `APPWRITE_SITE_ID` (for the redeploy API route)

---

## Monorepo Structure

The new app lives alongside the existing Nuxt app during transition:

```
apps/
  web-nuxt/       ← existing (frozen, kept as reference)
  web-astro/      ← new app
```

Root `package.json` scripts point to `@astrobiologia/web-astro` after cutover.

---

## Error Handling

- API routes return structured JSON errors with appropriate HTTP status codes
- Public pages show a fallback UI if Appwrite is unreachable (empty state, not 500)
- Admin API routes return 401 if session is missing/invalid
- All Appwrite SDK calls wrapped in try/catch; errors logged server-side

---

## Testing

- Unit tests for data-fetching utilities (`src/lib/`) using Vitest
- API route tests with mock Appwrite responses
- No E2E tests in first iteration (same as current site)

---

## Migration Path

1. Scaffold `apps/web-astro` with Astro + node adapter + Tailwind
2. Port Appwrite client utilities from `apps/web-nuxt/server/utils/appwrite.ts`
3. Port auth middleware
4. Build public pages (homepage, article listing, article detail)
5. Build admin API routes
6. Build admin React island components (dashboard, article editor)
7. Port i18n strings
8. Deploy to Appwrite Sites, verify cold start < 5s
9. Decommission `apps/web-nuxt`

The Nuxt app remains deployed and functional during development. Cutover happens when the Astro app passes a full manual smoke test on Appwrite Sites.
