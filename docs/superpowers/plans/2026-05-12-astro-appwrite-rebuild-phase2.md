# Astro + Appwrite Rebuild — Phase 2: Admin Area

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the admin area to `apps/web-astro` — auth, article CRUD, translation, image upload, and redeploy — replacing the Nuxt admin interface.

**Architecture:** Admin pages are `.astro` shells that mount React islands with `client:only="react"`. API routes in `src/pages/api/` return `Response` objects. Auth is enforced in the shared middleware (already in place from Phase 1) — admin API routes additionally check `locals.user` on the server. The React islands call these API routes via `fetch`.

**Prerequisites:** Phase 1 must be complete. `src/middleware/index.ts`, `src/lib/appwrite.ts`, and `src/lib/types.ts` are already in place.

**Tech Stack:** Astro API routes, React 19, Tiptap v3, Lucide React, `node-appwrite`, DeepL API, Tailwind CSS v4

---

## File Map

```
apps/web-astro/src/
  pages/
    api/
      auth/
        login.ts                  ← POST: email+password → session cookie
        logout.ts                 ← POST: clear session cookie
      admin/
        articles/
          index.ts                ← GET: list articles; POST: create article
          [id].ts                 ← GET / PUT / DELETE article by id
        dashboard.ts              ← GET: stats (total, published, draft, categories)
        translate.ts              ← POST: DeepL proxy
        redeploy.ts               ← POST: trigger Appwrite Sites VCS deployment
      upload.ts                   ← POST: upload image to Appwrite Storage
    admin/
      login.astro                 ← Login page shell
      index.astro                 ← Dashboard shell
      artigos/
        index.astro               ← Article list shell
        new.astro                 ← New article shell
        [id]/
          edit.astro              ← Edit article shell
  layouts/
    Admin.astro                   ← Admin shell (sidebar + topbar, no nav/footer)
  components/
    admin/
      LoginForm.tsx               ← React island: email/password form
      Dashboard.tsx               ← React island: stats cards + recent articles + quick actions
      ArticleList.tsx             ← React island: sortable article table with edit/delete
      ArticleEditor.tsx           ← React island: Tiptap editor + metadata + translation tabs
```

---

## Task 1: Auth API routes (login + logout)

**Files:**

- Create: `apps/web-astro/src/pages/api/auth/login.ts`
- Create: `apps/web-astro/src/pages/api/auth/logout.ts`

- [ ] **Step 1: Create `apps/web-astro/src/pages/api/auth/login.ts`**

```ts
import type { APIRoute } from "astro";
import { createAdminClient, setSessionCookie } from "../../../lib/appwrite";

export const POST: APIRoute = async ({ request }) => {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { email, password } = body;
  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { account } = createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    const isHttps =
      request.headers.get("x-forwarded-proto") === "https" ||
      new URL(request.url).protocol === "https:";
    const headers = new Headers({ "Content-Type": "application/json" });
    setSessionCookie(headers, session.secret, session.expire, isHttps);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers,
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
};
```

- [ ] **Step 2: Create `apps/web-astro/src/pages/api/auth/logout.ts`**

```ts
import type { APIRoute } from "astro";
import { clearSessionCookie, createSessionClient } from "../../../lib/appwrite";

export const POST: APIRoute = async ({ request }) => {
  const isHttps =
    request.headers.get("x-forwarded-proto") === "https" ||
    new URL(request.url).protocol === "https:";

  try {
    const { account } = createSessionClient(request);
    await account.deleteSession("current");
  } catch {
    // Session already invalid — still clear the cookie
  }

  const headers = new Headers({ "Content-Type": "application/json" });
  clearSessionCookie(headers, isHttps);
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers,
  });
};
```

- [ ] **Step 3: Verify build compiles**

```bash
cd apps/web-astro && pnpm build 2>&1 | grep -E "error|Error" | head -20
```

Expected: No TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web-astro/src/pages/api/auth/
git commit -m "feat(web-astro): add auth API routes (login, logout)"
```

---

## Task 2: Admin article API routes

**Files:**

- Create: `apps/web-astro/src/pages/api/admin/articles/index.ts`
- Create: `apps/web-astro/src/pages/api/admin/articles/[id].ts`

- [ ] **Step 1: Create `apps/web-astro/src/pages/api/admin/articles/index.ts`**

Handles `GET /api/admin/articles` (list) and `POST /api/admin/articles` (create).

```ts
import type { APIRoute } from "astro";
import { ID, Query } from "node-appwrite";
import { createSessionClient } from "../../../../lib/appwrite";
import { ARTICLE_LOCALES } from "../../../../lib/article-locales";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async ({ locals, request }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  const { databases } = createSessionClient(request);
  const DB = import.meta.env.DATABASE_ID;
  const ARTICLES = import.meta.env.ARTICLES_COLLECTION_ID;
  const TRANS = import.meta.env.ARTICLE_TRANSLATIONS_COLLECTION_ID;

  const response = await databases.listDocuments(DB, ARTICLES, [
    Query.orderDesc("$createdAt"),
    Query.limit(100),
  ]);

  const articleIds = response.documents.map((d) => d.$id);
  const allTrans: Array<{
    article_id: string;
    language: string;
    title?: string;
    slug?: string;
  }> = [];

  if (articleIds.length > 0) {
    const BATCH = 200;
    let lastId: string | null = null;
    for (;;) {
      const queries = [
        Query.equal("article_id", articleIds),
        Query.orderAsc("$id"),
        Query.limit(BATCH),
      ];
      if (lastId) queries.push(Query.cursorAfter(lastId));
      const page = await databases.listDocuments(DB, TRANS, queries);
      if (page.documents.length === 0) break;
      allTrans.push(...(page.documents as unknown as typeof allTrans));
      if (page.documents.length < BATCH) break;
      lastId = page.documents.at(-1)!.$id;
    }
  }

  const titles: Record<string, string> = {};
  const slugs: Record<string, string> = {};
  const availability: Record<string, Record<string, boolean>> = {};

  for (const id of articleIds) {
    availability[id] = Object.fromEntries(
      ARTICLE_LOCALES.map((l) => [l, false])
    );
  }
  for (const t of allTrans) {
    if (availability[t.article_id]) {
      availability[t.article_id][t.language] = true;
    }
    if (t.language === "pt-br") {
      if (t.title) titles[t.article_id] = t.title;
      if (t.slug) slugs[t.article_id] = t.slug;
    }
  }

  const articles = JSON.parse(JSON.stringify(response.documents)).map(
    (a: Record<string, unknown> & { $id: string }) => ({
      ...a,
      title: titles[a.$id] || "(Sem título)",
      slug: slugs[a.$id] || "",
      languages:
        availability[a.$id] ||
        Object.fromEntries(ARTICLE_LOCALES.map((l) => [l, false])),
    })
  );

  return json({ articles });
};

