<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: ["admin"] });

const payload = reactive({
  category: "noticias",
  tags: [],
  featuredImage: "",
  featuredImageAlt: "",
  status: "draft",
  featured: false,
  authorId: "",
  authorName: "",
  publishedAt: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
});

async function save() {
  await fetch("/api/admin/articles/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  await navigateTo("/admin/artigos");
}
</script>

<template>
  <section class="max-w-3xl space-y-4">
    <h1 class="text-2xl font-black">Novo artigo</h1>
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
