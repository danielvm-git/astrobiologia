<script setup lang="ts">
import ArticleCard from "@/components/ArticleCard.vue";

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
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <h1 class="mb-8 text-3xl font-black text-slate-900">
      {{ t("page_artigos_heading") }}
    </h1>
    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <ArticleCard
        v-for="article in articles"
        :key="article.$id"
        :article="article"
      />
    </div>
  </main>
</template>