type TranslationInput = {
  language: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { databases } = createSessionClient(request);
  const DB = import.meta.env.DATABASE_ID;
  const ARTICLES = import.meta.env.ARTICLES_COLLECTION_ID;
  const TRANS = import.meta.env.ARTICLE_TRANSLATIONS_COLLECTION_ID;

  const now = new Date().toISOString();
  const article = await databases.createDocument(DB, ARTICLES, ID.unique(), {
    category: body.category || "noticias",
    tags: Array.isArray(body.tags) ? body.tags : [],
    featuredImage: body.featuredImage || "",
    featuredImageAlt: body.featuredImageAlt || "",
    status: body.status || "draft",
    featured: Boolean(body.featured),
    authorId: body.authorId || locals.user.$id,
    authorName: body.authorName || locals.user.name || "Admin",
    publishedAt: body.publishedAt || now,
  });

  let translations: TranslationInput[] = Array.isArray(body.translations)
    ? (body.translations as TranslationInput[])
    : [];

  if (translations.length === 0) {
    translations = [
      {
        language: "pt-br",
        title: String(body.title ?? ""),
        slug: String(body.slug ?? ""),
        excerpt: String(body.excerpt ?? ""),
        content: String(body.content ?? ""),
        metaTitle: String(body.metaTitle ?? ""),
        metaDescription: String(body.metaDescription ?? ""),
      },
    ];
  }

  for (const t of translations) {
    await databases.createDocument(DB, TRANS, ID.unique(), {
      article_id: article.$id,
      language: t.language,
      title: t.title ?? "",
      slug: t.slug ?? "",
      excerpt: t.excerpt ?? "",
      content: t.content ?? "",
      metaTitle: t.metaTitle ?? "",
      metaDescription: t.metaDescription ?? "",
    });
  }

  return json({ success: true, id: article.$id });
};
```

- [ ] **Step 2: Create `apps/web-astro/src/pages/api/admin/articles/[id].ts`**

Handles `GET`, `PUT`, `DELETE` for a single article.

```ts
import type { APIRoute } from "astro";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../../../../lib/appwrite";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sanitize(data: Record<string, unknown>): Record<string, unknown> {
  const forbidden = new Set(["updatedAt", "createdAt"]);
  return Object.fromEntries(
    Object.entries(data).filter(
      ([k, v]) => !k.startsWith("$") && !forbidden.has(k) && v !== undefined
    )
  );
}

type TranslationInput = Record<string, unknown> & { language: string };

