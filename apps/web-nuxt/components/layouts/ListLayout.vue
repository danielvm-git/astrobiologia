<script setup lang="ts">
import type { Article } from "~/types/article";

defineProps<{
  articles: Article[];
  featured?: Article[];
}>();
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="divide-y divide-slate-100">
      <ArticleCard
        v-for="article in articles"
        :key="article.$id"
        :article="article"
        variant="compact"
        class="py-6 first:pt-0"
      />
    </div>
  </section>
</template>
