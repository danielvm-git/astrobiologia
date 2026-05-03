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
