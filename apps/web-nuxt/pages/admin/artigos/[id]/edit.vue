<script setup lang="ts">
import { computed } from "vue";
import ArticleEditor from "~/components/admin/ArticleEditor.vue";

definePageMeta({ layout: "admin", middleware: ["admin"] });

useHead({
  title: "Editar Artigo - Admin Astrobiologia",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const route = useRoute();
const localePath = useLocalePath();
const saving = ref(false);

type Payload = {
  article?: Record<string, unknown>;
  translations?: Array<Record<string, unknown>>;
};

const articleIdParam = String(
  Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
);

const { data, pending, error } = useAsyncData<Payload>(
  `admin-article-${articleIdParam}`,
  () =>
    $fetch<Payload>(`/api/admin/articles/${articleIdParam}`).catch(() => ({
      article: undefined,
      translations: [],
    }))
);

const isLoading = computed(() => pending.value);

async function handleSave(
  articleData: Record<string, unknown>,
  translations: Array<Record<string, unknown>>
) {
  saving.value = true;
  try {
    await $fetch(`/api/admin/articles/${articleIdParam}`, {
      method: "PUT",
      body: {
        ...articleData,
        translations,
      },
    });
    // Bust the Nuxt payload cache so the articles list re-fetches fresh data
    // (includes updated language indicators for newly added translations).
    clearNuxtData("admin-articles");
    await navigateTo(localePath("/admin/artigos"));
  } catch (err: unknown) {
    const msg =
      err &&
      typeof err === "object" &&
      "data" in err &&
      typeof (err as { data?: { statusMessage?: string } }).data
        ?.statusMessage === "string"
        ? (err as { data: { statusMessage: string } }).data.statusMessage
        : "Erro ao salvar artigo.";
    alert(msg);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div v-if="isLoading" class="py-20 text-center text-slate-500">
    Carregando...
  </div>
  <div
    v-else-if="error || !data?.article"
    class="py-20 text-center text-slate-500"
  >
    Artigo não encontrado.
  </div>
  <template v-else>
    <div class="mb-8">
      <h1 class="text-3xl font-black text-slate-900 uppercase tracking-tight">
        Editar Artigo
      </h1>
      <p
        class="text-slate-500 mt-2 text-sm font-medium uppercase tracking-widest"
      >
        Ajustando conteúdo e metadados
      </p>
    </div>

    <ArticleEditor
      v-if="data.translations"
      :article="data.article"
      :translations="data.translations"
      :saving="saving"
      @save="handleSave"
    />
  </template>
</template>
