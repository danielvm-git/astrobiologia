# Site Layout Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an admin-controlled global layout switcher that lets the site owner choose from 4 public-page archetypes persisted in Appwrite.

**Architecture:** A Pinia store (`siteSettings`) is hydrated server-side by a Nuxt plugin on every SSR request and serialised into the page payload. Public pages read the current layout from the store via a `useLayoutComponent` composable and render a `<component :is>` swap. The admin sets the layout via `/admin/settings` (Aparência section), which calls a protected POST API that upserts a singleton `site_settings` document in Appwrite.

**Tech Stack:** Nuxt 3, @pinia/nuxt, node-appwrite, Tailwind CSS v4, Playwright (e2e), Vitest (unit)

**Spec:** `docs/superpowers/specs/2026-05-01-layout-switcher-design.md`

---

## File Map

| Action | File                                           | Responsibility                                                       |
| ------ | ---------------------------------------------- | -------------------------------------------------------------------- |
| Create | `types/site-settings.ts`                       | `LayoutType` union + `SiteSettings` interface                        |
| Create | `stores/siteSettings.ts`                       | Pinia store: hold layout, fetch, set                                 |
| Create | `plugins/site-settings.server.ts`              | SSR: hydrate store from API before render                            |
| Create | `server/api/site-settings.get.ts`              | Public GET: read layout from Appwrite                                |
| Create | `server/api/admin/site-settings.post.ts`       | Admin POST: upsert layout in Appwrite                                |
| Create | `composables/useLayoutComponent.ts`            | Map `LayoutType` string → Vue component ref                          |
| Create | `components/layouts/GridLayout.vue`            | Layout A: uniform 3-col grid                                         |
| Create | `components/layouts/HeroGridLayout.vue`        | Layout B: hero left + compact right + grid below                     |
| Create | `components/layouts/HeroSidebarLayout.vue`     | Layout C: hero left + compact-list right + grid below                |
| Create | `components/layouts/MagazineLayout.vue`        | Layout D: full-width hero + 3-col grid                               |
| Modify | `nuxt.config.ts`                               | Add `@pinia/nuxt` module + `siteSettingsCollectionId` runtime config |
| Modify | `pages/index.vue`                              | Replace inline sections with `<component :is>`                       |
| Modify | `pages/artigos/index.vue`                      | Replace inline grid with `<component :is>`                           |
| Modify | `pages/categorias/[category].vue`              | Replace inline grid with `<component :is>`                           |
| Modify | `pages/admin/settings.vue`                     | Replace WIP placeholder with Aparência layout picker                 |
| Modify | `tests/mocks/nuxt-helpers.ts`                  | Add `siteSettingsCollectionId` to `RuntimeConfigStub`                |
| Modify | `tests/setup.ts`                               | Add `readBody` to global mocks                                       |
| Create | `tests/unit/server/site-settings-get.test.ts`  | Unit tests for GET handler                                           |
| Create | `tests/unit/server/site-settings-post.test.ts` | Unit tests for POST handler                                          |
| Create | `tests/e2e/p1/layout-switcher.spec.ts`         | E2e: admin settings shows layout picker                              |

---

## Task 1: Install Pinia and update project config

**Files:**

- Modify: `apps/web-nuxt/package.json` (via npm install)
- Modify: `apps/web-nuxt/nuxt.config.ts`
- Modify: `apps/web-nuxt/tests/mocks/nuxt-helpers.ts`
- Modify: `apps/web-nuxt/tests/setup.ts`

- [ ] **Step 1: Install Pinia**

Run from `apps/web-nuxt/`:

```bash
npm install @pinia/nuxt pinia
```

Expected: `package.json` gains `@pinia/nuxt` and `pinia` in `dependencies`.

- [ ] **Step 2: Add `@pinia/nuxt` to modules and `siteSettingsCollectionId` to runtime config**

In `apps/web-nuxt/nuxt.config.ts`, make these two additions:

```ts
// change:
  modules: ["@nuxtjs/i18n"],
// to:
  modules: ["@nuxtjs/i18n", "@pinia/nuxt"],
```

```ts
// inside runtimeConfig.public, add after storageBucketId:
      siteSettingsCollectionId: "", // env: NUXT_PUBLIC_SITE_SETTINGS_COLLECTION_ID
```

- [ ] **Step 3: Update `RuntimeConfigStub` for tests**

In `apps/web-nuxt/tests/mocks/nuxt-helpers.ts`, add `siteSettingsCollectionId` to the `public` shape:

```ts
export type RuntimeConfigStub = {
  appwriteApiKey: string;
  public: {
    appwriteEndpoint: string;
    appwriteProjectId: string;
    databaseId: string;
    articlesCollectionId: string;
    articleTranslationsCollectionId: string;
    categoriesCollectionId: string;
    storageBucketId: string;
    siteSettingsCollectionId: string;
  };
};
```

- [ ] **Step 4: Add `readBody` global mock to test setup**

