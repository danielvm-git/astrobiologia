<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

type AdminArticleRow = { $id: string; title: string; status?: string };

const { data, refresh } = await useAsyncData(
  "admin-articles",
  async () =>
    (await fetch("/api/admin/articles/list").then((response) =>
      response.json()
    )) as {
      articles: AdminArticleRow[];
    }
);

const articles = computed<AdminArticleRow[]>(() => data.value?.articles ?? []);

async function removeArticle(id: string) {
  await fetch("/api/admin/articles/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  await refresh();
}
</script>

<template>
  <section>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-black">Artigos</h1>
      <NuxtLink
        to="/admin/artigos/new"
        class="rounded bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-white"
        >Novo artigo</NuxtLink
      >
    </div>
    <div class="overflow-x-auto rounded border border-slate-200 bg-white">
      <table class="w-full text-left text-sm">
        <thead
          class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500"
        >
          <tr>
            <th class="px-4 py-3">Título</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="article in articles"
            :key="article.$id"
            class="border-b border-slate-100"
          >
            <td class="px-4 py-3">{{ article.title }}</td>
            <td class="px-4 py-3">{{ article.status }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <NuxtLink
                  :to="`/admin/artigos/${article.$id}/edit`"
                  class="text-xs font-bold text-primary"
                  >Editar</NuxtLink
                >
                <button
                  class="text-xs font-bold text-red-600"
                  @click="removeArticle(article.$id)"
                >
                  Excluir
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
