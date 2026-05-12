# Migration Design: Appwrite → Neon + Vercel

**Date:** 2026-05-12
**Status:** Approved

## Overview

Migrate the astrobiologia Nuxt 3 site from Appwrite (database, auth, storage) to a new stack: Neon (database + auth) and Vercel (hosting + blob storage). Existing data will be migrated via a one-time script. The approach is parallel build + DNS flip: the new stack is fully validated on a Vercel preview URL before any DNS change.

## Stack

| Concern      | Before             | After                            |
| ------------ | ------------------ | -------------------------------- |
| Hosting      | Appwrite           | Vercel                           |
| Database     | Appwrite Databases | Neon PostgreSQL + Drizzle ORM    |
| Auth         | Appwrite Account   | Neon Auth (`@neondatabase/auth`) |
| File storage | Appwrite Storage   | Vercel Blob (`@vercel/blob`)     |

**Neon project region:** `aws-sa-east-1` (São Paulo — consistent with all other projects in the account).

## Architecture

The Nuxt server API layer stays structurally identical. Only the internal implementation of three server utilities changes:

- `server/utils/appwrite.ts` → **deleted**, replaced by:
  - `server/utils/db.ts` — Drizzle ORM client connected to Neon via `@neondatabase/serverless`
  - `server/utils/auth.ts` — Neon Auth server instance via `@neondatabase/auth`
  - `server/utils/storage.ts` — Vercel Blob helpers via `@vercel/blob`

All `server/api/**` handlers keep the same shape. The migration is contained to the utility layer and schema.

New supporting files:

```
db/schema.ts                          Drizzle table definitions
db/migrations/                        Drizzle migration files
scripts/migrate-from-appwrite.ts      One-time data migration script
```

## Database Schema

Three tables replace the Appwrite collections.

### `articles`

| Column               | Type                 | Notes                      |
| -------------------- | -------------------- | -------------------------- |
| `id`                 | `uuid` PK            | replaces `$id`             |
| `created_at`         | `timestamp`          | replaces `$createdAt`      |
| `updated_at`         | `timestamp`          | replaces `$updatedAt`      |
| `category`           | `text`               |                            |
| `tags`               | `text[]`             |                            |
| `featured_image`     | `text` nullable      | Vercel Blob URL            |
| `featured_image_alt` | `text` nullable      |                            |
| `status`             | `text`               | `'draft'` \| `'published'` |
| `featured`           | `boolean`            |                            |
| `author_id`          | `text`               | Neon Auth user ID          |
| `author_name`        | `text`               |                            |
| `published_at`       | `timestamp` nullable |                            |
| `og_image`           | `text` nullable      |                            |

### `article_translations`

| Column             | Type                      | Notes                  |
| ------------------ | ------------------------- | ---------------------- |
| `id`               | `uuid` PK                 |                        |
| `article_id`       | `uuid` FK → `articles.id` |                        |
| `language`         | `text`                    | e.g. `'pt-br'`, `'en'` |
| `title`            | `text`                    |                        |
| `slug`             | `text` unique             | indexed                |
| `excerpt`          | `text`                    |                        |
| `content`          | `text`                    |                        |
| `meta_title`       | `text` nullable           |                        |
| `meta_description` | `text` nullable           |                        |

### `site_settings`

Singleton row (`id = 1`).

| Column   | Type                     |
| -------- | ------------------------ |
| `id`     | `integer` PK default `1` |
| `layout` | `text`                   |

Neon Auth automatically manages a `neon_auth.users_sync` table — no manual user table needed.

## Auth (Neon Auth)

Neon Auth is powered by Better Auth and accessed via `@neondatabase/auth`.

- **Email/password** sign-in — admin only, no public sign-up
- **Google OAuth** — uses Neon's shared credentials (no Google Cloud Console setup required, even in production; consent screen shows "Continue to neon.tech" which is acceptable for admin-only use)
- Sessions managed by Neon Auth's built-in cookie handling, replacing the Appwrite `a_session_<projectId>` cookie
- `server/utils/auth.ts` exports a single `authServer` instance used by all auth API handlers
- `middleware/admin.ts` and `/api/me.get.ts` swap Appwrite session checks for Neon Auth's `getUser()` — same response shape to the frontend
- `trusted_origins` in Neon Auth config must be updated with the Vercel production URL before DNS flip

## Storage (Vercel Blob)

- `@vercel/blob` — one env var: `BLOB_READ_WRITE_TOKEN`
- `server/utils/storage.ts` exports:
  - `uploadFile(filename, buffer, contentType)` → `put()` with `access: 'public'`, returns public CDN URL
  - `getFileUrl(url)` → returns URL as-is (already a public CDN URL)
- `getImageUrl()` in the app returns the Vercel Blob CDN URL stored in the DB
- Works identically in local dev (`vercel dev`) and production

## Migration Script

`scripts/migrate-from-appwrite.ts` — runs once locally, never deployed.

**Steps:**

1. Connect to Appwrite using existing API key
2. Connect to Neon using `DATABASE_URL`
3. Export all documents from `articles` collection → insert into `articles` table
4. Export all documents from `article_translations` collection → insert into `article_translations` table
5. Export `site_settings` document → insert singleton row into `site_settings` table
6. For each article with a `featuredImage` file ID:
   - Download file from Appwrite Storage
   - Upload to Vercel Blob
   - Update `featured_image` in Neon with the new Vercel Blob URL

Appwrite `$id` values are preserved as UUIDs where possible; otherwise new UUIDs are generated and cross-references updated consistently within the script run.

## Environment Variables

| Variable                | Used by                          |
| ----------------------- | -------------------------------- |
| `DATABASE_URL`          | Drizzle / Neon serverless driver |
| `NEON_AUTH_URL`         | Neon Auth server instance        |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob                      |

Existing Appwrite env vars (`NUXT_APPWRITE_API_KEY`, `NUXT_PUBLIC_APPWRITE_*`, etc.) are removed from `nuxt.config.ts` and Vercel dashboard after migration.

## Packages

**Add:**

- `drizzle-orm`
- `drizzle-kit`
- `@neondatabase/serverless`
- `@neondatabase/auth`
- `@vercel/blob`

**Remove:**

- `node-appwrite`

## Deployment Plan (Parallel Build → DNS Flip)

1. Create new Neon project in `aws-sa-east-1`, provision Neon Auth
2. Connect GitHub repo to Vercel, set env vars in Vercel dashboard
3. Run `scripts/migrate-from-appwrite.ts` locally to seed Neon and Vercel Blob
4. Validate the full site on Vercel preview URL (articles, admin login, image uploads, search)
5. Add Vercel production URL to Neon Auth `trusted_origins`
6. Flip DNS to Vercel
7. Decommission Appwrite project

## Error Handling

- Migration script is idempotent: re-runnable if it fails midway (upsert by original `$id`)
- Old Appwrite project stays live until DNS flip — full rollback available at any point before step 6
- After DNS flip, keep Appwrite read-only for 1 week before decommissioning

## Testing

Before DNS flip, validate on the Vercel preview URL:

- [ ] Public article list, category filter, search
- [ ] Article detail page with correct translation
- [ ] Admin login (email/password + Google OAuth)
- [ ] Admin article create / edit / delete
- [ ] Image upload → visible in article
- [ ] Site settings layout switcher
- [ ] i18n locale switching
- [ ] Sitemap and robots.txt
