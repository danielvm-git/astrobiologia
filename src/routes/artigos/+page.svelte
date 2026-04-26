<script lang="ts">
  import { page } from "$app/state";
  import ArticleCard from "$lib/components/ArticleCard.svelte";
  import ContentLoadErrorNotice from "$lib/components/ContentLoadErrorNotice.svelte";
  import PageHeroShell from "$lib/components/PageHeroShell.svelte";
  import { CATEGORIES } from "$lib/appwrite";
  import type { Article } from "$lib/appwrite";
  import * as m from "$lib/paraglide/messages";

  let { data } = $props();

  let selectedCategory = $state("all");
  let searchQuery = $state("");

  const categoryLabel = $derived.by(() => {
    void page.url;
    return (slug: string) => {
      switch (slug) {
        case "noticias":
          return m.category_noticias();
        case "entrevistas":
          return m.category_entrevistas();
        case "analises":
          return m.category_analises();
        case "pesquisas-brasileiras":
          return m.category_pesquisas();
        case "exoplanetas":
          return m.category_exoplanetas();
        case "extremofilos":
          return m.category_extremofilos();
        default:
          return slug;
      }
    };
  });

  const filteredArticles = $derived(
    data.articles.filter((article: Article) => {
      const a = article as Article & {
        description?: string;
        title?: string;
        excerpt?: string;
        content?: string;
        translation?: { title?: string; excerpt?: string; content?: string };
      };
      const title = (a.translation?.title ?? a.title ?? "").toLowerCase();
      const blob =
        `${a.translation?.excerpt ?? ""} ${a.translation?.content ?? ""} ${a.description ?? ""} ${a.excerpt ?? ""}`.toLowerCase();
      const matchesCategory =
        selectedCategory === "all" || article.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || title.includes(q) || blob.includes(q);
      return matchesCategory && matchesSearch;
    }) as Article[]
  );

  const categories = $derived([
    { slug: "all", name: m.filter_all() },
    ...CATEGORIES.map((c) => ({
      slug: c.slug,
      name: categoryLabel(c.slug),
    })),
  ]);
</script>

<svelte:head>
  <title>{m.page_artigos_heading()} — {m.site_title()}</title>
  <meta name="description" content={m.hero_subtitle()} />
  <meta
    property="og:title"
    content={`${m.page_artigos_heading()} — ${m.site_title()}`}
  />
  <meta property="og:description" content={m.hero_subtitle()} />
</svelte:head>

<main class="min-h-screen bg-background">
  {#key page.url.pathname}
    <PageHeroShell title={m.page_artigos_heading()} quote={m.hero_subtitle()} />
  {/key}

  <section class="border-t border-slate-200 bg-slate-50 py-12 md:py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <ContentLoadErrorNotice show={data.listLoadError === true} />
      <div
        class="mb-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              for="search"
              class="mb-2 block text-sm font-medium text-slate-700"
            >
              {m.search_placeholder().replace(/\.\.\.$/, "")}
            </label>
            <input
              id="search"
              type="text"
              placeholder={m.search_placeholder()}
              bind:value={searchQuery}
              class="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label
              for="category"
              class="mb-2 block text-sm font-medium text-slate-700"
            >
              {m.category_label()}
            </label>
            <select
              id="category"
              bind:value={selectedCategory}
              class="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
            >
              {#each categories as cat}
                <option value={cat.slug}>{cat.name}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>

      {#if !data.listLoadError && filteredArticles.length > 0}
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {#each filteredArticles as article (article.$id)}
            <ArticleCard {article} />
          {/each}
        </div>
      {:else if !data.listLoadError}
        <div
          class="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center"
        >
          <p class="text-xl text-slate-600">{m.empty_category()}</p>
          <button
            type="button"
            onclick={() => {
              selectedCategory = "all";
              searchQuery = "";
            }}
            class="mt-4 font-medium text-primary hover:underline"
          >
            {m.empty_category_cta()}
          </button>
        </div>
      {/if}
    </div>
  </section>
</main>
