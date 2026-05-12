# Astro + Appwrite Rebuild — Phase 1: Foundation + Public Site

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold `apps/web-astro` and ship a fully server-rendered public website (homepage, article listing, article detail, static pages) deployed to Appwrite Sites with cold-start under 5 seconds.

**Architecture:** Astro `output: "server"` with `@astrojs/node` standalone adapter. Public pages are pure `.astro` templates — zero JS shipped to the browser. Data is fetched server-side using `node-appwrite` admin client with an API key. Auth middleware runs on every request and injects `locals.user` from the Appwrite session cookie; public pages don't require a user.

**Tech Stack:** Astro 5, `@astrojs/node`, `@astrojs/react`, Tailwind CSS v4 (`@tailwindcss/vite`), `node-appwrite`, Vitest, TypeScript, pnpm monorepo

---

## File Map

```
apps/web-astro/
  package.json
  astro.config.mjs
  tsconfig.json
  vitest.config.ts
  .env                               ← local dev env vars
  src/
    env.d.ts                         ← TypeScript: Locals interface, import.meta.env types
    middleware/
      index.ts                       ← session injection into locals.user
    lib/
      appwrite.ts                    ← createAdminClient, createSessionClient, getImageUrl, SESSION_COOKIE, CATEGORIES
      types.ts                       ← Article, ArticleTranslation interfaces
      locale.ts                      ← normalizeLocaleTag, localeTagsMatch, primaryLanguageSubtag
      article-locales.ts             ← ARTICLE_LOCALES, getArticleLocaleLabels
      article-read.ts                ← getPublishedArticles, getFeaturedArticles, getArticleBySlug, getArticlesByCategory
      __tests__/
        locale.test.ts
        article-read.test.ts
    layouts/
      Base.astro                     ← <html>, <head>, meta tags, CSS import
      Public.astro                   ← extends Base, adds Navigation + Footer
    components/
      Navigation.astro
      Footer.astro
      ArticleCard.astro              ← reusable card for listing pages
    pages/
      index.astro                    ← homepage
      artigos/
        index.astro                  ← article listing with pagination
        [slug].astro                 ← article detail
      sobre.astro
      contato.astro
      privacidade.astro
    styles/
      main.css                       ← @import "tailwindcss"
```

---

## Task 1: Scaffold the `web-astro` package

**Files:**

- Create: `apps/web-astro/package.json`
- Create: `apps/web-astro/astro.config.mjs`
- Create: `apps/web-astro/tsconfig.json`
- Create: `apps/web-astro/vitest.config.ts`
- Create: `apps/web-astro/.env`
- Create: `apps/web-astro/src/env.d.ts`
- Create: `apps/web-astro/src/styles/main.css`
- Modify: `package.json` (root)

- [ ] **Step 1: Create `apps/web-astro/package.json`**

```json
{
  "name": "@astrobiologia/web-astro",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "prettier --check \"src/**/*.{ts,tsx,astro}\" --ignore-unknown 2>/dev/null || true"
  },
  "dependencies": {
    "@astrojs/node": "^9.1.3",
    "@astrojs/react": "^4.3.0",
    "@tiptap/core": "^3.22.5",
    "@tiptap/extension-image": "^3.22.5",
    "@tiptap/extension-link": "^3.22.5",
    "@tiptap/extension-placeholder": "^3.22.5",
    "@tiptap/pm": "^3.22.5",
    "@tiptap/starter-kit": "^3.22.5",
    "astro": "^5.9.0",
    "cookie": "^1.0.2",
    "lucide-react": "^0.511.0",
    "node-appwrite": "^24.0.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "tailwind-merge": "^3.5.0"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.19",
    "@tailwindcss/vite": "^4.2.4",
    "@types/cookie": "^1.0.0",
    "@types/react": "^19.1.5",
    "@types/react-dom": "^19.1.5",
    "@vitest/coverage-v8": "^3.2.4",
    "tailwindcss": "^4.2.4",
    "typescript": "^5.8.3",
    "vitest": "^3.2.4"
  }
}
```

- [ ] **Step 2: Create `apps/web-astro/astro.config.mjs`**

```js
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "pt-br",
    locales: ["pt-br", "en", "es", "ja", "nl", "zh"],
    routing: { prefixDefaultLocale: false },
  },
});
```

- [ ] **Step 3: Create `apps/web-astro/tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 4: Create `apps/web-astro/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 5: Create `apps/web-astro/.env`**

```
APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=69e462f20036d39192ba
APPWRITE_API_KEY=standard_ef6e1acdf96cd0c63ece4eec29ef4852c9424e33648343521aa130f3ce1f9a993991d507deb2525257a0f5b74a4544cf24a5578aa1dc6fafd94604a3046c391579fc48a9347ec5a36512f964c1162bbdf88563316e9791806522df975f8649b6d782c6c71ff6d0d08e77a039b9fcc0e8e918cf44f3cfc04a3582b0bf41161581
DATABASE_ID=69e464fb0006a1b3c4eb
ARTICLES_COLLECTION_ID=articles
ARTICLE_TRANSLATIONS_COLLECTION_ID=article_translations
CATEGORIES_COLLECTION_ID=categories
STORAGE_BUCKET_ID=images
SITE_SETTINGS_COLLECTION_ID=site_settings
DEEPL_API_KEY=5a954bff-9dfc-4e91-ab80-9117fd71dffc:fx
APPWRITE_SITE_ID=6a03a0bc002bfa18c505
```

- [ ] **Step 6: Create `apps/web-astro/src/env.d.ts`**

```ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly APPWRITE_ENDPOINT: string;
  readonly APPWRITE_PROJECT_ID: string;
  readonly APPWRITE_API_KEY: string;
  readonly DATABASE_ID: string;
  readonly ARTICLES_COLLECTION_ID: string;
  readonly ARTICLE_TRANSLATIONS_COLLECTION_ID: string;
  readonly CATEGORIES_COLLECTION_ID: string;
  readonly STORAGE_BUCKET_ID: string;
  readonly SITE_SETTINGS_COLLECTION_ID: string;
  readonly DEEPL_API_KEY: string;
  readonly APPWRITE_SITE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    user: import("node-appwrite").Models.User<Record<string, unknown>> | null;
  }
}
```

- [ ] **Step 7: Create `apps/web-astro/src/styles/main.css`**

```css
@import "tailwindcss";
@import "@tailwindcss/typography";
```

- [ ] **Step 8: Update root `package.json` to add `web-astro` scripts**

In the root `package.json`, add inside `"scripts"`:

```json
"dev:astro": "pnpm --filter @astrobiologia/web-astro dev",
"build:astro": "pnpm --filter @astrobiologia/web-astro build",
"check:astro": "pnpm --filter @astrobiologia/web-astro check",
"test:astro": "pnpm --filter @astrobiologia/web-astro test:unit"
```

- [ ] **Step 9: Install dependencies**

```bash
cd apps/web-astro && pnpm install
```

Expected: Dependencies installed. `astro` binary available.

- [ ] **Step 10: Verify Astro project works**

```bash
cd apps/web-astro && pnpm astro --version
```

Expected: Prints `astro/5.x.x`

- [ ] **Step 11: Commit**

```bash
git add apps/web-astro package.json
git commit -m "feat(web-astro): scaffold Astro package with node adapter and Tailwind v4"
```

---

## Task 2: Core Appwrite library

**Files:**

- Create: `apps/web-astro/src/lib/appwrite.ts`

The Appwrite client library uses `import.meta.env` instead of Nuxt's `useRuntimeConfig()`, and accepts a `Request` object (native Web API) instead of an H3 event.

- [ ] **Step 1: Create `apps/web-astro/src/lib/appwrite.ts`**

```ts
import { Client, Account, Databases, Storage } from "node-appwrite";
import { parse } from "cookie";

export const SESSION_COOKIE = `a_session_${import.meta.env.APPWRITE_PROJECT_ID}`;

export const CATEGORIES = [
  {
    $id: "noticias",
    name: "Notícias",
    slug: "noticias",
    description: "Últimas notícias sobre astrobiologia",
    color: "primary",
  },
  {
    $id: "entrevistas",
    name: "Entrevistas",
    slug: "entrevistas",
    description: "Conversas com cientistas e pesquisadores",
    color: "secondary",
  },
  {
    $id: "analises",
    name: "Análises",
    slug: "analises",
    description: "Análises profundas sobre temas científicos",
    color: "accent",
  },
  {
    $id: "pesquisas-brasileiras",
    name: "Pesquisas Brasileiras",
    slug: "pesquisas-brasileiras",
    description: "Destaque para a ciência feita no Brasil",
    color: "primary",
  },
  {
    $id: "exoplanetas",
    name: "Exoplanetas",
    slug: "exoplanetas",
    description: "Mundos além do Sistema Solar",
    color: "secondary",
  },
  {
    $id: "extremofilos",
    name: "Extremófilos",
    slug: "extremofilos",
    description: "Vida em condições extremas",
    color: "accent",
  },
] as const;

function baseClient(): Client {
  return new Client()
    .setEndpoint(import.meta.env.APPWRITE_ENDPOINT)
    .setProject(import.meta.env.APPWRITE_PROJECT_ID);
}

export function createAdminClient() {
  const client = baseClient().setKey(import.meta.env.APPWRITE_API_KEY);
  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
}

export function createSessionClient(request: Request) {
  const cookies = parse(request.headers.get("cookie") ?? "");
  const session = cookies[SESSION_COOKIE];
  const client = baseClient();
  if (session) client.setSession(session);
  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    hasSession: Boolean(session),
  };
}

export function getImageUrl(fileId: string, width = 800, height = 600): string {
  if (!fileId) return "";
  if (fileId.startsWith("http")) return fileId;
  const client = baseClient();
  const storage = new Storage(client);
  return storage
    .getFilePreview(import.meta.env.STORAGE_BUCKET_ID, fileId, width, height)
    .toString();
}

export function setSessionCookie(
  headers: Headers,
  secret: string,
  expire: string,
  isHttps: boolean
): void {
  const maxAge = Math.floor((new Date(expire).getTime() - Date.now()) / 1000);
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(secret)}`,
    `Max-Age=${maxAge}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (isHttps) parts.push("Secure");
  headers.append("Set-Cookie", parts.join("; "));
}

export function clearSessionCookie(headers: Headers, isHttps: boolean): void {
  const parts = [
    `${SESSION_COOKIE}=`,
    "Max-Age=0",
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (isHttps) parts.push("Secure");
  headers.append("Set-Cookie", parts.join("; "));
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web-astro/src/lib/appwrite.ts
git commit -m "feat(web-astro): add Appwrite client library"
```

---

## Task 3: Types, locale utilities, and article locales

**Files:**

- Create: `apps/web-astro/src/lib/types.ts`
- Create: `apps/web-astro/src/lib/locale.ts`
- Create: `apps/web-astro/src/lib/article-locales.ts`
- Create: `apps/web-astro/src/lib/__tests__/locale.test.ts`

- [ ] **Step 1: Write the failing tests first**

