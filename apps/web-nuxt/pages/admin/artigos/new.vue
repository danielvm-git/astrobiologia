<script setup lang="ts">
import ArticleEditor from "~/components/admin/ArticleEditor.vue";

definePageMeta({ layout: "admin", middleware: ["admin"] });

useHead({
  title: "Criar Artigo - Admin Astrobiologia",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const localePath = useLocalePath();
const saving = ref(false);

async function handleSave(
  articleData: Record<string, unknown>,
  translations: Array<Record<string, unknown>>
) {
  saving.value = true;
  try {
    await $fetch("/api/admin/articles/create", {
      method: "POST",
      body: {
        ...articleData,
        translations,
      },
    });
    await navigateTo(localePath("/admin/artigos"));
  } catch (err: unknown) {
    const msg =
      err &&
      typeof err === "object" &&
      "data" in err &&
      typeof (err as { data?: { statusMessage?: string } }).data
        ?.statusMessage === "string"
        ? (err as { data: { statusMessage: string } }).data.statusMessage
        : "Erro ao criar artigo.";
    alert(msg);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="mb-8">
    <h1 class="text-3xl font-black text-slate-900 uppercase tracking-tight">
      Criar Novo Artigo
    </h1>
    <p
      class="text-slate-500 mt-2 text-sm font-medium uppercase tracking-widest"
    >
      Inicie um novo conteúdo científico
    </p>
  </div>

  <ArticleEditor
    :article="null"
    :translations="[]"
    :saving="saving"
    @save="handleSave"
  />
</template>