In `apps/web-nuxt/tests/setup.ts`, add `readBody` to the globals block (after the `getCookie` line):

```ts
// add these two lines after g.getCookie = vi.fn();
g.readBody = vi.fn();
```

And extend the `NuxtTestGlobals` type to include it (after the `getCookie` line in the type):

```ts
readBody: Mock<(event: unknown) => Promise<unknown>>;
```

- [ ] **Step 5: Verify TypeScript still compiles**

```bash
cd apps/web-nuxt && npm run typecheck
```

Expected: no new errors.

- [ ] **Step 6: Commit**

```bash
git add apps/web-nuxt/package.json apps/web-nuxt/package-lock.json apps/web-nuxt/nuxt.config.ts apps/web-nuxt/tests/mocks/nuxt-helpers.ts apps/web-nuxt/tests/setup.ts
git commit -m "chore(layout-switcher): install pinia, add siteSettingsCollectionId config"
```

---

## Task 2: TypeScript types

**Files:**

- Create: `apps/web-nuxt/types/site-settings.ts`

- [ ] **Step 1: Create the types file**

Create `apps/web-nuxt/types/site-settings.ts`:

```ts
export type LayoutType = "grid" | "hero-grid" | "hero-sidebar" | "magazine";

export interface SiteSettings {
  layout: LayoutType;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web-nuxt/types/site-settings.ts
git commit -m "feat(layout-switcher): add LayoutType and SiteSettings types"
```

---

## Task 3: Public GET API + unit tests

**Files:**

- Create: `apps/web-nuxt/server/api/site-settings.get.ts`
- Create: `apps/web-nuxt/tests/unit/server/site-settings-get.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `apps/web-nuxt/tests/unit/server/site-settings-get.test.ts`:

```ts
import { AppwriteException } from "node-appwrite";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setRuntimeConfig } from "../../mocks/nuxt";
import type { RuntimeConfigStub } from "../../mocks/nuxt-helpers";

const { getDocument, createAdminClient } = vi.hoisted(() => {
  const getDocument = vi.fn();
  const createAdminClient = vi.fn(() => ({ databases: { getDocument } }));
  return { getDocument, createAdminClient };
});

vi.mock("~/server/utils/appwrite", () => ({
  createAdminClient,
  getDatabaseId: () => "test-database",
}));

vi.mock("~/server/utils/logger", () => ({
  createLogger: () => ({ error: vi.fn(), debug: vi.fn(), warn: vi.fn() }),
}));

const loadHandler = () => import("~/server/api/site-settings.get");

const runtime: RuntimeConfigStub = {
  appwriteApiKey: "key",
  public: {
    appwriteEndpoint: "https://example.com",
    appwriteProjectId: "p1",
    databaseId: "test-database",
    articlesCollectionId: "articles",
    articleTranslationsCollectionId: "translations",
    categoriesCollectionId: "categories",
    storageBucketId: "storage",
    siteSettingsCollectionId: "site_settings",
  },
};

