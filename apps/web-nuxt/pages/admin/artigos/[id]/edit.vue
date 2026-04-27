<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: ["admin"] });

const route = useRoute();
type AdminArticlePayload = {
  article?: Record<string, any>;
  translation?: Record<string, any>;
};

const { data } = await useAsyncData<AdminArticlePayload>(
  `admin-article-${route.params.id}`,
  () =>
    fetch(`/api/admin/articles/${route.params.id}`).then((response) =>
      response.json()
    )
);

const payload = reactive({
  category: data.value?.article?.category ?? "noticias",
  tags: data.value?.article?.tags ?? [],
  featuredImage: data.value?.article?.featuredImage ?? "",
  featuredImageAlt: data.value?.article?.featuredImageAlt ?? "",
  status: data.value?.article?.status ?? "draft",
  featured: data.value?.article?.featured ?? false,
  authorId: data.value?.article?.authorId ?? "",
  authorName: data.value?.article?.authorName ?? "",
  publishedAt: data.value?.article?.publishedAt ?? "",
  title: data.value?.translation?.title ?? data.value?.article?.title ?? "",
  slug: data.value?.translation?.slug ?? data.value?.article?.slug ?? "",
  excerpt:
    data.value?.translation?.excerpt ?? data.value?.article?.excerpt ?? "",
  content:
    data.value?.translation?.content ?? data.value?.article?.content ?? "",
});

async function save() {
  await fetch(`/api/admin/articles/${route.params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  await navigateTo("/admin/artigos");
}
</script>

<template>
  <section class="max-w-3xl space-y-4">
    <h1 class="text-2xl font-black">Editar artigo</h1>
    <input
      v-model="payload.title"
      placeholder="Título"
      class="w-full rounded border border-slate-200 px-3 py-2"
    />
    <input
      v-model="payload.slug"
      placeholder="Slug"
      class="w-full rounded border border-slate-200 px-3 py-2"
    />
    <textarea
      v-model="payload.excerpt"
      placeholder="Resumo"
      class="w-full rounded border border-slate-200 px-3 py-2"
    ></textarea>
    <textarea
      v-model="payload.content"
      placeholder="Conteúdo HTML"
      class="min-h-52 w-full rounded border border-slate-200 px-3 py-2"
    ></textarea>
    <button
      class="rounded bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-white"
      @click="save"
    >
      Salvar
    </button>
  </section>
</template>
