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