describe("GET /api/site-settings", () => {
  beforeEach(() => {
    getDocument.mockReset();
    createAdminClient.mockReturnValue({ databases: { getDocument } });
    setRuntimeConfig(runtime);
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("returns the stored layout when document exists", async () => {
    getDocument.mockResolvedValue({ layout: "magazine" });
    const handler = (await loadHandler()).default as (
      event: unknown
    ) => Promise<unknown>;
    const result = await handler({});
    expect(result).toEqual({ layout: "magazine" });
  });

  it("returns hero-grid when document does not exist (404)", async () => {
    getDocument.mockRejectedValue(
      new AppwriteException("Not found", 404, "document_not_found", "")
    );
    const handler = (await loadHandler()).default as (
      event: unknown
    ) => Promise<unknown>;
    const result = await handler({});
    expect(result).toEqual({ layout: "hero-grid" });
  });

  it("returns hero-grid for an invalid layout string", async () => {
    getDocument.mockResolvedValue({ layout: "not-a-valid-layout" });
    const handler = (await loadHandler()).default as (
      event: unknown
    ) => Promise<unknown>;
    const result = await handler({});
    expect(result).toEqual({ layout: "hero-grid" });
  });

  it("returns hero-grid when Appwrite throws an unexpected error", async () => {
    getDocument.mockRejectedValue(new Error("network timeout"));
    const handler = (await loadHandler()).default as (
      event: unknown
    ) => Promise<unknown>;
    const result = await handler({});
    expect(result).toEqual({ layout: "hero-grid" });
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd apps/web-nuxt && npx vitest run tests/unit/server/site-settings-get.test.ts
```

Expected: 4 failing tests — `Cannot find module '~/server/api/site-settings.get'`.

- [ ] **Step 3: Implement the GET handler**

Create `apps/web-nuxt/server/api/site-settings.get.ts`:

```ts
import { AppwriteException } from "node-appwrite";
import { createAdminClient, getDatabaseId } from "~/server/utils/appwrite";
import { createLogger } from "~/server/utils/logger";
import type { LayoutType, SiteSettings } from "~/types/site-settings";

const logger = createLogger("SITE-SETTINGS-GET");
const VALID_LAYOUTS: LayoutType[] = [
  "grid",
  "hero-grid",
  "hero-sidebar",
  "magazine",
];
const DEFAULT: SiteSettings = { layout: "hero-grid" };

export default defineEventHandler(async (): Promise<SiteSettings> => {
  const config = useRuntimeConfig();
  const { databases } = createAdminClient();
  try {
    const doc = await databases.getDocument(
      getDatabaseId(),
      config.public.siteSettingsCollectionId,
      "global"
    );
    const layout = doc.layout as string;
    return VALID_LAYOUTS.includes(layout as LayoutType)
      ? { layout: layout as LayoutType }
      : DEFAULT;
  } catch (e) {
    if (e instanceof AppwriteException && e.code === 404) {
      return DEFAULT;
    }
    logger.error("Failed to fetch site settings", {
      error: (e as Error).message,
    });
    return DEFAULT;
  }
});
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd apps/web-nuxt && npx vitest run tests/unit/server/site-settings-get.test.ts
```

Expected: 4 passing tests.

- [ ] **Step 5: Commit**

```bash
git add apps/web-nuxt/server/api/site-settings.get.ts apps/web-nuxt/tests/unit/server/site-settings-get.test.ts
git commit -m "feat(layout-switcher): add GET /api/site-settings with unit tests"
```

---

## Task 4: Admin POST API + unit tests

**Files:**

- Create: `apps/web-nuxt/server/api/admin/site-settings.post.ts`
- Create: `apps/web-nuxt/tests/unit/server/site-settings-post.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `apps/web-nuxt/tests/unit/server/site-settings-post.test.ts`:

```ts
import { AppwriteException } from "node-appwrite";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setRuntimeConfig } from "../../mocks/nuxt";
import type { RuntimeConfigStub } from "../../mocks/nuxt-helpers";

const { createDocument, updateDocument, createAdminClient } = vi.hoisted(() => {
  const createDocument = vi.fn();
  const updateDocument = vi.fn();
  const createAdminClient = vi.fn(() => ({
    databases: { createDocument, updateDocument },
  }));
  return { createDocument, updateDocument, createAdminClient };
});

vi.mock("~/server/utils/appwrite", () => ({
  createAdminClient,
  getDatabaseId: () => "test-database",
}));

const loadHandler = () => import("~/server/api/admin/site-settings.post");

const runtime: RuntimeConfigStub = {
  appwriteApiKey: "key",
  public: {
    appwriteEndpoint: "https://example.com",
    appwriteProjectId: "p1",
    databaseId: "test-database",
    articlesCollectionId: "articles",
    articleTranslationsCollectionId: "translations",
    categoriesCollectionId: "categories",
    storageBucketId: "storage",
    siteSettingsCollectionId: "site_settings",
  },
};

describe("POST /api/admin/site-settings", () => {
  beforeEach(() => {
    createDocument.mockReset();
    updateDocument.mockReset();
    createAdminClient.mockReturnValue({
      databases: { createDocument, updateDocument },
    });
    setRuntimeConfig(runtime);
    (globalThis as any).readBody = vi.fn();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("throws 401 when user is not authenticated", async () => {
    const handler = (await loadHandler()).default as (
      event: any
    ) => Promise<unknown>;
    await expect(handler({ context: { user: null } })).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it("throws 400 for an invalid layout value", async () => {
    (globalThis as any).readBody = vi.fn().mockResolvedValue({
      layout: "not-a-layout",
    });
    const handler = (await loadHandler()).default as (
      event: any
    ) => Promise<unknown>;
    await expect(
      handler({ context: { user: { $id: "u1" } } })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("creates the document when saving for the first time", async () => {
    (globalThis as any).readBody = vi.fn().mockResolvedValue({
      layout: "grid",
    });
    createDocument.mockResolvedValue({ layout: "grid" });
    const handler = (await loadHandler()).default as (
      event: any
    ) => Promise<unknown>;
    const result = await handler({ context: { user: { $id: "u1" } } });
    expect(createDocument).toHaveBeenCalledWith(
      "test-database",
      "site_settings",
      "global",
      { layout: "grid" }
    );
    expect(result).toEqual({ layout: "grid" });
  });

  it("updates the existing document when createDocument returns 409", async () => {
    (globalThis as any).readBody = vi.fn().mockResolvedValue({
      layout: "magazine",
    });
    createDocument.mockRejectedValue(
      new AppwriteException(
        "Document already exists",
        409,
        "document_already_exists",
        ""
      )
    );
    updateDocument.mockResolvedValue({ layout: "magazine" });
    const handler = (await loadHandler()).default as (
      event: any
    ) => Promise<unknown>;
    const result = await handler({ context: { user: { $id: "u1" } } });
    expect(updateDocument).toHaveBeenCalledWith(
      "test-database",
      "site_settings",
      "global",
      { layout: "magazine" }
    );
    expect(result).toEqual({ layout: "magazine" });
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd apps/web-nuxt && npx vitest run tests/unit/server/site-settings-post.test.ts
```

Expected: 4 failing tests — `Cannot find module '~/server/api/admin/site-settings.post'`.

- [ ] **Step 3: Implement the POST handler**

Create `apps/web-nuxt/server/api/admin/site-settings.post.ts`:

```ts
import { AppwriteException } from "node-appwrite";
import { createAdminClient, getDatabaseId } from "~/server/utils/appwrite";
import type { LayoutType, SiteSettings } from "~/types/site-settings";

const VALID_LAYOUTS: LayoutType[] = [
  "grid",
  "hero-grid",
  "hero-sidebar",
  "magazine",
];

export default defineEventHandler(async (event): Promise<SiteSettings> => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const body = await readBody<Record<string, unknown>>(event);
  const layout = body?.layout as string;

  if (!VALID_LAYOUTS.includes(layout as LayoutType)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid layout value",
    });
  }

  const config = useRuntimeConfig();
  const { databases } = createAdminClient();
  const databaseId = getDatabaseId();
  const collectionId = config.public.siteSettingsCollectionId;

  try {
    await databases.createDocument(databaseId, collectionId, "global", {
      layout,
    });
  } catch (e) {
    if (e instanceof AppwriteException && e.code === 409) {
      await databases.updateDocument(databaseId, collectionId, "global", {
        layout,
      });
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to save layout",
      });
    }
  }

  return { layout: layout as LayoutType };
});
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd apps/web-nuxt && npx vitest run tests/unit/server/site-settings-post.test.ts
```

Expected: 4 passing tests.

- [ ] **Step 5: Run all unit tests to check for regressions**

```bash
cd apps/web-nuxt && npx vitest run
```

Expected: all unit tests pass.

- [ ] **Step 6: Commit**

```bash
git add apps/web-nuxt/server/api/admin/site-settings.post.ts apps/web-nuxt/tests/unit/server/site-settings-post.test.ts
git commit -m "feat(layout-switcher): add POST /api/admin/site-settings with unit tests"
```

---

## Task 5: Pinia store + SSR plugin

**Files:**

- Create: `apps/web-nuxt/stores/siteSettings.ts`
- Create: `apps/web-nuxt/plugins/site-settings.server.ts`

- [ ] **Step 1: Create the Pinia store**

Create `apps/web-nuxt/stores/siteSettings.ts`:

```ts
import { defineStore } from "pinia";
import type { LayoutType, SiteSettings } from "~/types/site-settings";

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

- [ ] **Step 2: Create the server-only plugin**

Create `apps/web-nuxt/plugins/site-settings.server.ts`:

```ts
import { useSiteSettingsStore } from "~/stores/siteSettings";

export default defineNuxtPlugin(async () => {
  const store = useSiteSettingsStore();
  await store.fetchLayout().catch(() => {});
});
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd apps/web-nuxt && npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web-nuxt/stores/siteSettings.ts apps/web-nuxt/plugins/site-settings.server.ts
git commit -m "feat(layout-switcher): add Pinia store and SSR hydration plugin"
```

---

## Task 6: `useLayoutComponent` composable

**Files:**

- Create: `apps/web-nuxt/composables/useLayoutComponent.ts`

- [ ] **Step 1: Create the composable**

Create `apps/web-nuxt/composables/useLayoutComponent.ts`:

```ts
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useSiteSettingsStore } from "~/stores/siteSettings";
import type { LayoutType } from "~/types/site-settings";

export function useLayoutComponent() {
  const { layout } = storeToRefs(useSiteSettingsStore());
  const map: Record<LayoutType, ReturnType<typeof resolveComponent>> = {
    grid: resolveComponent("LayoutsGridLayout"),
    "hero-grid": resolveComponent("LayoutsHeroGridLayout"),
    "hero-sidebar": resolveComponent("LayoutsHeroSidebarLayout"),
    magazine: resolveComponent("LayoutsMagazineLayout"),
  };
  return computed(() => map[layout.value]);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd apps/web-nuxt && npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web-nuxt/composables/useLayoutComponent.ts
git commit -m "feat(layout-switcher): add useLayoutComponent composable"
```

---

## Task 7: GridLayout component

**Files:**

- Create: `apps/web-nuxt/components/layouts/GridLayout.vue`

- [ ] **Step 1: Create the component**

Create `apps/web-nuxt/components/layouts/GridLayout.vue`:

```vue
<script setup lang="ts">
import type { Article } from "~/types/article";

defineProps<{
  articles: Article[];
  featured?: Article[];
}>();
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div
      class="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
    >
      <ArticleCard
        v-for="article in articles"
        :key="article.$id"
        :article="article"
      />
    </div>
  </section>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web-nuxt/components/layouts/GridLayout.vue
git commit -m "feat(layout-switcher): add GridLayout component (archetype A)"
```

---

## Task 8: HeroGridLayout component

This layout is extracted from the current inline markup in `pages/index.vue`.

**Files:**

- Create: `apps/web-nuxt/components/layouts/HeroGridLayout.vue`

- [ ] **Step 1: Create the component**

Create `apps/web-nuxt/components/layouts/HeroGridLayout.vue`:

```vue
<script setup lang="ts">
import { computed } from "vue";
import type { Article } from "~/types/article";

const props = defineProps<{
  articles: Article[];
  featured?: Article[];
}>();

const { t } = useI18n();
const localePath = useLocalePath();

const effectiveFeatured = computed(() =>
  props.featured?.length ? props.featured : props.articles.slice(0, 3)
);
</script>

<template>
  <div>
    <section
      v-if="effectiveFeatured.length > 0"
      class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div class="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
        <div class="md:col-span-8">
          <ArticleCard
            :article="effectiveFeatured[0]"
            variant="featured"
            class="h-full"
          />
        </div>
        <div
          v-if="effectiveFeatured.length > 1"
          class="flex flex-col gap-6 md:col-span-4"
        >
          <ArticleCard
            v-for="article in effectiveFeatured.slice(1, 3)"
            :key="article.$id"
            :article="article"
            variant="compact"
          />
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="mb-8 flex items-baseline justify-between">
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">
          {{ t("section_latest") }}
        </h2>
        <NuxtLink
          :to="localePath('/artigos')"
          class="text-sm font-medium text-primary hover:underline"
        >
          {{ t("filter_all") }} →
        </NuxtLink>
      </div>
      <div
        class="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        <ArticleCard
          v-for="article in articles"
          :key="article.$id"
          :article="article"
        />
      </div>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web-nuxt/components/layouts/HeroGridLayout.vue
git commit -m "feat(layout-switcher): add HeroGridLayout component (archetype B)"
```

---

## Task 9: HeroSidebarLayout component

**Files:**

- Create: `apps/web-nuxt/components/layouts/HeroSidebarLayout.vue`

- [ ] **Step 1: Create the component**

Create `apps/web-nuxt/components/layouts/HeroSidebarLayout.vue`:

```vue
<script setup lang="ts">
import { computed } from "vue";
import type { Article } from "~/types/article";

const props = defineProps<{
  articles: Article[];
  featured?: Article[];
}>();

const { t } = useI18n();

const effectiveFeatured = computed(() =>
  props.featured?.length ? props.featured : props.articles.slice(0, 3)
);
</script>

<template>
  <div>
    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
        <div class="md:col-span-7">
          <ArticleCard
            v-if="effectiveFeatured[0]"
            :article="effectiveFeatured[0]"
            variant="featured"
            class="h-full"
          />
        </div>
        <aside class="md:col-span-5">
          <h2
            class="mb-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500"
          >
            {{ t("section_latest") }}
          </h2>
          <div class="flex flex-col divide-y divide-slate-100">
            <ArticleCard
              v-for="article in articles.slice(0, 5)"
              :key="article.$id"
              :article="article"
              variant="compact"
              class="py-3 first:pt-0"
            />
          </div>
        </aside>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div
        class="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        <ArticleCard
          v-for="article in articles"
          :key="article.$id"
          :article="article"
        />
      </div>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web-nuxt/components/layouts/HeroSidebarLayout.vue
git commit -m "feat(layout-switcher): add HeroSidebarLayout component (archetype C)"
```

---

## Task 10: MagazineLayout component

**Files:**

- Create: `apps/web-nuxt/components/layouts/MagazineLayout.vue`

- [ ] **Step 1: Create the component**

Create `apps/web-nuxt/components/layouts/MagazineLayout.vue`:

```vue
<script setup lang="ts">
import { computed } from "vue";
import type { Article } from "~/types/article";

const props = defineProps<{
  articles: Article[];
  featured?: Article[];
}>();

const effectiveFeatured = computed(() =>
  props.featured?.length ? props.featured : props.articles.slice(0, 3)
);
</script>

<template>
  <div>
    <section class="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
      <ArticleCard
        v-if="effectiveFeatured[0]"
        :article="effectiveFeatured[0]"
        variant="featured"
      />
    </section>

    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div
        class="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        <ArticleCard
          v-for="article in articles"
          :key="article.$id"
          :article="article"
        />
      </div>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web-nuxt/components/layouts/MagazineLayout.vue
git commit -m "feat(layout-switcher): add MagazineLayout component (archetype D)"
```

---

## Task 11: Wire up public pages

**Files:**

- Modify: `apps/web-nuxt/pages/index.vue`
- Modify: `apps/web-nuxt/pages/artigos/index.vue`
- Modify: `apps/web-nuxt/pages/categorias/[category].vue`

- [ ] **Step 1: Update `pages/index.vue`**

Replace the entire file content with:

```vue
<script setup lang="ts">
import PageHeroShell from "@/components/PageHeroShell.vue";

const { locale, t } = useI18n();

const [{ data: featuredData }, { data: recentData }] = await Promise.all([
  useAsyncData(`featured-${locale.value}`, () =>
    $fetch("/api/articles/featured", {
      query: { locale: locale.value, limit: 3 },
    })
  ),
  useAsyncData(`recent-${locale.value}`, () =>
    $fetch("/api/articles/list", { query: { locale: locale.value, limit: 24 } })
  ),
]);

const featured = computed(() => featuredData.value?.articles ?? []);
const recent = computed(() => recentData.value?.articles ?? []);

const currentLayout = useLayoutComponent();
</script>

<template>
  <main class="min-h-screen bg-white">
    <PageHeroShell :title="t('hero_title')" :quote="t('hero_subtitle')" />
    <component :is="currentLayout" :articles="recent" :featured="featured" />
  </main>
</template>

<style scoped>
main {
  content-visibility: visible;
}
</style>
```

- [ ] **Step 2: Update `pages/artigos/index.vue`**

Replace the entire file content with:

```vue
<script setup lang="ts">
const { locale, t } = useI18n();

const { data, error } = await useAsyncData(`articles-${locale.value}`, () =>
  $fetch("/api/articles/list", { query: { locale: locale.value, limit: 50 } })
);

if (error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: "Failed to load articles",
  });
}

const articles = computed(() => data.value?.articles ?? []);
const currentLayout = useLayoutComponent();
</script>

<template>
  <main>
    <div class="mx-auto max-w-7xl px-4 pt-10 pb-2 sm:px-6 lg:px-8">
      <h1 class="mb-8 text-3xl font-black text-slate-900">
        {{ t("page_artigos_heading") }}
      </h1>
    </div>
    <component :is="currentLayout" :articles="articles" />
  </main>
</template>
```

- [ ] **Step 3: Update `pages/categorias/[category].vue`**

Replace the entire file content with:

```vue
<script setup lang="ts">
import { CATEGORIES } from "~/server/utils/appwrite";

const route = useRoute();
const { locale, t } = useI18n();

const categorySlug = computed(() => String(route.params.category ?? ""));
const category = computed(() =>
  CATEGORIES.find((item) => item.slug === categorySlug.value)
);
if (!category.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Categoria não encontrada",
  });
}

const { data, error } = await useAsyncData(
  `category-${categorySlug.value}-${locale.value}`,
  () =>
    $fetch(`/api/articles/category/${categorySlug.value}`, {
      query: { locale: locale.value, limit: 50 },
    })
);

if (error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: "Failed to load category",
  });
}

