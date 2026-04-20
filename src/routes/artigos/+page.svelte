<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import { CATEGORIES } from '$lib/appwrite';
	import type { Article } from '$lib/appwrite';
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	let selectedCategory = $state('all');
	let searchQuery = $state('');

	const filteredArticles = $derived(data.articles.filter((article: any) => {
		const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
		const matchesSearch =
			article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(article.description || '').toLowerCase().includes(searchQuery.toLowerCase());
		return matchesCategory && matchesSearch;
	}) as unknown as Article[]);

	const categories = $derived([{ slug: 'all', name: m.filter_all() }, ...CATEGORIES.map(c => ({
		...c,
		name: (m as any)[`category_${c.slug.replace('-', '')}`]?.() || c.name
	}))]);
</script>

<svelte:head>
	<title>{m.nav_articles()} - Astrobiologia</title>
	<meta name="description" content={m.hero_subtitle()} />
	<meta name="og:title" content="{m.nav_articles()} - Astrobiologia" />
	<meta name="og:description" content={m.hero_subtitle()} />
</svelte:head>

<main class="min-h-screen bg-slate-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<div class="text-center mb-12">
			<h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{m.nav_articles()}</h1>
			<p class="text-xl text-slate-600 max-w-2xl mx-auto font-serif">
				{m.hero_subtitle()}
			</p>
		</div>

		<!-- Filters -->
		<div class="mb-12 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Search -->
				<div>
					<label for="search" class="block text-sm font-medium text-slate-700 mb-2">
						{m.search_placeholder().replace('...', '')}
					</label>
					<input
						id="search"
						type="text"
						placeholder={m.search_placeholder()}
						bind:value={searchQuery}
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
					/>
				</div>

				<!-- Category Filter -->
				<div>
					<label for="category" class="block text-sm font-medium text-slate-700 mb-2">
						{m.category_label()}
					</label>
					<select
						id="category"
						bind:value={selectedCategory}
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
					>
						{#each categories as cat}
							<option value={cat.slug}>
								{cat.name}
							</option>
						{/each}
					</select>
				</div>
			</div>
		</div>

		<!-- Results -->
		{#if filteredArticles.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each filteredArticles as article (article.$id)}
					<ArticleCard {article} />
				{/each}
			</div>
		{:else}
			<div class="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
				<p class="text-xl text-slate-600">{m.empty_category()}</p>
				<button 
					onclick={() => { selectedCategory = 'all'; searchQuery = ''; }}
					class="mt-4 text-primary hover:underline font-medium"
				>
					{m.filter_all()}
				</button>
			</div>
		{/if}
	</div>
</main>