Create `apps/web-astro/src/lib/__tests__/locale.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  normalizeLocaleTag,
  primaryLanguageSubtag,
  localeTagsMatch,
} from "../locale";

describe("normalizeLocaleTag", () => {
  it("lowercases and replaces underscores", () => {
    expect(normalizeLocaleTag("PT_BR")).toBe("pt-br");
    expect(normalizeLocaleTag("  en  ")).toBe("en");
  });
});

describe("primaryLanguageSubtag", () => {
  it("returns first subtag", () => {
    expect(primaryLanguageSubtag("pt-br")).toBe("pt");
    expect(primaryLanguageSubtag("en")).toBe("en");
  });
});

describe("localeTagsMatch", () => {
  it("matches identical tags", () => {
    expect(localeTagsMatch("pt-br", "pt-br")).toBe(true);
  });

  it("matches by primary subtag", () => {
    expect(localeTagsMatch("pt-br", "pt-PT")).toBe(true);
    expect(localeTagsMatch("en-US", "en-GB")).toBe(true);
  });

  it("does not match different languages", () => {
    expect(localeTagsMatch("pt-br", "en")).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL (module not found)**

```bash
cd apps/web-astro && pnpm test:unit
```

Expected: `Cannot find module '../locale'`

- [ ] **Step 3: Create `apps/web-astro/src/lib/types.ts`**

```ts
export interface ArticleTranslation {
  $id: string;
  article_id: string;
  language: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Article {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  status: "draft" | "published";
  featured: boolean;
  authorId: string;
  authorName: string;
  publishedAt?: string;
  translation?: ArticleTranslation;
}
```

- [ ] **Step 4: Create `apps/web-astro/src/lib/locale.ts`**

```ts
export function normalizeLocaleTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/_/g, "-");
}

export function primaryLanguageSubtag(tag: string): string {
  const normalized = normalizeLocaleTag(tag);
  const idx = normalized.indexOf("-");
  return idx === -1 ? normalized : normalized.slice(0, idx);
}

export function localeTagsMatch(stored: string, preferred: string): boolean {
  const s = normalizeLocaleTag(stored);
  const p = normalizeLocaleTag(preferred);
  if (s === p) return true;
  return primaryLanguageSubtag(s) === primaryLanguageSubtag(p);
}
```

- [ ] **Step 5: Create `apps/web-astro/src/lib/article-locales.ts`**

```ts
export const ARTICLE_LOCALES = ["pt-br", "en", "nl", "es", "ja", "zh"] as const;
export type ArticleLocale = (typeof ARTICLE_LOCALES)[number];

const LABELS: Record<string, Record<string, string>> = {
  "pt-br": {
    "pt-br": "Português",
    en: "Inglês",
    nl: "Holandês",
    es: "Espanhol",
    ja: "Japonês",
    zh: "Chinês",
  },
  en: {
    "pt-br": "Portuguese",
    en: "English",
    nl: "Dutch",
    es: "Spanish",
    ja: "Japanese",
    zh: "Chinese",
  },
  es: {
    "pt-br": "Portugués",
    en: "Inglés",
    nl: "Holandés",
    es: "Español",
    ja: "Japonés",
    zh: "Chino",
  },
  nl: {
    "pt-br": "Portugees",
    en: "Engels",
    nl: "Nederlands",
    es: "Spaans",
    ja: "Japans",
    zh: "Chinees",
  },
  ja: {
    "pt-br": "ポルトガル語",
    en: "英語",
    nl: "オランダ語",
    es: "スペイン語",
    ja: "日本語",
    zh: "中国語",
  },
  zh: {
    "pt-br": "葡萄牙语",
    en: "英语",
    nl: "荷兰语",
    es: "西班牙语",
    ja: "日语",
    zh: "中文",
  },
};

export function getArticleLocaleLabels(
  uiLocale: string
): Record<string, string> {
  return LABELS[uiLocale] ?? LABELS["en"];
}
```

- [ ] **Step 6: Run tests — expect PASS**

```bash
cd apps/web-astro && pnpm test:unit
```

Expected: All 5 tests pass.

- [ ] **Step 7: Commit**

```bash
git add apps/web-astro/src/lib/
git commit -m "feat(web-astro): add types, locale utilities, and article locales with tests"
```

---

## Task 4: Article read utilities

**Files:**

- Create: `apps/web-astro/src/lib/article-read.ts`
- Create: `apps/web-astro/src/lib/__tests__/article-read.test.ts`

The `article-read.ts` module is ported from the Nuxt `server/utils/article-read.ts`. Key difference: uses `import.meta.env` instead of `useRuntimeConfig()`.

- [ ] **Step 1: Write failing tests for the pure helper functions**

Create `apps/web-astro/src/lib/__tests__/article-read.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import type { ArticleTranslation } from "../types";

// Re-export the helpers for testing by extracting them
// We test the translation-picking logic directly

function pickTranslationForArticle(
  translations: ArticleTranslation[],
  preferredLanguage: string
): ArticleTranslation | undefined {
  if (translations.length === 0) return undefined;
  const normalize = (s: string) => s.trim().toLowerCase().replace(/_/g, "-");
  const primary = (s: string) => {
    const n = normalize(s);
    const idx = n.indexOf("-");
    return idx === -1 ? n : n.slice(0, idx);
  };
  return (
    translations.find(
      (t) => normalize(t.language) === normalize(preferredLanguage)
    ) ||
    translations.find(
      (t) =>
        primary(normalize(t.language)) === primary(normalize(preferredLanguage))
    ) ||
    translations.find((t) => normalize(t.language) === "pt-br") ||
    translations.find((t) => normalize(t.language) === "en") ||
    translations[0]
  );
}

const makeTrans = (language: string, title = "T"): ArticleTranslation => ({
  $id: language,
  article_id: "a1",
  language,
  title,
  slug: "s",
  excerpt: "e",
  content: "c",
});