const articles = computed(() => data.value?.articles ?? []);
const currentLayout = useLayoutComponent();
</script>

<template>
  <main>
    <div class="mx-auto max-w-7xl px-4 pt-10 pb-2 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-black text-slate-900">{{ category?.name }}</h1>
      <p class="mt-2 text-slate-600">{{ category?.description }}</p>
    </div>
    <p
      v-if="!articles.length"
      class="mx-auto max-w-7xl px-4 pb-10 text-sm text-slate-500 sm:px-6 lg:px-8"
    >
      {{ t("empty_category") }}
    </p>
    <component v-else :is="currentLayout" :articles="articles" />
  </main>
</template>
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd apps/web-nuxt && npm run typecheck
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add apps/web-nuxt/pages/index.vue apps/web-nuxt/pages/artigos/index.vue apps/web-nuxt/pages/categorias/[category].vue
git commit -m "feat(layout-switcher): wire public pages to use dynamic layout component"
```

---

## Task 12: Admin settings UI (Aparência)

**Files:**

- Modify: `apps/web-nuxt/pages/admin/settings.vue`

- [ ] **Step 1: Replace the WIP placeholder with the Aparência layout picker**

Replace the entire file content of `apps/web-nuxt/pages/admin/settings.vue` with:

```vue
<script setup lang="ts">
import { useSiteSettingsStore } from "~/stores/siteSettings";
import type { LayoutType } from "~/types/site-settings";

