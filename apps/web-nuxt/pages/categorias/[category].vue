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