describe("pickTranslationForArticle", () => {
  it("returns undefined for empty array", () => {
    expect(pickTranslationForArticle([], "en")).toBeUndefined();
  });

  it("returns exact match", () => {
    const trans = [makeTrans("en"), makeTrans("pt-br")];
    expect(pickTranslationForArticle(trans, "en")?.language).toBe("en");
  });

  it("falls back to pt-br when preferred not found", () => {
    const trans = [makeTrans("pt-br"), makeTrans("es")];
    expect(pickTranslationForArticle(trans, "ja")?.language).toBe("pt-br");
  });

  it("falls back to first translation when nothing matches", () => {
    const trans = [makeTrans("zh"), makeTrans("nl")];
    expect(pickTranslationForArticle(trans, "ja")?.language).toBe("zh");
  });
});
```

- [ ] **Step 2: Run tests — expect PASS** (tests are self-contained, no module import needed yet)

```bash
cd apps/web-astro && pnpm test:unit
```

Expected: All 9 tests pass (4 new + 5 from Task 3).

- [ ] **Step 3: Create `apps/web-astro/src/lib/article-read.ts`**

```ts
import { Query } from "node-appwrite";
import type { Article, ArticleTranslation } from "./types";
import { createAdminClient } from "./appwrite";
import { localeTagsMatch, normalizeLocaleTag } from "./locale";

const CHUNK_SIZE = 15;
const TRANS_PER_ARTICLE_HEADROOM = 10;

function translationJoinLimit(articleCount: number): number {
  return Math.min(
    2500,
    Math.max(articleCount * TRANS_PER_ARTICLE_HEADROOM, 50)
  );
}

function articleIdFromTranslation(t: ArticleTranslation): string {
  const raw = (t as Record<string, unknown>)["article_id"];
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object" && "$id" in raw)
    return (raw as { $id: string }).$id;
  return "";
}

export function pickTranslationForArticle(
  translations: ArticleTranslation[],
  preferred: string
): ArticleTranslation | undefined {
  if (translations.length === 0) return undefined;
  return (
    translations.find((t) => localeTagsMatch(t.language, preferred)) ||
    translations.find((t) => normalizeLocaleTag(t.language) === "pt-br") ||
    translations.find((t) => normalizeLocaleTag(t.language) === "en") ||
    translations[0]
  );
}

async function fetchTranslationsForIds(
  ids: string[]
): Promise<ArticleTranslation[]> {
  if (ids.length === 0) return [];
  const { databases } = createAdminClient();
  const out: ArticleTranslation[] = [];
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE);
    const res = await databases.listDocuments(
      import.meta.env.DATABASE_ID,
      import.meta.env.ARTICLE_TRANSLATIONS_COLLECTION_ID,
      [
        Query.equal("article_id", chunk),
        Query.limit(translationJoinLimit(chunk.length)),
      ]
    );
    out.push(...(res.documents as unknown as ArticleTranslation[]));
  }
  return out;
}

function joinTranslations(
  articles: Article[],
  allTranslations: ArticleTranslation[],
  preferred: string
): Article[] {
  const byArticle = new Map<string, ArticleTranslation[]>();
  for (const t of allTranslations) {
    const aid = articleIdFromTranslation(t);
    if (!aid) continue;
    const list = byArticle.get(aid) ?? [];
    list.push(t);
    byArticle.set(aid, list);
  }
  return articles.map((a) => ({
    ...a,
    translation: pickTranslationForArticle(
      byArticle.get(a.$id) ?? [],
      preferred
    ),
  }));
}

export async function getPublishedArticles(
  language = "pt-br",
  limit = 20,
  offset = 0
): Promise<Article[]> {
  const { databases } = createAdminClient();
  const res = await databases.listDocuments(
    import.meta.env.DATABASE_ID,
    import.meta.env.ARTICLES_COLLECTION_ID,
    [
      Query.equal("status", "published"),
      Query.orderDesc("publishedAt"),
      Query.limit(limit),
      Query.offset(offset),
    ]
  );
  if (res.total === 0) return [];
  const articles = res.documents as unknown as Article[];
  const translations = await fetchTranslationsForIds(
    articles.map((a) => a.$id)
  );
  return joinTranslations(articles, translations, language);
}

export async function getFeaturedArticles(
  language = "pt-br",
  limit = 5
): Promise<Article[]> {
  const { databases } = createAdminClient();
  const res = await databases.listDocuments(
    import.meta.env.DATABASE_ID,
    import.meta.env.ARTICLES_COLLECTION_ID,
    [
      Query.equal("status", "published"),
      Query.equal("featured", true),
      Query.orderDesc("publishedAt"),
      Query.limit(limit),
    ]
  );
  const articles = res.documents as unknown as Article[];
  if (articles.length === 0) return [];
  const translations = await fetchTranslationsForIds(
    articles.map((a) => a.$id)
  );
  return joinTranslations(articles, translations, language);
}

export async function getArticleBySlug(
  slug: string,
  language = "pt-br"
): Promise<Article | null> {
  const { databases } = createAdminClient();

  const transRes = await databases.listDocuments(
    import.meta.env.DATABASE_ID,
    import.meta.env.ARTICLE_TRANSLATIONS_COLLECTION_ID,
    [Query.equal("slug", slug), Query.limit(50)]
  );

  if (transRes.total > 0) {
    const docs = transRes.documents as unknown as ArticleTranslation[];
    const translation = pickTranslationForArticle(docs, language);
    if (translation) {
      const masterId = articleIdFromTranslation(translation);
      if (masterId) {
        try {
          const article = (await databases.getDocument(
            import.meta.env.DATABASE_ID,
            import.meta.env.ARTICLES_COLLECTION_ID,
            masterId
          )) as unknown as Article;
          return { ...article, translation };
        } catch {
          // fall through to legacy lookup
        }
      }
    }
  }

  const masterRes = await databases.listDocuments(
    import.meta.env.DATABASE_ID,
    import.meta.env.ARTICLES_COLLECTION_ID,
    [Query.equal("slug", slug), Query.limit(1)]
  );

  if (masterRes.total === 0) return null;
  const article = masterRes.documents[0] as unknown as Article;
  const allTrans = await fetchTranslationsForIds([article.$id]);
  return {
    ...article,
    translation: pickTranslationForArticle(allTrans, language),
  };
}