definePageMeta({ layout: "admin", middleware: ["admin"] });

const { t } = useI18n();

useHead({
  title: () => t("admin_settings_document_title"),
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

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

type LayoutOption = {
  id: LayoutType;
  name: string;
  description: string;
};

const layouts: LayoutOption[] = [
  {
    id: "grid",
    name: "Grade Uniforme",
    description: "Grade de cards idênticos em 3 colunas.",
  },
  {
    id: "hero-grid",
    name: "Herói + Grade",
    description: "Destaque à esquerda, dois compactos à direita, grade abaixo.",
  },
  {
    id: "hero-sidebar",
    name: "Herói + Sidebar",
    description: "Destaque à esquerda, lista lateral de últimas notícias.",
  },
  {
    id: "magazine",
    name: "Revista",
    description: "Banner em destaque no topo, grade editorial em 3 colunas.",
  },
];
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
    <h1 class="text-2xl font-black uppercase tracking-tighter text-slate-900">
      Configurações
    </h1>

    <section class="mt-10">
      <h2
        class="text-base font-black uppercase tracking-[0.15em] text-slate-500"
      >
        Aparência
      </h2>
      <p class="mt-1 text-sm text-slate-600">
        Escolha como os artigos são apresentados ao público.
      </p>

      <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <button
          v-for="option in layouts"
          :key="option.id"
          type="button"
          :aria-pressed="pendingLayout === option.id"
          :class="[
            'relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
            pendingLayout === option.id
              ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2'
              : 'border-slate-200 hover:border-slate-400',
          ]"
          @click="pendingLayout = option.id"
        >
          <!-- SVG thumbnail -->
          <svg
            v-if="option.id === 'grid'"
            viewBox="0 0 160 100"
            class="w-full rounded"
            aria-hidden="true"
          >
            <rect width="160" height="100" fill="#f8fafc" rx="4" />
            <rect x="4" y="4" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="57" y="4" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="110" y="4" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="4" y="38" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="57" y="38" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="110" y="38" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="4" y="72" width="46" height="24" rx="2" fill="#e2e8f0" />
            <rect x="57" y="72" width="46" height="24" rx="2" fill="#e2e8f0" />
            <rect x="110" y="72" width="46" height="24" rx="2" fill="#e2e8f0" />
          </svg>

          <svg
            v-else-if="option.id === 'hero-grid'"
            viewBox="0 0 160 100"
            class="w-full rounded"
            aria-hidden="true"
          >
            <rect width="160" height="100" fill="#f8fafc" rx="4" />
            <rect x="4" y="4" width="90" height="44" rx="2" fill="#cbd5e1" />
            <rect x="100" y="4" width="56" height="20" rx="2" fill="#e2e8f0" />
            <rect x="100" y="28" width="56" height="20" rx="2" fill="#e2e8f0" />
            <rect x="4" y="54" width="46" height="22" rx="2" fill="#e2e8f0" />
            <rect x="57" y="54" width="46" height="22" rx="2" fill="#e2e8f0" />
            <rect x="110" y="54" width="46" height="22" rx="2" fill="#e2e8f0" />
            <rect x="4" y="80" width="46" height="16" rx="2" fill="#e2e8f0" />
            <rect x="57" y="80" width="46" height="16" rx="2" fill="#e2e8f0" />
            <rect x="110" y="80" width="46" height="16" rx="2" fill="#e2e8f0" />
          </svg>

          <svg
            v-else-if="option.id === 'hero-sidebar'"
            viewBox="0 0 160 100"
            class="w-full rounded"
            aria-hidden="true"
          >
            <rect width="160" height="100" fill="#f8fafc" rx="4" />
            <rect x="4" y="4" width="88" height="44" rx="2" fill="#cbd5e1" />
            <rect x="98" y="4" width="58" height="8" rx="1" fill="#e2e8f0" />
            <rect x="98" y="15" width="58" height="8" rx="1" fill="#e2e8f0" />
            <rect x="98" y="26" width="58" height="8" rx="1" fill="#e2e8f0" />
            <rect x="98" y="37" width="58" height="8" rx="1" fill="#e2e8f0" />
            <rect x="4" y="54" width="46" height="22" rx="2" fill="#e2e8f0" />
            <rect x="57" y="54" width="46" height="22" rx="2" fill="#e2e8f0" />
            <rect x="110" y="54" width="46" height="22" rx="2" fill="#e2e8f0" />
            <rect x="4" y="80" width="46" height="16" rx="2" fill="#e2e8f0" />
            <rect x="57" y="80" width="46" height="16" rx="2" fill="#e2e8f0" />
            <rect x="110" y="80" width="46" height="16" rx="2" fill="#e2e8f0" />
          </svg>

          <svg
            v-else-if="option.id === 'magazine'"
            viewBox="0 0 160 100"
            class="w-full rounded"
            aria-hidden="true"
          >
            <rect width="160" height="100" fill="#f8fafc" rx="4" />
            <rect x="4" y="4" width="152" height="30" rx="2" fill="#cbd5e1" />
            <rect x="4" y="40" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="57" y="40" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="110" y="40" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="4" y="72" width="46" height="24" rx="2" fill="#e2e8f0" />
            <rect x="57" y="72" width="46" height="24" rx="2" fill="#e2e8f0" />
            <rect x="110" y="72" width="46" height="24" rx="2" fill="#e2e8f0" />
          </svg>

          <!-- Checkmark badge -->
          <span
            v-if="pendingLayout === option.id"
            class="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white"
            aria-hidden="true"
          >
            <svg viewBox="0 0 12 12" class="h-3 w-3">
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                stroke-width="1.5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>

          <span class="text-xs font-bold text-slate-700">{{
            option.name
          }}</span>
          <span class="text-center text-[10px] leading-tight text-slate-500">
            {{ option.description }}
          </span>
        </button>
      </div>

      <div class="mt-6 flex items-center gap-4">
        <button
          type="button"
          :disabled="saving"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
          @click="save"
        >
          <svg
            v-if="saving"
            class="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          {{ saving ? "Salvando…" : "Salvar layout" }}
        </button>

        <p v-if="success" class="text-sm font-medium text-green-600">
          Layout salvo com sucesso.
        </p>
        <p v-if="error" class="text-sm font-medium text-red-600">
          {{ error }}
        </p>
      </div>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd apps/web-nuxt && npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web-nuxt/pages/admin/settings.vue
git commit -m "feat(layout-switcher): add Aparência layout picker to admin settings"
```

---

## Task 13: E2e test for admin settings layout picker

**Files:**

- Create: `apps/web-nuxt/tests/e2e/p1/layout-switcher.spec.ts`

- [ ] **Step 1: Write the e2e test**

Create `apps/web-nuxt/tests/e2e/p1/layout-switcher.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test.describe("@p1 Admin settings — layout switcher", () => {
  test("[P1] /admin/settings redirects to login when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/admin/settings");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("[P1] Aparência section shows 4 layout thumbnails when authenticated", async ({
    page,
  }, testInfo) => {
    const session = process.env.E2E_ADMIN_SESSION;
    const projectId = process.env.NUXT_PUBLIC_APPWRITE_PROJECT_ID;
    testInfo.skip(
      !session || !projectId,
      "Set E2E_ADMIN_SESSION and NUXT_PUBLIC_APPWRITE_PROJECT_ID to run authenticated tests"
    );

    await page.context().addCookies([
      {
        name: `a_session_${projectId}`,
        value: session!,
        domain: "localhost",
        path: "/",
      },
    ]);

    await page.goto("/admin/settings");
    await expect(
      page.getByRole("heading", { name: /Aparência/i })
    ).toBeVisible();

    const thumbnails = page.getByRole("button", { pressed: /true|false/ });
    await expect(thumbnails).toHaveCount(4);

    await expect(
      page.getByRole("button", { name: /Grade Uniforme/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Herói \+ Grade/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Herói \+ Sidebar/i })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Revista/i })).toBeVisible();

    await expect(
      page.getByRole("button", { name: /Salvar layout/i })
    ).toBeVisible();
  });

  test("[P1] clicking a thumbnail updates the selected state", async ({
    page,
  }, testInfo) => {
    const session = process.env.E2E_ADMIN_SESSION;
    const projectId = process.env.NUXT_PUBLIC_APPWRITE_PROJECT_ID;
    testInfo.skip(
      !session || !projectId,
      "Set E2E_ADMIN_SESSION and NUXT_PUBLIC_APPWRITE_PROJECT_ID to run authenticated tests"
    );

    await page.context().addCookies([
      {
        name: `a_session_${projectId}`,
        value: session!,
        domain: "localhost",
        path: "/",
      },
    ]);

    await page.goto("/admin/settings");

    const gradeButton = page.getByRole("button", { name: /Grade Uniforme/i });
    await gradeButton.click();
    await expect(gradeButton).toHaveAttribute("aria-pressed", "true");
  });
});
```

- [ ] **Step 2: Run the unauthenticated test (should pass without credentials)**

```bash
cd apps/web-nuxt && npx playwright test tests/e2e/p1/layout-switcher.spec.ts --project=chromium --grep "redirects to login"
```

Expected: 1 passing test.

- [ ] **Step 3: Commit**

```bash
git add apps/web-nuxt/tests/e2e/p1/layout-switcher.spec.ts
git commit -m "test(layout-switcher): add e2e tests for admin settings layout picker"
```

---

## Task 14: Final verification

- [ ] **Step 1: Run all unit tests**

```bash
cd apps/web-nuxt && npx vitest run
```

Expected: all tests pass.

- [ ] **Step 2: Run P0 e2e suite**

```bash
cd apps/web-nuxt && npx playwright test tests/e2e/p0 --project=chromium
```

Expected: all existing P0 tests pass (no regressions).

- [ ] **Step 3: Type-check the whole app**

```bash
cd apps/web-nuxt && npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Create the Appwrite `site_settings` collection**

In the Appwrite console (or via the Appwrite CLI), create the collection:

- **Database:** same database used by the app (`NUXT_PUBLIC_DATABASE_ID`)
- **Collection ID:** must match `NUXT_PUBLIC_SITE_SETTINGS_COLLECTION_ID` in `.env`
- **Collection name:** `site_settings`
- **Attribute:** `layout` (string, size 32, required)
- **Permissions:** Read = Any, Create/Update = Members (so the admin API key can write)

Set the env var in `.env`:

```
NUXT_PUBLIC_SITE_SETTINGS_COLLECTION_ID=<your-collection-id>
```

- [ ] **Step 5: Start dev server and manually verify end-to-end**

```bash
cd apps/web-nuxt && npm run dev
```

1. Open `http://localhost:3000` — should render the default `hero-grid` layout
2. Log in to admin → go to `/admin/settings`
3. Click **Grade Uniforme** thumbnail → click **Salvar layout**
4. Verify success message appears
5. Navigate to `http://localhost:3000` — should now render the plain 3-col grid
6. Switch back to **Herói + Grade** and save — homepage returns to hero layout
