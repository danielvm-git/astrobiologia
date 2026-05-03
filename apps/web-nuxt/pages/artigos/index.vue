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