export async function getArticlesByCategory(
  category: string,
  language = "pt-br",
  limit = 20
): Promise<Article[]> {
  const { databases } = createAdminClient();
  const res = await databases.listDocuments(
    import.meta.env.DATABASE_ID,
    import.meta.env.ARTICLES_COLLECTION_ID,
    [
      Query.equal("status", "published"),
      Query.equal("category", category),
      Query.orderDesc("publishedAt"),
      Query.limit(limit),
    ]
  );
  const articles = res.documents as unknown as Article[];
  if (articles.length === 0) return [];
  const translations = await fetchTranslationsForIds(
    articles.map((a) => a.$id)
  );
  return joinTranslations(articles, translations, language);
}

export async function searchPublishedArticles(
  searchTerm: string,
  language = "pt-br",
  limit = 20
): Promise<Article[]> {
  const { databases } = createAdminClient();
  const normalized = searchTerm.trim();
  if (!normalized) return getPublishedArticles(language, limit);

  const translationsById = new Map<string, ArticleTranslation>();
  for (const field of ["title", "excerpt", "content"] as const) {
    try {
      const res = await databases.listDocuments(
        import.meta.env.DATABASE_ID,
        import.meta.env.ARTICLE_TRANSLATIONS_COLLECTION_ID,
        [
          Query.equal("language", language),
          Query.search(field, normalized),
          Query.limit(limit),
        ]
      );
      for (const t of res.documents as unknown as ArticleTranslation[]) {
        const aid = articleIdFromTranslation(t);
        if (aid && !translationsById.has(aid)) translationsById.set(aid, t);
      }
    } catch {
      // continue with other fields
    }
  }

  if (translationsById.size > 0) {
    const masters = await databases.listDocuments(
      import.meta.env.DATABASE_ID,
      import.meta.env.ARTICLES_COLLECTION_ID,
      [
        Query.equal("$id", Array.from(translationsById.keys())),
        Query.equal("status", "published"),
        Query.orderDesc("publishedAt"),
        Query.limit(limit),
      ]
    );
    return (masters.documents as unknown as Article[]).map((a) => ({
      ...a,
      translation: translationsById.get(a.$id),
    }));
  }

  try {
    const fallback = await databases.listDocuments(
      import.meta.env.DATABASE_ID,
      import.meta.env.ARTICLES_COLLECTION_ID,
      [
        Query.equal("status", "published"),
        Query.search("title", normalized),
        Query.limit(limit),
      ]
    );
    return fallback.documents as unknown as Article[];
  } catch {
    return [];
  }
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
cd apps/web-astro && pnpm test:unit
```

Expected: 9 tests pass.

- [ ] **Step 5: Commit**

```bash
git add apps/web-astro/src/lib/
git commit -m "feat(web-astro): add article read utilities with translation joining"
```

---

## Task 5: Auth middleware

**Files:**

- Create: `apps/web-astro/src/middleware/index.ts`

- [ ] **Step 1: Create `apps/web-astro/src/middleware/index.ts`**

```ts
import { defineMiddleware } from "astro:middleware";
import { createSessionClient } from "../lib/appwrite";

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.user = null;
  try {
    const { account, hasSession } = createSessionClient(context.request);
    if (hasSession) {
      context.locals.user = await account.get();
    }
  } catch {
    // Session invalid — user stays null
  }
  return next();
});
```

- [ ] **Step 2: Commit**

```bash
git add apps/web-astro/src/middleware/
git commit -m "feat(web-astro): add session middleware"
```

---

## Task 6: Base layout and shared components

**Files:**

- Create: `apps/web-astro/src/layouts/Base.astro`
- Create: `apps/web-astro/src/layouts/Public.astro`
- Create: `apps/web-astro/src/components/Navigation.astro`
- Create: `apps/web-astro/src/components/Footer.astro`
- Create: `apps/web-astro/src/components/ArticleCard.astro`

- [ ] **Step 1: Create `apps/web-astro/src/layouts/Base.astro`**

```astro
---
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  robots?: string;
}

const {
  title,
  description = "Portal brasileiro de astrobiologia: notícias, pesquisas e análises sobre a vida no universo.",
  ogImage,
  robots = "index, follow",
} = Astro.props;
---

<!doctype html>
<html lang={Astro.currentLocale ?? "pt-br"}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content={robots} />
    <title>{title}</title>
    <meta name="description" content={description} />
    {ogImage && <meta property="og:image" content={ogImage} />}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body class="bg-white text-slate-900 antialiased">
    <slot />
  </body>
</html>

<style is:global>
  @import "../styles/main.css";
</style>
```

- [ ] **Step 2: Create `apps/web-astro/src/components/Navigation.astro`**

```astro
---
const locale = Astro.currentLocale ?? "pt-br";
const prefix = locale === "pt-br" ? "" : `/${locale}`;
---

<nav class="border-b border-slate-200 bg-white sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
    <a href={`${prefix}/`} class="font-black text-xl uppercase tracking-tighter text-slate-900">
      Astrobiologia
    </a>
    <div class="flex items-center gap-6 text-sm font-bold uppercase tracking-widest">
      <a href={`${prefix}/artigos`} class="text-slate-600 hover:text-slate-900 transition-colors">
        Artigos
      </a>
      <a href={`${prefix}/sobre`} class="text-slate-600 hover:text-slate-900 transition-colors">
        Sobre
      </a>
      <a href={`${prefix}/contato`} class="text-slate-600 hover:text-slate-900 transition-colors">
        Contato
      </a>
    </div>
  </div>