export const ALL: APIRoute = async ({ locals, request, params }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  const { id } = params;
  if (!id) return json({ error: "Missing article id" }, 400);

  const { databases } = createAdminClient();
  const DB = import.meta.env.DATABASE_ID;
  const ARTICLES = import.meta.env.ARTICLES_COLLECTION_ID;
  const TRANS = import.meta.env.ARTICLE_TRANSLATIONS_COLLECTION_ID;

  if (request.method === "GET") {
    const article = await databases.getDocument(DB, ARTICLES, id);
    const translations = await databases.listDocuments(DB, TRANS, [
      Query.equal("article_id", id),
    ]);
    const translation =
      translations.documents.find(
        (d: Record<string, unknown>) => d["language"] === "pt-br"
      ) ||
      translations.documents[0] ||
      null;
    return json({ article, translation, translations: translations.documents });
  }

  if (request.method === "PUT") {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    await databases.updateDocument(
      DB,
      ARTICLES,
      id,
      sanitize({
        category: body["category"],
        tags: body["tags"],
        featuredImage: body["featuredImage"],
        featuredImageAlt: body["featuredImageAlt"],
        status: body["status"],
        featured: body["featured"],
        authorId: body["authorId"],
        authorName: body["authorName"],
        publishedAt: body["publishedAt"],
      })
    );

    const translationsInput = body["translations"] as
      | TranslationInput[]
      | undefined;
    if (!Array.isArray(translationsInput) || translationsInput.length === 0) {
      return json({ success: true });
    }

    const existing = await databases.listDocuments(DB, TRANS, [
      Query.equal("article_id", id),
      Query.limit(25),
    ]);
    const idByLanguage = new Map<string, string>(
      existing.documents.map((d) => [
        (d as unknown as TranslationInput).language,
        d.$id,
      ])
    );

    for (const t of translationsInput) {
      const clean = sanitize(t);
      delete clean["article_id"];
      delete clean["$id"];
      const lang = clean["language"] as string;
      const docId = idByLanguage.get(lang) ?? ID.unique();
      await databases.upsertDocument(DB, TRANS, docId, {
        ...clean,
        article_id: id,
      });
    }

    return json({ success: true });
  }

  if (request.method === "DELETE") {
    const BATCH = 100;
    for (;;) {
      const translations = await databases.listDocuments(DB, TRANS, [
        Query.equal("article_id", id),
        Query.limit(BATCH),
      ]);
      if (translations.documents.length === 0) break;
      for (const t of translations.documents) {
        await databases.deleteDocument(DB, TRANS, t.$id);
      }
      if (translations.documents.length < BATCH) break;
    }
    await databases.deleteDocument(DB, ARTICLES, id);
    return json({ success: true });
  }

  return json({ error: "Method not allowed" }, 405);
};
```

- [ ] **Step 3: Verify build**

```bash
cd apps/web-astro && pnpm build 2>&1 | grep -E "error|Error" | head -20
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web-astro/src/pages/api/admin/articles/
git commit -m "feat(web-astro): add admin article API routes (list, create, get, put, delete)"
```

---

## Task 3: Admin utility API routes

**Files:**

- Create: `apps/web-astro/src/pages/api/admin/dashboard.ts`
- Create: `apps/web-astro/src/pages/api/admin/translate.ts`
- Create: `apps/web-astro/src/pages/api/admin/redeploy.ts`
- Create: `apps/web-astro/src/pages/api/upload.ts`

- [ ] **Step 1: Create `apps/web-astro/src/pages/api/admin/dashboard.ts`**

```ts
import type { APIRoute } from "astro";
import { Query } from "node-appwrite";
import { createSessionClient } from "../../../lib/appwrite";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async ({ locals, request }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  const { databases } = createSessionClient(request);
  const DB = import.meta.env.DATABASE_ID;
  const ARTICLES = import.meta.env.ARTICLES_COLLECTION_ID;

  try {
    const [allRes, publishedRes, draftRes, recentRes] = await Promise.all([
      databases.listDocuments(DB, ARTICLES, [Query.limit(100)]),
      databases.listDocuments(DB, ARTICLES, [
        Query.equal("status", "published"),
        Query.limit(100),
      ]),
      databases.listDocuments(DB, ARTICLES, [
        Query.equal("status", "draft"),
        Query.limit(100),
      ]),
      databases.listDocuments(DB, ARTICLES, [
        Query.orderDesc("$createdAt"),
        Query.limit(5),
      ]),
    ]);

    const categories = new Set(
      (allRes.documents as Array<{ category?: string }>)
        .map((d) => d.category)
        .filter(Boolean)
    );

    return json({
      stats: {
        totalArticles: allRes.total,
        publishedArticles: publishedRes.total,
        draftArticles: draftRes.total,
        categories: categories.size,
        recentArticles: JSON.parse(JSON.stringify(recentRes.documents)),
      },
    });
  } catch {
    return json({ error: "Failed to load dashboard data" }, 500);
  }
};
```

- [ ] **Step 2: Create `apps/web-astro/src/pages/api/admin/translate.ts`**

```ts
import type { APIRoute } from "astro";

