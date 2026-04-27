<script setup lang="ts">
import ArticleCard from "@/components/ArticleCard.vue";
import PageHeroShell from "@/components/PageHeroShell.vue";

const { locale, t } = useI18n();
const localePath = useLocalePath();

const [
  { data: featuredData, error: featuredError },
  { data: recentData, error: recentError },
] = await Promise.all([
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
</script>

<template>
  <main class="min-h-screen bg-white">
    <PageHeroShell :title="t('hero_title')" :quote="t('hero_subtitle')" />

    <section
      v-if="featured.length > 0"
      class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div class="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
        <div class="md:col-span-8">
          <ArticleCard
            :article="featured[0]"
            variant="featured"
            class="h-full"
          />
        </div>
        <div
          v-if="featured.length > 1"
          class="flex flex-col gap-6 md:col-span-4"
        >
          <ArticleCard
            v-for="article in featured.slice(1, 4)"
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
          >{{ t("filter_all") }} →</NuxtLink
        >
      </div>
      <div
        class="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        <ArticleCard
          v-for="article in recent"
          :key="article.$id"
          :article="article"
        />
      </div>
    </section>
  </main>
</template>