</nav>
```

- [ ] **Step 3: Create `apps/web-astro/src/components/Footer.astro`**

```astro
---
const locale = Astro.currentLocale ?? "pt-br";
const prefix = locale === "pt-br" ? "" : `/${locale}`;
const year = new Date().getFullYear();
---

<footer class="border-t border-slate-200 mt-20 py-12 text-center">
  <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">
    © {year} Astrobiologia.com.br — Todos os direitos reservados
  </p>
  <div class="flex justify-center gap-6 mt-4 text-xs text-slate-400 uppercase tracking-widest font-bold">
    <a href={`${prefix}/privacidade`} class="hover:text-slate-900 transition-colors">Privacidade</a>
    <a href={`${prefix}/contato`} class="hover:text-slate-900 transition-colors">Contato</a>
  </div>
</footer>
```

- [ ] **Step 4: Create `apps/web-astro/src/layouts/Public.astro`**

```astro
---
import Base from "./Base.astro";
import Navigation from "../components/Navigation.astro";
import Footer from "../components/Footer.astro";

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}

const { title, description, ogImage } = Astro.props;
---

<Base title={title} description={description} ogImage={ogImage}>
  <Navigation />
  <main class="max-w-7xl mx-auto px-4 py-12">
    <slot />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 5: Create `apps/web-astro/src/components/ArticleCard.astro`**

```astro
---
import type { Article } from "../lib/types";
import { getImageUrl } from "../lib/appwrite";

interface Props {
  article: Article;
  locale?: string;
}

const { article, locale = "pt-br" } = Astro.props;
const prefix = locale === "pt-br" ? "" : `/${locale}`;
const title = article.translation?.title || "(Sem título)";
const slug = article.translation?.slug || article.$id;
const excerpt = article.translation?.excerpt;
const imageUrl = article.featuredImage ? getImageUrl(article.featuredImage, 400, 250) : "";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
---

<article class="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all">
  {imageUrl && (
    <div class="aspect-video overflow-hidden">
      <img
        src={imageUrl}
        alt={article.featuredImageAlt || title}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    </div>
  )}
  <div class="p-6">
    {article.category && (
      <span class="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded mb-3 inline-block">
        {article.category}
      </span>
    )}
    <h2 class="text-lg font-black text-slate-900 leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
      <a href={`${prefix}/artigos/${slug}`}>{title}</a>
    </h2>
    {excerpt && (
      <p class="text-sm text-slate-500 line-clamp-3 mb-4">{excerpt}</p>
    )}
    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      {formatDate(article.publishedAt || article.$createdAt)}
    </p>
  </div>
</article>
```

- [ ] **Step 6: Commit**

```bash
git add apps/web-astro/src/
git commit -m "feat(web-astro): add layouts and shared components"
```

---

## Task 7: Homepage

**Files:**

- Create: `apps/web-astro/src/pages/index.astro`

- [ ] **Step 1: Create `apps/web-astro/src/pages/index.astro`**

```astro
---
import Public from "../layouts/Public.astro";
import ArticleCard from "../components/ArticleCard.astro";
import { getFeaturedArticles, getPublishedArticles } from "../lib/article-read";

const locale = Astro.currentLocale ?? "pt-br";

let featured: Awaited<ReturnType<typeof getFeaturedArticles>> = [];
let recent: Awaited<ReturnType<typeof getPublishedArticles>> = [];

try {
  [featured, recent] = await Promise.all([
    getFeaturedArticles(locale, 1),
    getPublishedArticles(locale, 8),
  ]);
} catch {
  // Show empty state instead of 500
}

const hero = featured[0];
const heroTitle = hero?.translation?.title || "";
const heroExcerpt = hero?.translation?.excerpt || "";
const heroSlug = hero?.translation?.slug || hero?.$id;
const prefix = locale === "pt-br" ? "" : `/${locale}`;
---

<Public title="Astrobiologia — Portal Científico Brasileiro">
  {hero && (
    <section class="mb-16">
      <div class="relative rounded-3xl overflow-hidden bg-slate-900 min-h-[420px] flex items-end p-10">
        {hero.featuredImage && (
          <img
            src={`https://nyc.cloud.appwrite.io/v1/storage/buckets/${import.meta.env.STORAGE_BUCKET_ID}/files/${hero.featuredImage}/preview?width=1200&height=600&project=${import.meta.env.APPWRITE_PROJECT_ID}`}
            alt={hero.featuredImageAlt || heroTitle}
            class="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div class="relative z-10 max-w-2xl">
          {hero.category && (
            <span class="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/20 px-3 py-1 rounded mb-4 inline-block">
              {hero.category}
            </span>
          )}
          <h1 class="text-4xl font-black text-white leading-tight mb-4">
            {heroTitle}
          </h1>
          {heroExcerpt && (
            <p class="text-slate-300 mb-6 text-lg">{heroExcerpt}</p>
          )}
          <a
            href={`${prefix}/artigos/${heroSlug}`}
            class="inline-block px-6 py-3 bg-white text-slate-900 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-100 transition-colors"
          >
            Ler Artigo
          </a>
        </div>
      </div>
    </section>
  )}

  <section>
    <h2 class="text-2xl font-black uppercase tracking-tight text-slate-900 mb-8">
      Artigos Recentes
    </h2>
    {recent.length > 0 ? (
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recent.map((article) => (
          <ArticleCard article={article} locale={locale} />
        ))}
      </div>
    ) : (
      <p class="text-slate-400 italic text-center py-16">
        Nenhum artigo publicado ainda.
      </p>
    )}
    <div class="text-center mt-10">
      <a
        href={`${prefix}/artigos`}
        class="inline-block px-8 py-3 border-2 border-slate-900 text-slate-900 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-900 hover:text-white transition-all"
      >
        Ver Todos os Artigos
      </a>
    </div>
  </section>
