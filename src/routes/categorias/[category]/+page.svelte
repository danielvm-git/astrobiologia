<script lang="ts">
  import { page } from "$app/state";
  import type { Article } from "$lib/appwrite";
  import ArticleCard from "$lib/components/ArticleCard.svelte";
  import ContentLoadErrorNotice from "$lib/components/ContentLoadErrorNotice.svelte";
  import {
    getCategoryDescriptionI18n,
    getCategoryTitleI18n,
  } from "$lib/i18n/category-messages";
  import { Telescope } from "lucide-svelte";
  import * as m from "$lib/paraglide/messages";
  import { localizeHref } from "$lib/paraglide/runtime";

  let { data } = $props();

  const articles = $derived(data.articles as unknown as Article[]);
  const copy = $derived.by(() => {
    void page.url;
    const slug = data.categorySlug;
    return {
      title: getCategoryTitleI18n(slug),
      description: getCategoryDescriptionI18n(slug),
    };
  });
</script>

<svelte:head>
  <title>{copy.title} - Astrobiologia</title>
  <meta name="description" content={copy.description} />
</svelte:head>

<main class="min-h-screen bg-background pt-32 pb-24">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-20">
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol
          class="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-slate-400"
        >
          <li>
            <a
              href={localizeHref("/")}
              class="hover:text-primary transition-colors">{m.nav_home()}</a
            >
          </li>
          <li class="flex items-center space-x-4">
            <span class="text-slate-300">/</span>
            <span class="text-slate-900">{m.category_label()}</span>
          </li>
          <li class="flex items-center space-x-4">
            <span class="text-slate-300">/</span>
            <span class="text-primary">{copy.title}</span>
          </li>
        </ol>
      </nav>

      <div class="max-w-4xl">
        <h1
          class="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-8 font-sans tracking-tight uppercase"
        >
          {copy.title}
        </h1>
        <p
          class="text-xl md:text-2xl text-slate-600 font-serif leading-relaxed italic border-l-4 border-accent pl-8 py-2"
        >
          {copy.description}
        </p>
      </div>
    </div>

    <ContentLoadErrorNotice show={data.listLoadError === true} />
    <!-- Results -->
    {#if !data.listLoadError && articles.length > 0}
      <div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {#each articles as article (article.$id)}
          <ArticleCard {article} />
        {/each}
      </div>
    {:else if !data.listLoadError}
      <div
        class="py-40 text-center bg-slate-50 border border-dashed border-slate-200"
      >
        <Telescope class="h-16 w-16 mx-auto text-slate-300 mb-8" />
        <h2 class="text-2xl font-bold text-slate-900 mb-4 font-serif">
          {m.empty_category()}
        </h2>
        <p class="text-slate-500 font-serif mb-10 max-w-md mx-auto">
          {m.newsletter_subtitle()}
        </p>
        <a
          href={localizeHref("/")}
          class="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all duration-300"
        >
          {m.empty_category_cta()}
        </a>
      </div>
    {/if}
  </div>
</main>
