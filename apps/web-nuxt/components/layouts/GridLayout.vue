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