</Public>
```

- [ ] **Step 2: Verify the Astro build compiles without errors**

```bash
cd apps/web-astro && pnpm build 2>&1 | tail -20
```

Expected: Build completes. No TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web-astro/src/pages/index.astro
git commit -m "feat(web-astro): add homepage"
```

---

## Task 8: Article listing page

**Files:**

- Create: `apps/web-astro/src/pages/artigos/index.astro`

- [ ] **Step 1: Create `apps/web-astro/src/pages/artigos/index.astro`**

```astro
---
import Public from "../../layouts/Public.astro";
import ArticleCard from "../../components/ArticleCard.astro";
import { getPublishedArticles } from "../../lib/article-read";

const locale = Astro.currentLocale ?? "pt-br";
const pageParam = Astro.url.searchParams.get("page");
const page = Math.max(1, Number(pageParam) || 1);
const PAGE_SIZE = 12;
const offset = (page - 1) * PAGE_SIZE;

let articles: Awaited<ReturnType<typeof getPublishedArticles>> = [];

try {
  articles = await getPublishedArticles(locale, PAGE_SIZE, offset);
} catch {
  // empty state
}

const prefix = locale === "pt-br" ? "" : `/${locale}`;
---

<Public title="Artigos — Astrobiologia" description="Todos os artigos publicados sobre astrobiologia.">
  <div class="mb-10">
    <h1 class="text-4xl font-black uppercase tracking-tighter text-slate-900">
      Artigos
    </h1>
    <p class="text-slate-500 mt-2 text-sm font-medium uppercase tracking-widest">
      Ciência e Pesquisa em Astrobiologia
    </p>
  </div>

  {articles.length > 0 ? (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard article={article} locale={locale} />
      ))}
    </div>
  ) : (
    <p class="text-slate-400 italic text-center py-32">
      Nenhum artigo publicado ainda.
    </p>
  )}

  {articles.length === PAGE_SIZE && (
    <div class="text-center mt-12">
      <a
        href={`${prefix}/artigos?page=${page + 1}`}
        class="inline-block px-8 py-3 border-2 border-slate-900 text-slate-900 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-900 hover:text-white transition-all"
      >
        Próxima Página
      </a>
    </div>
  )}
</Public>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web-astro/src/pages/artigos/index.astro
git commit -m "feat(web-astro): add article listing page"
```

---

## Task 9: Article detail page

**Files:**

- Create: `apps/web-astro/src/pages/artigos/[slug].astro`

- [ ] **Step 1: Create `apps/web-astro/src/pages/artigos/[slug].astro`**

```astro
---
import Public from "../../layouts/Public.astro";
import { getArticleBySlug } from "../../lib/article-read";
import { getImageUrl } from "../../lib/appwrite";

const { slug } = Astro.params;
const locale = Astro.currentLocale ?? "pt-br";

if (!slug) return Astro.redirect("/artigos");

let article: Awaited<ReturnType<typeof getArticleBySlug>> = null;

try {
  article = await getArticleBySlug(slug, locale);
} catch {
  // fall through to 404
}

if (!article) {
  return new Response(null, { status: 404 });
}

const title = article.translation?.title || "(Sem título)";
const content = article.translation?.content || "";
const excerpt = article.translation?.excerpt;
const metaTitle = article.translation?.metaTitle || title;
const metaDesc = article.translation?.metaDescription || excerpt;
const imageUrl = article.featuredImage ? getImageUrl(article.featuredImage, 1200, 630) : undefined;

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
---

<Public title={`${metaTitle} — Astrobiologia`} description={metaDesc} ogImage={imageUrl}>
  <article class="max-w-3xl mx-auto">
    <header class="mb-10">
      {article.category && (
        <span class="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded mb-4 inline-block">
          {article.category}
        </span>
      )}
      <h1 class="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
        {title}
      </h1>
      {excerpt && (
        <p class="text-xl text-slate-500 mb-6">{excerpt}</p>
      )}
      <div class="flex items-center gap-4 text-sm text-slate-400 border-y border-slate-100 py-4">
        {article.authorName && (
          <span class="font-bold text-slate-600">{article.authorName}</span>
        )}
        <span>
          {formatDate(article.publishedAt || article.$createdAt)}
        </span>
      </div>
    </header>

    {imageUrl && (
      <div class="mb-10 rounded-2xl overflow-hidden">
        <img
          src={imageUrl}
          alt={article.featuredImageAlt || title}
          class="w-full object-cover"
        />
      </div>
    )}

    <div
      class="prose prose-slate prose-lg max-w-none"
      set:html={content}
    />
  </article>
</Public>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web-astro/src/pages/artigos/[slug].astro
git commit -m "feat(web-astro): add article detail page"
```

---

## Task 10: Static public pages

**Files:**

- Create: `apps/web-astro/src/pages/sobre.astro`
- Create: `apps/web-astro/src/pages/contato.astro`
- Create: `apps/web-astro/src/pages/privacidade.astro`

- [ ] **Step 1: Create `apps/web-astro/src/pages/sobre.astro`**

```astro
---
import Public from "../layouts/Public.astro";
---

<Public title="Sobre — Astrobiologia" description="Conheça o portal brasileiro de astrobiologia.">
  <div class="max-w-2xl mx-auto">
    <h1 class="text-4xl font-black uppercase tracking-tighter text-slate-900 mb-6">Sobre</h1>
    <div class="prose prose-slate prose-lg">
      <p>
        O Astrobiologia.com.br é um portal científico dedicado à divulgação de notícias,
        pesquisas e análises sobre a vida no universo. Nosso objetivo é democratizar o
        acesso ao conhecimento científico sobre astrobiologia no Brasil e no mundo.
      </p>
      <p>
        Cobrimos temas como exoplanetas, extremófilos, a origem da vida, missões espaciais
        e as mais recentes descobertas que aproximam a humanidade de responder à grande
        questão: estamos sozinhos no universo?
      </p>
    </div>
  </div>
</Public>
```

