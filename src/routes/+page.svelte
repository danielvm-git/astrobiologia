<script lang="ts">
	import { page } from '$app/state';
	import { CATEGORIES, getImageUrl } from '$lib/appwrite';
	import type { Article } from '$lib/appwrite';
	import { formatDate } from '$lib/utils';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import { Telescope } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	let activeCategory = $state('Todos');

	const recentArticles = $derived(
		(data.recent || [])
			.filter((a: any) => activeCategory === 'Todos' || a.category === activeCategory) as unknown as Article[]
	);

	/** Re-fetch Paraglide strings when locale segment in URL changes (client-side nav). */
	const copy = $derived.by(() => {
		const _ = page.url;
		const categories: Record<string, string> = {
			noticias: m.category_noticias(),
			entrevistas: m.category_entrevistas(),
			analises: m.category_analises(),
			'pesquisas-brasileiras': m.category_pesquisas(),
			exoplanetas: m.category_exoplanetas(),
			extremofilos: m.category_extremofilos()
		};
		return {
			site_title: m.site_title(),
			hero_title: m.hero_title(),
			hero_subtitle: m.hero_subtitle(),
			section_latest: m.section_latest(),
			filter_all: m.filter_all(),
			empty_category: m.empty_category(),
			empty_category_cta: m.empty_category_cta(),
			newsletter_title: m.newsletter_title(),
			newsletter_subtitle: m.newsletter_subtitle(),
			newsletter_placeholder: m.newsletter_placeholder(),
			newsletter_button: m.newsletter_button(),
			categoryLabel: (slug: string) => categories[slug] ?? slug
		};
	});
</script>

<svelte:head>
	<title>{copy.site_title} - {copy.hero_title}</title>
	<meta name="description" content={copy.hero_subtitle} />
</svelte:head>

<main class="bg-background min-h-screen">
	<!-- Hero: navy band sized to content (minimal vertical padding) -->
	<header class="bg-slate-900">
		<div class="mx-auto max-w-7xl px-4 pt-6 pb-3 text-center sm:px-6 md:pt-7 md:pb-5 lg:px-8">
			<h1 class="mb-1 font-sans text-4xl font-black tracking-tight text-white md:mb-2 md:text-6xl">
				{copy.hero_title}<span class="text-accent">.</span>
			</h1>
			<p class="mx-auto max-w-2xl font-serif text-lg italic text-slate-400 md:text-xl">
				{copy.hero_subtitle}
			</p>
		</div>
	</header>

	<!-- Main Content Feed -->
	<section class="py-12 md:py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-slate-200 pb-8">
				<div>
					<h2 class="text-2xl font-bold text-slate-900 font-sans uppercase tracking-widest">{copy.section_latest}</h2>
				</div>
				
				<!-- Category Filters -->
				<div class="flex flex-wrap gap-2">
					<button
						class="rounded-full px-5 py-2 text-sm font-semibold transition-all {activeCategory === 'Todos' ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary'}"
						onclick={() => activeCategory = 'Todos'}
					>
						{copy.filter_all}
					</button>
					{#each CATEGORIES as category (category.slug)}
						<button
							class="rounded-full px-5 py-2 text-sm font-semibold transition-all {activeCategory === category.slug ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary'}"
							onclick={() => activeCategory = category.slug}
						>
							{copy.categoryLabel(category.slug)}
						</button>
					{/each}
				</div>
			</div>

			{#if recentArticles.length > 0}
				<div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
					{#each recentArticles as article (article.$id)}
						<ArticleCard {article} />
					{/each}
				</div>
			{:else}
				<div class="py-32 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
					<Telescope class="h-16 w-16 mx-auto text-slate-300 mb-6" />
					<p class="text-xl text-slate-500 font-serif italic">
						{copy.empty_category}
					</p>
					<button 
						onclick={() => activeCategory = 'Todos'}
						class="mt-4 text-primary hover:underline font-bold font-sans uppercase tracking-widest text-xs"
					>
						{copy.empty_category_cta}
					</button>
				</div>
			{/if}
		</div>
	</section>

	<!-- Newsletter CTA -->
	<section class="py-20 md:py-32 bg-slate-50 border-t border-slate-200">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="max-w-4xl mx-auto text-center">
				<h2 class="text-3xl md:text-4xl font-black text-slate-900 mb-6 font-sans tracking-tight">
					{copy.newsletter_title}
				</h2>
				<p class="mt-4 text-lg text-slate-600 font-serif mb-12 italic">
					{copy.newsletter_subtitle}
				</p>
				<form class="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
					<input
						type="email"
						placeholder={copy.newsletter_placeholder}
						class="flex-1 px-6 py-4 rounded-lg bg-white border border-slate-200 focus:border-primary outline-none transition-all text-slate-900"
						required
					/>
					<button
						type="submit"
						class="px-8 py-4 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20 uppercase tracking-widest text-sm"
					>
						{copy.newsletter_button}
					</button>
				</form>
			</div>
		</div>
	</section>
</main>
