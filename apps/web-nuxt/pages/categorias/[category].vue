<script setup lang="ts">
import ArticleCard from "~/components/ArticleCard.vue";
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
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-black text-slate-900">{{ category?.name }}</h1>
    <p class="mt-2 text-slate-600">{{ category?.description }}</p>

    <p v-if="!articles.length" class="mt-10 text-sm text-slate-500">
      {{ t("empty_category") }}
    </p>
    <div
      v-else
      class="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      <ArticleCard
        v-for="article in articles"
        :key="article.$id"
        :article="article"
      />
    </div>
  </main>
</template>