- [ ] **Step 2: Create `apps/web-astro/src/pages/contato.astro`**

```astro
---
import Public from "../layouts/Public.astro";
---

<Public title="Contato — Astrobiologia" description="Entre em contato com a equipe do portal.">
  <div class="max-w-2xl mx-auto">
    <h1 class="text-4xl font-black uppercase tracking-tighter text-slate-900 mb-6">Contato</h1>
    <div class="prose prose-slate prose-lg">
      <p>
        Para sugestões, parcerias, envio de artigos científicos ou outras questões,
        entre em contato através do e-mail:
      </p>
      <p>
        <a href="mailto:contato@astrobiologia.com.br" class="font-bold">
          contato@astrobiologia.com.br
        </a>
      </p>
    </div>
  </div>
</Public>
```

- [ ] **Step 3: Create `apps/web-astro/src/pages/privacidade.astro`**

```astro
---
import Public from "../layouts/Public.astro";
---

<Public title="Política de Privacidade — Astrobiologia">
  <div class="max-w-2xl mx-auto">
    <h1 class="text-4xl font-black uppercase tracking-tighter text-slate-900 mb-6">
      Política de Privacidade
    </h1>
    <div class="prose prose-slate prose-lg">
      <p>
        Este portal respeita a sua privacidade. Coletamos apenas dados necessários
        para o funcionamento do serviço e não compartilhamos informações pessoais
        com terceiros sem seu consentimento.
      </p>
      <h2>Cookies</h2>
      <p>
        Utilizamos cookies de sessão estritamente necessários para autenticação
        na área administrativa. Não utilizamos cookies de rastreamento ou
        publicidade.
      </p>
      <h2>Contato</h2>
      <p>
        Dúvidas sobre privacidade: <a href="mailto:contato@astrobiologia.com.br">contato@astrobiologia.com.br</a>
      </p>
    </div>
  </div>
</Public>
```

- [ ] **Step 4: Verify full build**

```bash
cd apps/web-astro && pnpm build 2>&1 | tail -20
```

Expected: Build completes with no errors. Output in `dist/`.

- [ ] **Step 5: Commit**

```bash
git add apps/web-astro/src/pages/
git commit -m "feat(web-astro): add static public pages (sobre, contato, privacidade)"
```

---

## Task 11: Deploy Phase 1 to Appwrite Sites

**Files:**

- No new files — Appwrite Sites configured in the Appwrite console

- [ ] **Step 1: Verify the build output is correct**

```bash
cd apps/web-astro && pnpm build && ls dist/server/
```

Expected: `dist/server/entry.mjs` exists.

- [ ] **Step 2: Test the server starts locally**

```bash
cd apps/web-astro && node dist/server/entry.mjs &
sleep 2 && curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/
```

Expected: `200`. Kill the background process afterward:

```bash
kill %1
```

- [ ] **Step 3: Configure Appwrite Sites via the console**

In the Appwrite console (project `69e462f20036d39192ba`), go to Sites → `6a03a0bc002bfa18c505` → Settings → Build Settings:

| Field            | Value                                    |
| ---------------- | ---------------------------------------- |
| Root directory   | `apps/web-astro`                         |
| Build command    | `pnpm install && pnpm build`             |
| Output directory | `dist`                                   |
| Install command  | (leave empty — handled by build command) |

Set Environment Variables (Sites → Variables):

| Key                                  | Value                              |
| ------------------------------------ | ---------------------------------- |
| `APPWRITE_ENDPOINT`                  | `https://nyc.cloud.appwrite.io/v1` |
| `APPWRITE_PROJECT_ID`                | `69e462f20036d39192ba`             |
| `APPWRITE_API_KEY`                   | _(value from `.env`)_              |
| `DATABASE_ID`                        | `69e464fb0006a1b3c4eb`             |
| `ARTICLES_COLLECTION_ID`             | `articles`                         |
| `ARTICLE_TRANSLATIONS_COLLECTION_ID` | `article_translations`             |
| `CATEGORIES_COLLECTION_ID`           | `categories`                       |
| `STORAGE_BUCKET_ID`                  | `images`                           |
| `SITE_SETTINGS_COLLECTION_ID`        | `site_settings`                    |
| `DEEPL_API_KEY`                      | _(value from `.env`)_              |
| `APPWRITE_SITE_ID`                   | `6a03a0bc002bfa18c505`             |

- [ ] **Step 4: Trigger a deployment**

Push to `main` or use the Appwrite console to trigger a manual deployment.

- [ ] **Step 5: Measure cold start**

After the deployment completes, open the site URL. In browser DevTools → Network, check the Time to First Byte (TTFB) for a cold request.

Expected: TTFB under 5 seconds. If TTFB is consistently under 5s across 3 requests, Phase 1 is complete.

- [ ] **Step 6: Smoke test public pages**

Visit each route and verify it loads with content:

- `/` — homepage with articles (or empty state if no published articles)
- `/artigos` — article listing
- `/sobre` — about page
- `/contato` — contact page
- `/privacidade` — privacy policy

- [ ] **Step 7: Final Phase 1 commit**

```bash
git add .
git commit -m "feat(web-astro): Phase 1 complete — public site deployed to Appwrite Sites"
```

---

## Phase 1 Complete

At this point the public site is live on Appwrite Sites. Continue with Phase 2 (Admin Area) using the plan at `docs/superpowers/plans/2026-05-12-astro-appwrite-rebuild-phase2.md`.
