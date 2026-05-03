# Site Layout Switcher — Design Spec

**Date:** 2026-05-01  
**Project:** astrobiologia.com.br (Nuxt 3)  
**Status:** Approved — ready for implementation

---

## Overview

An admin-controlled site layout switcher that lets the site owner choose from 4 homepage/public layout archetypes. The chosen layout applies globally to all public article-listing pages. Visitors always see whatever the admin last saved; there is no per-user preference.

---

## Scope

Pages affected by the layout switch:

- `pages/index.vue` — homepage
- `pages/artigos/index.vue` — all articles
- `pages/categorias/[category].vue` — category archive

Pages **not** affected: article detail, search, static pages (sobre, contato, privacidade).

---

## Layout Archetypes

| ID             | Name                | Description                                                                                                     |
| -------------- | ------------------- | --------------------------------------------------------------------------------------------------------------- |
| `grid`         | Grade Uniforme      | Pure equal 3-column card grid. No hero section.                                                                 |
| `hero-grid`    | Herói + Grade       | Featured article large-left, 2 compact right, 3-col grid below. Current homepage layout.                        |
| `hero-sidebar` | Herói + Sidebar     | Featured article large-left, "Últimas" compact list right (articles[0..4]), 3-col grid below.                   |
| `magazine`     | Revista (3 colunas) | Full-width banner from featured[0], 3-column editorial below with featured[1..2] as tall cards in first column. |

Default layout (on first deploy or fetch failure): `hero-grid` — preserves current behaviour.

---

## Architecture: Approach A — Pinia + Appwrite `site_settings`

### Data Model

**Appwrite collection:** `site_settings`  
**Singleton document ID:** `"global"`

| Field    | Type     | Allowed values                                          |
| -------- | -------- | ------------------------------------------------------- |
| `layout` | `string` | `"grid"`, `"hero-grid"`, `"hero-sidebar"`, `"magazine"` |

The document is created on first admin save (upsert). If it doesn't exist, the GET API returns the default `{ layout: 'hero-grid' }`.

**TypeScript types** — `types/site-settings.ts`:

```ts
export type LayoutType = "grid" | "hero-grid" | "hero-sidebar" | "magazine";

export interface SiteSettings {
  layout: LayoutType;
}
```

**`nuxt.config.ts` runtime config addition:**

```ts
public: {
  // ...existing fields...
  siteSettingsCollectionId: '',  // env: NUXT_PUBLIC_SITE_SETTINGS_COLLECTION_ID
}
```

---

### Pinia Store

**File:** `stores/siteSettings.ts`

```ts
export const useSiteSettingsStore = defineStore("siteSettings", () => {
  const layout = ref<LayoutType>("hero-grid");

  async function fetchLayout() {
    const data = await $fetch<SiteSettings>("/api/site-settings");
    layout.value = data.layout;
  }

  async function setLayout(newLayout: LayoutType) {
    await $fetch("/api/admin/site-settings", {
      method: "POST",
      body: { layout: newLayout },
    });
    layout.value = newLayout;
  }

  return { layout, fetchLayout, setLayout };
});
```

Default `'hero-grid'` ensures the store is never empty, even before the first fetch resolves.

---

### Nuxt Plugin

**File:** `plugins/site-settings.server.ts` (server-only — runs once per SSR request)

```ts
export default defineNuxtPlugin(async () => {
  const store = useSiteSettingsStore();
  await store.fetchLayout().catch(() => {});
});
```

The `.catch(() => {})` swallows fetch errors silently; the store retains its default. Pinia's SSR state serialisation sends the populated store value to the client, so no client-side re-fetch is needed.

`@pinia/nuxt` must be added to `modules` in `nuxt.config.ts`.

---

### Server API

| File                                     | Method | Auth                                       | Purpose                            |
| ---------------------------------------- | ------ | ------------------------------------------ | ---------------------------------- |
| `server/api/site-settings.get.ts`        | GET    | None                                       | Public read — called by SSR plugin |
| `server/api/admin/site-settings.post.ts` | POST   | Admin session (existing `auth` middleware) | Admin write                        |

**GET behaviour:**

- Reads the `global` document from the `site_settings` collection via `createAdminClient()`
- On document-not-found: returns `{ layout: 'hero-grid' }` (no error)
- On invalid `layout` value in DB: validates against `LayoutType` union, falls back to `'hero-grid'`
- On other Appwrite errors: returns `{ layout: 'hero-grid' }` and logs server-side via `logger`

**POST behaviour:**

- Validates request body `layout` field against `LayoutType` union — returns 400 on invalid value
- Upserts the `global` document: attempts `createDocument`; if Appwrite returns a conflict (document exists), calls `updateDocument` instead — works on both first save and subsequent saves
- Returns `{ layout }` on success

---

### Layout Components

**Directory:** `components/layouts/`

| File                    | Nuxt auto-import name      |
| ----------------------- | -------------------------- |
| `GridLayout.vue`        | `LayoutsGridLayout`        |
| `HeroGridLayout.vue`    | `LayoutsHeroGridLayout`    |
| `HeroSidebarLayout.vue` | `LayoutsHeroSidebarLayout` |
| `MagazineLayout.vue`    | `LayoutsMagazineLayout`    |

**Shared props contract (all 4 components):**

```ts
defineProps<{
  articles: Article[];
  featured?: Article[]; // absent on /artigos and /categorias pages
}>();
```

When `featured` is absent or empty, layouts that have a hero section use `articles[0..2]` as a fallback so the layout still renders consistently on all pages.

**Component rendering summary:**