const TARGET_LANG_MAP: Record<string, string> = {
  "pt-br": "PT-BR",
  en: "EN-US",
  nl: "NL",
  es: "ES",
  ja: "JA",
  zh: "ZH",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user) return json({ error: "Não autorizado" }, 401);

  let body: { text?: string; isHtml?: boolean; targetLang?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!body.text) return json({ error: "Texto não fornecido" }, 400);
  if (!body.targetLang)
    return json({ error: "Idioma de destino não fornecido" }, 400);

  const authKey = import.meta.env.DEEPL_API_KEY;
  if (!authKey?.trim())
    return json({ error: "DEEPL_API_KEY não configurada" }, 503);

  const targetCode =
    TARGET_LANG_MAP[body.targetLang.toLowerCase()] ||
    body.targetLang.toUpperCase();
  const isFree = authKey.endsWith(":fx");
  const url = isFree
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";

  const params = new URLSearchParams({
    text: body.text,
    source_lang: "PT",
    target_lang: targetCode,
  });
  if (body.isHtml) params.append("tag_handling", "html");

  try {
    const res = await fetch(url, {
      method: "POST",
      body: params,
      headers: {
        Authorization: `DeepL-Auth-Key ${authKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (!res.ok) throw new Error(`DeepL ${res.status}`);
    const data = (await res.json()) as {
      translations?: Array<{ text: string }>;
    };
    return json({ translated: data.translations?.[0]?.text ?? "" });
  } catch {
    return json({ error: "Erro ao traduzir" }, 500);
  }
};
```

- [ ] **Step 3: Create `apps/web-astro/src/pages/api/admin/redeploy.ts`**

```ts
import type { APIRoute } from "astro";
import { Client, Sites, VCSReferenceType } from "node-appwrite";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  const siteId = import.meta.env.APPWRITE_SITE_ID;
  if (!siteId)
    return json({ error: "APPWRITE_SITE_ID is not configured" }, 500);

  const client = new Client()
    .setEndpoint(import.meta.env.APPWRITE_ENDPOINT)
    .setProject(import.meta.env.APPWRITE_PROJECT_ID)
    .setKey(import.meta.env.APPWRITE_API_KEY);

  try {
    const sites = new Sites(client);
    const deployment = await sites.createVcsDeployment(
      siteId,
      VCSReferenceType.Branch,
      "main",
      true
    );
    return json({ deploymentId: deployment.$id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return json({ error: msg }, 500);
  }
};
```

- [ ] **Step 4: Create `apps/web-astro/src/pages/api/upload.ts`**

```ts
import type { APIRoute } from "astro";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { createSessionClient } from "../../lib/appwrite";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user) return json({ error: "Não autorizado" }, 401);

  const { storage } = createSessionClient(request);
  const BUCKET = import.meta.env.STORAGE_BUCKET_ID;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return json({ error: "No file provided" }, 400);
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const input = InputFile.fromBuffer(buffer, file.name || "upload.bin");
    const created = await storage.createFile(BUCKET, ID.unique(), input);
    const url = storage.getFilePreview(BUCKET, created.$id).toString();
    return json({ success: true, fileId: created.$id, url });
  } catch {
    return json({ error: "Falha ao enviar arquivo" }, 500);
  }
};
```

- [ ] **Step 5: Verify build**

```bash
cd apps/web-astro && pnpm build 2>&1 | grep -E "error|Error" | head -20
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add apps/web-astro/src/pages/api/
git commit -m "feat(web-astro): add admin utility API routes (dashboard, translate, redeploy, upload)"
```

---

## Task 4: Admin layout

**Files:**

- Create: `apps/web-astro/src/layouts/Admin.astro`

- [ ] **Step 1: Create `apps/web-astro/src/layouts/Admin.astro`**

```astro
---
import Base from "./Base.astro";

interface Props {
  title: string;
}

const { title } = Astro.props;

if (!Astro.locals.user) {
  return Astro.redirect("/admin/login");
}

const locale = Astro.currentLocale ?? "pt-br";
const prefix = locale === "pt-br" ? "" : `/${locale}`;
---

<Base title={`${title} — Admin`} robots="noindex, nofollow">
  <div class="min-h-screen bg-slate-50 flex">
    <aside class="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div class="p-6 border-b border-slate-100">
        <a
          href={`${prefix}/admin`}
          class="font-black text-lg uppercase tracking-tighter text-slate-900"
        >
          Astrobiologia
        </a>
        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
          Painel Admin
        </p>
      </div>
      <nav class="flex-1 p-4 space-y-1">
        <a
          href={`${prefix}/admin`}
          class="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors uppercase tracking-widest"
        >
          Painel
        </a>
        <a
          href={`${prefix}/admin/artigos`}
          class="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors uppercase tracking-widest"
        >
          Artigos
        </a>
        <a
          href={`${prefix}/admin/artigos/new`}
          class="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors uppercase tracking-widest"
        >
          Novo Artigo
        </a>
      </nav>
      <div class="p-4 border-t border-slate-100">
        <button
          id="logout-btn"
          type="button"
          class="w-full text-left px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-700 transition-colors uppercase tracking-widest"
        >
          Sair
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-auto">
      <div class="p-8">
        <slot />
      </div>
    </main>
  </div>
</Base>

<script>
  document.getElementById("logout-btn")?.addEventListener("click", async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  });
</script>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web-astro/src/layouts/Admin.astro
git commit -m "feat(web-astro): add Admin layout"
```

---

## Task 5: Login page

**Files:**

- Create: `apps/web-astro/src/components/admin/LoginForm.tsx`
- Create: `apps/web-astro/src/pages/admin/login.astro`

- [ ] **Step 1: Create `apps/web-astro/src/components/admin/LoginForm.tsx`**

```tsx
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Credenciais inválidas");
        return;
      }
      window.location.href = "/admin";
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 w-full max-w-md">
        <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-8">
          Entrar no Painel
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              placeholder="admin@exemplo.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `apps/web-astro/src/pages/admin/login.astro`**

```astro
---
import Base from "../../layouts/Base.astro";
import LoginForm from "../../components/admin/LoginForm";

// Redirect already-logged-in users
if (Astro.locals.user) {
  return Astro.redirect("/admin");
}
---

<Base title="Login — Astrobiologia Admin" robots="noindex, nofollow">
  <LoginForm client:only="react" />
</Base>
```

- [ ] **Step 3: Commit**

```bash
git add apps/web-astro/src/components/admin/LoginForm.tsx apps/web-astro/src/pages/admin/login.astro
git commit -m "feat(web-astro): add admin login page"
```

---

## Task 6: Dashboard React island

**Files:**

- Create: `apps/web-astro/src/components/admin/Dashboard.tsx`
- Create: `apps/web-astro/src/pages/admin/index.astro`

- [ ] **Step 1: Create `apps/web-astro/src/components/admin/Dashboard.tsx`**

```tsx
import { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  PenTool,
  Tag,
  Plus,
  ExternalLink,
  TrendingUp,
  Calendar,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

type RecentArticle = {
  $id: string;
  title?: string;
  status?: string;
  category?: string;
  publishedAt?: string;
  $createdAt?: string;
};

type Stats = {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  categories: number;
  recentArticles: RecentArticle[];
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadError, setLoadError] = useState("");
  const [redeploying, setRedeploying] = useState(false);
  const [redeployStatus, setRedeployStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  async function loadStats() {
    setLoadError("");
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (data.error) {
        setLoadError(data.error);
        return;
      }
      setStats(data.stats);
    } catch {
      setLoadError("Falha ao carregar dados do painel.");
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  async function triggerRedeploy() {
    setRedeploying(true);
    setRedeployStatus("idle");
    try {
      const res = await fetch("/api/admin/redeploy", { method: "POST" });
      setRedeployStatus(res.ok ? "success" : "error");
    } catch {
      setRedeployStatus("error");
    } finally {
      setRedeploying(false);
      setTimeout(() => setRedeployStatus("idle"), 4000);
    }
  }

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl flex flex-col items-center text-center">
        <p className="font-bold mb-4">{loadError}</p>
        <button
          onClick={loadStats}
          className="px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total de Artigos",
      value: stats.totalArticles,
      Icon: FileText,
      color: "text-primary bg-primary/5",
    },
    {
      label: "Publicados",
      value: stats.publishedArticles,
      Icon: CheckCircle2,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Rascunhos",
      value: stats.draftArticles,
      Icon: PenTool,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      label: "Categorias",
      value: stats.categories,
      Icon: Tag,
      color: "text-slate-600 bg-slate-100",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Painel de Controle
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Visão Geral do Portal Científico
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, Icon, color }) => (
          <div
            key={label}
            className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {label}
                </p>
                <p className="text-3xl font-black text-slate-900">{value}</p>
              </div>
              <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-400" />
              Artigos Recentes
            </h2>
            <a
              href="/admin/artigos"
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-1"
            >
              Ver Todos <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {stats.recentArticles.length > 0 ? (
              stats.recentArticles.map((article) => (
                <div
                  key={article.$id}
                  className="p-5 hover:bg-slate-50 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">
                      {article.title || "(Sem título)"}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
                      {formatDate(
                        article.publishedAt || article.$createdAt || ""
                      )}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                      article.status === "published"
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "bg-yellow-50 text-yellow-700 border-yellow-100"
                    }`}
                  >
                    {article.status === "published" ? "Publicado" : "Rascunho"}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-12 text-center text-slate-400 italic">
                Nenhum artigo ainda.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-tight">
            Ações Rápidas
          </h2>
          <div className="space-y-3">
            <a
              href="/admin/artigos/new"
              className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-700 transition group"
            >
              <div className="flex items-center gap-3">
                <Plus className="w-5 h-5" />
                <span className="font-black uppercase tracking-widest text-xs">
                  Novo Artigo
                </span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="/admin/artigos"
              className="flex items-center justify-between p-4 bg-white border border-slate-200 text-slate-900 rounded-2xl hover:border-slate-900 transition group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <span className="font-black uppercase tracking-widest text-xs">
                  Gerenciar Todos
                </span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <button
              type="button"
              disabled={redeploying}
              onClick={triggerRedeploy}
              className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 text-slate-900 rounded-2xl hover:border-slate-900 transition group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <RefreshCw
                  className={`w-5 h-5 ${redeploying ? "animate-spin" : ""}`}
                />
                <span className="font-black uppercase tracking-widest text-xs">
                  {redeploying
                    ? "Publicando..."
                    : redeployStatus === "success"
                      ? "Publicado!"
                      : redeployStatus === "error"
                        ? "Erro ao Publicar"
                        : "Publicar Site"}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `apps/web-astro/src/pages/admin/index.astro`**

```astro
---
import Admin from "../../layouts/Admin.astro";
import Dashboard from "../../components/admin/Dashboard";
---

<Admin title="Painel">
  <Dashboard client:only="react" />
</Admin>
```

- [ ] **Step 3: Commit**

```bash
git add apps/web-astro/src/components/admin/Dashboard.tsx apps/web-astro/src/pages/admin/index.astro
git commit -m "feat(web-astro): add admin dashboard"
```

---

## Task 7: Article list React island

**Files:**

- Create: `apps/web-astro/src/components/admin/ArticleList.tsx`
- Create: `apps/web-astro/src/pages/admin/artigos/index.astro`

- [ ] **Step 1: Create `apps/web-astro/src/components/admin/ArticleList.tsx`**

```tsx
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, PenTool } from "lucide-react";
import { ARTICLE_LOCALES } from "../../../lib/article-locales";

type ArticleRow = {
  $id: string;
  title: string;
  status: "draft" | "published";
  category?: string;
  $createdAt: string;
  publishedAt?: string;
  languages: Record<string, boolean>;
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ArticleList() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/articles");
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setArticles(data.articles ?? []);
    } catch {
      setError("Erro ao carregar artigos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteArticle(id: string, title: string) {
    if (!confirm(`Excluir "${title}"? Esta ação não pode ser desfeita.`))
      return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setArticles((prev) => prev.filter((a) => a.$id !== id));
    } catch {
      alert("Erro ao excluir artigo.");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
            Artigos
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {articles.length} artigos encontrados
          </p>
        </div>
        <a
          href="/admin/artigos/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-700 transition"
        >
          <Plus className="w-4 h-4" />
          Novo Artigo
        </a>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {articles.length === 0 ? (
          <p className="p-12 text-center text-slate-400 italic">
            Nenhum artigo encontrado. Crie o primeiro!
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Título
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Idiomas
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Data
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((article) => (
                <tr
                  key={article.$id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 truncate max-w-xs">
                      {article.title}
                    </p>
                    {article.category && (
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">
                        {article.category}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                        article.status === "published"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-yellow-50 text-yellow-700 border-yellow-100"
                      }`}
                    >
                      {article.status === "published" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Publicado
                        </>
                      ) : (
                        <>
                          <PenTool className="w-3 h-3" /> Rascunho
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {ARTICLE_LOCALES.map((locale) => (
                        <span
                          key={locale}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                            article.languages[locale]
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {locale}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                    {formatDate(article.publishedAt || article.$createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <a
                        href={`/admin/artigos/${article.$id}/edit`}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        disabled={deleting === article.$id}
                        onClick={() =>
                          deleteArticle(article.$id, article.title)
                        }
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-40"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `apps/web-astro/src/pages/admin/artigos/index.astro`**

```astro
---
import Admin from "../../../layouts/Admin.astro";
import ArticleList from "../../../components/admin/ArticleList";
---

<Admin title="Artigos">
  <ArticleList client:only="react" />
</Admin>
```

- [ ] **Step 3: Commit**

```bash
git add apps/web-astro/src/components/admin/ArticleList.tsx apps/web-astro/src/pages/admin/artigos/index.astro
git commit -m "feat(web-astro): add admin article list"
```

---

## Task 8: Article editor React island

**Files:**

- Create: `apps/web-astro/src/components/admin/ArticleEditor.tsx`
- Create: `apps/web-astro/src/pages/admin/artigos/new.astro`
- Create: `apps/web-astro/src/pages/admin/artigos/[id]/edit.astro`

The editor handles both creating new articles and editing existing ones. It receives an optional `articleId` prop — when present it fetches the article data; when absent it starts blank.

- [ ] **Step 1: Create `apps/web-astro/src/components/admin/ArticleEditor.tsx`**

```tsx
import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  ARTICLE_LOCALES,
  getArticleLocaleLabels,
} from "../../../lib/article-locales";
import { Save, Loader2, Globe, Upload } from "lucide-react";

type Translation = {
  language: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
};

type ArticleMeta = {
  category: string;
  tags: string[];
  featuredImage: string;
  featuredImageAlt: string;
  status: "draft" | "published";
  featured: boolean;
  authorName: string;
  publishedAt: string;
};

const CATEGORIES = [
  "noticias",
  "entrevistas",
  "analises",
  "pesquisas-brasileiras",
  "exoplanetas",
  "extremofilos",
];

function emptyTranslation(language: string): Translation {
  return {
    language,
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
  };
}

function defaultMeta(): ArticleMeta {
  return {
    category: "noticias",
    tags: [],
    featuredImage: "",
    featuredImageAlt: "",
    status: "draft",
    featured: false,
    authorName: "Admin",
    publishedAt: new Date().toISOString().slice(0, 16),
  };
}

export default function ArticleEditor({ articleId }: { articleId?: string }) {
  const isNew = !articleId;
  const [activeLocale, setActiveLocale] = useState("pt-br");
  const [translations, setTranslations] = useState<Record<string, Translation>>(
    Object.fromEntries(ARTICLE_LOCALES.map((l) => [l, emptyTranslation(l)]))
  );
  const [meta, setMeta] = useState<ArticleMeta>(defaultMeta());
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">(
    "idle"
  );
  const [loadError, setLoadError] = useState("");
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Escreva o conteúdo do artigo aqui…",
      }),
    ],
    content: translations[activeLocale]?.content ?? "",
    onUpdate({ editor: ed }) {
      setTranslations((prev) => ({
        ...prev,
        [activeLocale]: { ...prev[activeLocale], content: ed.getHTML() },
      }));
    },
  });

  // Sync editor content when switching locale tabs
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(translations[activeLocale]?.content ?? "");
    }
  }, [activeLocale]);

  // Load existing article
  useEffect(() => {
    if (!articleId) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/articles/${articleId}`);
        const data = await res.json();
        if (!res.ok) {
          setLoadError(data.error || "Erro ao carregar artigo");
          return;
        }

        const { article, translations: rawTrans } = data;
        setMeta({
          category: article.category ?? "noticias",
          tags: article.tags ?? [],
          featuredImage: article.featuredImage ?? "",
          featuredImageAlt: article.featuredImageAlt ?? "",
          status: article.status ?? "draft",
          featured: article.featured ?? false,
          authorName: article.authorName ?? "Admin",
          publishedAt: (article.publishedAt ?? new Date().toISOString()).slice(
            0,
            16
          ),
        });

        const merged = Object.fromEntries(
          ARTICLE_LOCALES.map((l) => [l, emptyTranslation(l)])
        );
        for (const t of rawTrans ?? []) {
          merged[t.language] = {
            language: t.language,
            title: t.title ?? "",
            slug: t.slug ?? "",
            excerpt: t.excerpt ?? "",
            content: t.content ?? "",
            metaTitle: t.metaTitle ?? "",
            metaDescription: t.metaDescription ?? "",
          };
        }
        setTranslations(merged);
        if (editor && !editor.isDestroyed) {
          editor.commands.setContent(merged["pt-br"]?.content ?? "");
        }
      } catch {
        setLoadError("Falha de conexão.");
      }
    })();
  }, [articleId]);

  function updateTransField(field: keyof Translation, value: string) {
    setTranslations((prev) => ({
      ...prev,
      [activeLocale]: { ...prev[activeLocale], [field]: value },
    }));
  }

  async function autoSlug() {
    const title = translations[activeLocale]?.title ?? "";
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    updateTransField("slug", slug);
  }

  async function translateToLocale(targetLocale: string) {
    const source = translations["pt-br"];
    if (!source.title && !source.content) {
      alert("Preencha o conteúdo em Português antes de traduzir.");
      return;
    }
    setTranslating(true);
    try {
      async function tr(text: string, isHtml = false) {
        if (!text.trim()) return "";
        const res = await fetch("/api/admin/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, targetLang: targetLocale, isHtml }),
        });
        const data = await res.json();
        return data.translated ?? text;
      }
      const [title, excerpt, content, metaTitle, metaDescription] =
        await Promise.all([
          tr(source.title),
          tr(source.excerpt),
          tr(source.content, true),
          tr(source.metaTitle || source.title),
          tr(source.metaDescription || source.excerpt),
        ]);
      setTranslations((prev) => ({
        ...prev,
        [targetLocale]: {
          language: targetLocale,
          title,
          slug:
            translations[targetLocale]?.slug ||
            translations["pt-br"]?.slug ||
            "",
          excerpt,
          content,
          metaTitle,
          metaDescription,
        },
      }));
    } catch {
      alert("Erro ao traduzir. Verifique a configuração do DeepL.");
    } finally {
      setTranslating(false);
    }
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.fileId) {
        setMeta((prev) => ({ ...prev, featuredImage: data.fileId }));
      }
    } catch {
      alert("Erro ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const body = {
        ...meta,
        publishedAt: new Date(meta.publishedAt).toISOString(),
        translations: Object.values(translations),
      };
      const url = isNew
        ? "/api/admin/articles"
        : `/api/admin/articles/${articleId}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaveStatus("saved");
      if (isNew && data.id) {
        window.location.href = `/admin/artigos/${data.id}/edit`;
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl text-center">
        <p className="font-bold">{loadError}</p>
      </div>
    );
  }

  const localeLabels = getArticleLocaleLabels("pt-br");
  const currentTrans = translations[activeLocale];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
            {isNew ? "Novo Artigo" : "Editar Artigo"}
          </h1>
          <a
            href="/admin/artigos"
            className="text-sm text-slate-400 hover:text-slate-700 font-bold"
          >
            ← Voltar para Artigos
          </a>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={save}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-700 transition disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving
            ? "Salvando..."
            : saveStatus === "saved"
              ? "Salvo!"
              : saveStatus === "error"
                ? "Erro"
                : "Salvar"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Locale tabs */}
          <div className="flex gap-2 flex-wrap">
            {ARTICLE_LOCALES.map((locale) => (
              <div key={locale} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveLocale(locale)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition ${
                    activeLocale === locale
                      ? "bg-slate-900 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-slate-900"
                  }`}
                >
                  {locale.toUpperCase()}
                  {translations[locale]?.title ? " ✓" : ""}
                </button>
                {locale !== "pt-br" && (
                  <button
                    type="button"
                    title={`Traduzir para ${localeLabels[locale]}`}
                    disabled={translating}
                    onClick={() => translateToLocale(locale)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition disabled:opacity-40"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Translation fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Título
              </label>
              <input
                type="text"
                value={currentTrans.title}
                onChange={(e) => updateTransField("title", e.target.value)}
                onBlur={() => {
                  if (!currentTrans.slug) autoSlug();
                }}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Título do artigo"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                  Slug
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentTrans.slug}
                    onChange={(e) => updateTransField("slug", e.target.value)}
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="url-do-artigo"
                  />
                  <button
                    type="button"
                    onClick={autoSlug}
                    className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition"
                  >
                    Auto
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Resumo
              </label>
              <textarea
                rows={3}
                value={currentTrans.excerpt}
                onChange={(e) => updateTransField("excerpt", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                placeholder="Breve resumo do artigo"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Conteúdo
              </label>
              <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-slate-900">
                <div className="border-b border-slate-100 px-3 py-2 flex gap-2 flex-wrap bg-slate-50">
                  {[
                    {
                      label: "B",
                      cmd: () => editor?.chain().focus().toggleBold().run(),
                      active: editor?.isActive("bold"),
                    },
                    {
                      label: "I",
                      cmd: () => editor?.chain().focus().toggleItalic().run(),
                      active: editor?.isActive("italic"),
                    },
                    {
                      label: "H2",
                      cmd: () =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({ level: 2 })
                          .run(),
                      active: editor?.isActive("heading", { level: 2 }),
                    },
                    {
                      label: "H3",
                      cmd: () =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({ level: 3 })
                          .run(),
                      active: editor?.isActive("heading", { level: 3 }),
                    },
                    {
                      label: "UL",
                      cmd: () =>
                        editor?.chain().focus().toggleBulletList().run(),
                      active: editor?.isActive("bulletList"),
                    },
                    {
                      label: "OL",
                      cmd: () =>
                        editor?.chain().focus().toggleOrderedList().run(),
                      active: editor?.isActive("orderedList"),
                    },
                    {
                      label: "—",
                      cmd: () =>
                        editor?.chain().focus().setHorizontalRule().run(),
                      active: false,
                    },
                  ].map(({ label, cmd, active }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={cmd}
                      className={`px-2 py-1 text-xs font-bold rounded transition ${
                        active
                          ? "bg-slate-900 text-white"
                          : "hover:bg-slate-200 text-slate-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <EditorContent
                  editor={editor}
                  className="prose prose-slate max-w-none p-4 min-h-[300px] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar meta */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">
              Configurações
            </h2>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Status
              </label>
              <select
                value={meta.status}
                onChange={(e) =>
                  setMeta((prev) => ({
                    ...prev,
                    status: e.target.value as "draft" | "published",
                  }))
                }
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Categoria
              </label>
              <select
                value={meta.category}
                onChange={(e) =>
                  setMeta((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Autor
              </label>
              <input
                type="text"
                value={meta.authorName}
                onChange={(e) =>
                  setMeta((prev) => ({ ...prev, authorName: e.target.value }))
                }
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Data de Publicação
              </label>
              <input
                type="datetime-local"
                value={meta.publishedAt}
                onChange={(e) =>
                  setMeta((prev) => ({ ...prev, publishedAt: e.target.value }))
                }
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={meta.featured}
                onChange={(e) =>
                  setMeta((prev) => ({ ...prev, featured: e.target.checked }))
                }
                className="w-4 h-4 rounded"
              />
              <label
                htmlFor="featured"
                className="text-sm font-bold text-slate-700"
              >
                Artigo em destaque
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">
              Imagem de Capa
            </h2>
            {meta.featuredImage && (
              <img
                src={`${import.meta.env.PUBLIC_APPWRITE_ENDPOINT ?? "https://nyc.cloud.appwrite.io/v1"}/storage/buckets/${import.meta.env.PUBLIC_STORAGE_BUCKET_ID ?? "images"}/files/${meta.featuredImage}/preview?width=400&height=250&project=${import.meta.env.PUBLIC_APPWRITE_PROJECT_ID ?? "69e462f20036d39192ba"}`}
                alt=""
                className="w-full rounded-xl object-cover aspect-video"
              />
            )}
            <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-slate-900 transition text-sm text-slate-500 font-bold">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />{" "}
                  {meta.featuredImage ? "Trocar imagem" : "Enviar imagem"}
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f);
                }}
              />
            </label>
            {meta.featuredImage && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                  Alt text
                </label>
                <input
                  type="text"
                  value={meta.featuredImageAlt}
                  onChange={(e) =>
                    setMeta((prev) => ({
                      ...prev,
                      featuredImageAlt: e.target.value,
                    }))
                  }
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  placeholder="Descrição da imagem"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Note:** The `import.meta.env.PUBLIC_*` vars referenced in the image preview inside the React component won't be available client-side unless prefixed with `PUBLIC_`. Add these to `.env`:

```
PUBLIC_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
PUBLIC_APPWRITE_PROJECT_ID=69e462f20036d39192ba
PUBLIC_STORAGE_BUCKET_ID=images
```

- [ ] **Step 2: Update `apps/web-astro/.env` with PUBLIC\_ vars**

Append to `apps/web-astro/.env`:

```
PUBLIC_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
PUBLIC_APPWRITE_PROJECT_ID=69e462f20036d39192ba
PUBLIC_STORAGE_BUCKET_ID=images
```

- [ ] **Step 3: Create `apps/web-astro/src/pages/admin/artigos/new.astro`**

```astro
---
import Admin from "../../../layouts/Admin.astro";
import ArticleEditor from "../../../components/admin/ArticleEditor";
---

<Admin title="Novo Artigo">
  <ArticleEditor client:only="react" />
</Admin>
```

- [ ] **Step 4: Create `apps/web-astro/src/pages/admin/artigos/[id]/edit.astro`**

```astro
---
import Admin from "../../../../layouts/Admin.astro";
import ArticleEditor from "../../../../components/admin/ArticleEditor";

const { id } = Astro.params;
---

<Admin title="Editar Artigo">
  <ArticleEditor articleId={id} client:only="react" />
</Admin>
```

- [ ] **Step 5: Verify build**

```bash
cd apps/web-astro && pnpm build 2>&1 | grep -E "error|Error" | head -20
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add apps/web-astro/src/
git commit -m "feat(web-astro): add article editor with Tiptap and translation support"
```

---

## Task 9: Smoke test and deployment

- [ ] **Step 1: Run full build one final time**

```bash
cd apps/web-astro && pnpm build 2>&1 | tail -30
```

Expected: Build completes. `dist/server/entry.mjs` exists.

- [ ] **Step 2: Start local server and spot-check routes**

```bash
cd apps/web-astro && node dist/server/entry.mjs &
sleep 2

# Public routes
curl -s -o /dev/null -w "/ → %{http_code}\n" http://localhost:4321/
curl -s -o /dev/null -w "/artigos → %{http_code}\n" http://localhost:4321/artigos
curl -s -o /dev/null -w "/sobre → %{http_code}\n" http://localhost:4321/sobre

# Admin routes should redirect to login (302 or 200 depending on cookie)
curl -s -o /dev/null -w "/admin → %{http_code}\n" http://localhost:4321/admin
curl -s -o /dev/null -w "/admin/login → %{http_code}\n" http://localhost:4321/admin/login

kill %1
```

Expected: Public routes `200`, `/admin` redirects (302) or returns 200 for login page, `/admin/login` returns 200.

- [ ] **Step 3: Update Appwrite Sites environment variables**

Add the three new `PUBLIC_` variables to Appwrite Sites env vars (Sites → `6a03a0bc002bfa18c505` → Variables):

| Key                          | Value                              |
| ---------------------------- | ---------------------------------- |
| `PUBLIC_APPWRITE_ENDPOINT`   | `https://nyc.cloud.appwrite.io/v1` |
| `PUBLIC_APPWRITE_PROJECT_ID` | `69e462f20036d39192ba`             |
| `PUBLIC_STORAGE_BUCKET_ID`   | `images`                           |

- [ ] **Step 4: Push to main and verify deployment**

```bash
git push origin main
```

Wait for Appwrite Sites to complete the build. Verify:

1. Homepage loads with articles
2. An article detail page renders correctly
3. `/admin/login` shows the login form
4. Logging in redirects to `/admin` dashboard
5. Dashboard stats cards show correct numbers
6. Article list shows all articles
7. Edit an article — save — verify changes persist
8. Create a new article — save — verify it appears in the list
9. "Publicar Site" button triggers a new deployment (check Appwrite console → Sites → Deployments)
10. Measure cold start TTFB — expected under 5 seconds

- [ ] **Step 5: Decommission Nuxt app (optional, do after verifying Astro is stable)**

Once the Astro site is confirmed working in production:

```bash
# Do NOT delete yet — keep as reference for one sprint
# When ready:
# git rm -r apps/web-nuxt
# git commit -m "chore: remove web-nuxt (replaced by web-astro)"
```

---

## Phase 2 Complete

The full admin area is live. The Astro rebuild is complete:

- Public pages render server-side with ~1-2s cold start
- Admin area protected by session middleware
- Article CRUD with multilingual editing and auto-translation
- Image upload to Appwrite Storage
- One-click site redeploy from the dashboard
