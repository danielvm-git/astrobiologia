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
