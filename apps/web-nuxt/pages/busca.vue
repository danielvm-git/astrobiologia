<script setup lang="ts">
import ArticleCard from "~/components/ArticleCard.vue";

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();

const query = ref(typeof route.query.q === "string" ? route.query.q : "");

const { data, refresh } = await useAsyncData(
  () => `search-${locale.value}-${query.value}`,
  () =>
    $fetch("/api/search", { query: { q: query.value, locale: locale.value } })
);

watch(
  () => route.query.q,
  (value) => {
    query.value = typeof value === "string" ? value : "";
    refresh();
  }
);

async function submitSearch() {
  await router.push({ query: query.value ? { q: query.value } : {} });
}

const articles = computed(() => data.value?.articles ?? []);
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
    <h1 class="text-4xl font-black tracking-tight text-slate-900">
      Busca Global
    </h1>
    <p class="mt-4 text-sm text-slate-600">
      Encontre reportagens por tema, título ou conteúdo.
    </p>

    <form
      class="mt-8 flex flex-col gap-3 sm:flex-row"
      @submit.prevent="submitSearch"
    >
      <input
        v-model="query"
        type="search"
        placeholder="Ex: exoplanetas com água"
        class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
      <button
        type="submit"
        class="rounded-xl bg-primary px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-primary/90"
      >
        {{ t("search_button") }}
      </button>
    </form>

    <p
      v-if="!query"
      class="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
    >
      Digite um termo para iniciar a busca.
    </p>

    <div v-else class="mt-8 space-y-6">
      <p class="text-sm text-slate-600">
        Resultados para: <strong>{{ query }}</strong> ({{ articles.length }})
      </p>
      <ArticleCard
        v-for="article in articles"
        :key="article.$id"
        :article="article"
      />
    </div>
  </main>
</template>