| Component           | Hero section                                              | Body                                                     |
| ------------------- | --------------------------------------------------------- | -------------------------------------------------------- |
| `GridLayout`        | None                                                      | 3-col card grid (all `articles`)                         |
| `HeroGridLayout`    | `featured[0]` large-left + `featured[1..2]` compact-right | 3-col grid (`articles`)                                  |
| `HeroSidebarLayout` | `featured[0]` large-left                                  | Compact list right (`articles[0..4]`) + 3-col grid below |
| `MagazineLayout`    | `featured[0]` full-width banner                           | 3-col editorial; `featured[1..2]` as tall cards in col 1 |

All hero/compact/default card rendering delegates to the existing `ArticleCard` component's `variant` prop (`variant="featured"`, `variant="compact"`, default). No new card variants are needed.

`HeroGridLayout` is extracted from the existing inline markup in `pages/index.vue`.

---

### Composable

**File:** `composables/useLayoutComponent.ts`

```ts
export function useLayoutComponent() {
  const { layout } = storeToRefs(useSiteSettingsStore());
  const map: Record<LayoutType, Component> = {
    grid: resolveComponent("LayoutsGridLayout"),
    "hero-grid": resolveComponent("LayoutsHeroGridLayout"),
    "hero-sidebar": resolveComponent("LayoutsHeroSidebarLayout"),
    magazine: resolveComponent("LayoutsMagazineLayout"),
  };
  return computed(() => map[layout.value]);
}
```

---

### Public Page Changes

Each of the three affected pages adds one line to `<script setup>` and replaces its inline article grid with a single dynamic component.

**`pages/index.vue`:**

- `PageHeroShell` (site banner) remains above — it is not part of the switchable area
- The two existing `<section>` blocks (featured + recent grid) are replaced by:

```html
<component :is="currentLayout" :articles="recent" :featured="featured" />
```

**`pages/artigos/index.vue`:**

- `<h1>` heading stays outside the layout component
- Inline grid replaced by:

```html
<component :is="currentLayout" :articles="articles" />
```

**`pages/categorias/[category].vue`:**

- Category name/description heading stays outside
- Inline grid replaced by:

```html
<component :is="currentLayout" :articles="articles" />
```

---

### Admin UI

**Page:** `pages/admin/settings.vue` — WIP placeholder is replaced entirely.

The page renders one section: **Aparência**, containing the layout picker.

**Interaction model:**

1. Page mounts → `pendingLayout` initialised from `store.layout` (current selection pre-highlighted)
2. User clicks a thumbnail → updates `pendingLayout` ref only (no immediate save)
3. User clicks "Salvar layout" → calls `store.setLayout(pendingLayout.value)`
4. During save: button shows spinner, is disabled
5. On success: inline success message shown, store updated
6. On failure: inline error message shown below button; store unchanged (live layout unaffected)

**Thumbnail treatment:**

- 4 thumbnails, ~160×100px each, inline SVG wireframes showing structural pattern
- Selected thumbnail: `ring-2 ring-primary` border + checkmark badge
- Unselected thumbnails: neutral border, hover state

**Component state:**

```ts
const store = useSiteSettingsStore();
const pendingLayout = ref<LayoutType>(store.layout);
const saving = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

async function save() {
  saving.value = true;
  error.value = null;
  success.value = false;
  try {
    await store.setLayout(pendingLayout.value);
    success.value = true;
  } catch {
    error.value = "Não foi possível salvar. Tente novamente.";
  } finally {
    saving.value = false;
  }
}
```

---

## Error Handling Summary

| Scenario                                                   | Behaviour                                                                             |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Appwrite unavailable at SSR time                           | Plugin `.catch()` swallows error; store stays at `'hero-grid'`; page renders normally |
| `site_settings` collection/document missing (first deploy) | GET returns `{ layout: 'hero-grid' }`; POST upserts document into existence           |
| Invalid `layout` string in Appwrite document               | GET validates and returns `'hero-grid'` fallback                                      |
| Admin save fails                                           | Spinner clears, inline error shown, store not mutated, live layout unchanged          |
| Two admins saving simultaneously                           | Last write wins — acceptable for single-admin CMS                                     |

---

## New Files

| File                                       | Purpose                                       |
| ------------------------------------------ | --------------------------------------------- |
| `types/site-settings.ts`                   | `LayoutType` union + `SiteSettings` interface |
| `stores/siteSettings.ts`                   | Pinia store                                   |
| `plugins/site-settings.server.ts`          | SSR hydration plugin                          |
| `server/api/site-settings.get.ts`          | Public GET API                                |
| `server/api/admin/site-settings.post.ts`   | Admin POST API                                |
| `composables/useLayoutComponent.ts`        | Maps `LayoutType` → Vue component             |
| `components/layouts/GridLayout.vue`        | Layout archetype A                            |
| `components/layouts/HeroGridLayout.vue`    | Layout archetype B (extracted from index.vue) |
| `components/layouts/HeroSidebarLayout.vue` | Layout archetype C                            |
| `components/layouts/MagazineLayout.vue`    | Layout archetype D                            |

## Modified Files

| File                              | Change                                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| `nuxt.config.ts`                  | Add `@pinia/nuxt` to `modules`; add `siteSettingsCollectionId` to `runtimeConfig.public` |
| `pages/index.vue`                 | Replace inline featured+grid sections with `<component :is>`                             |
| `pages/artigos/index.vue`         | Replace inline grid with `<component :is>`                                               |
| `pages/categorias/[category].vue` | Replace inline grid with `<component :is>`                                               |
| `pages/admin/settings.vue`        | Replace WIP placeholder with Aparência layout picker                                     |

## Dependencies

- `@pinia/nuxt` — to be added to `package.json`
- `pinia` — peer dependency of `@pinia/nuxt`

No other new dependencies.
