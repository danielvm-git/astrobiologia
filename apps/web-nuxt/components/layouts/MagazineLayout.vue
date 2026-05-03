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
