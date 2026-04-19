<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let selectedCategory = 'all';
	let searchQuery = '';

	$: filteredArticles = data.articles.filter((article) => {
		const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
		const matchesSearch =
			article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			article.description.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	const categories = ['all', 'biology', 'geology', 'astrobiology', 'space-missions'];
</script>

<svelte:head>
	<title>Articles - Astrobiologia</title>
	<meta name="description" content="Explore our comprehensive collection of astrobiology articles." />
	<meta name="og:title" content="Articles - Astrobiologia" />
	<meta name="og:description" content="Explore our comprehensive collection of astrobiology articles." />
</svelte:head>

<main class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<div class="text-center mb-12">
			<h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Articles</h1>
			<p class="text-xl text-slate-600 max-w-2xl mx-auto">
				Discover the latest research and insights in astrobiology
			</p>
		</div>

		<!-- Filters -->
		<div class="mb-12">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Search -->
				<div>
					<label for="search" class="block text-sm font-medium text-slate-700 mb-2">
						Search articles
					</label>
					<input
						id="search"
						type="text"
						placeholder="Search by title or topic..."
						bind:value={searchQuery}
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<!-- Category Filter -->
				<div>
					<label for="category" class="block text-sm font-medium text-slate-700 mb-2">
						Category
					</label>
					<select
						id="category"
						bind:value={selectedCategory}
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						{#each categories as cat}
							<option value={cat} selected={cat === selectedCategory}>
								{cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
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
			<div class="text-center py-12">
				<p class="text-lg text-slate-600">No articles found matching your filters.</p>
			</div>
		{/if}
	</div>
</main>

<style>
	:global(body) {
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
	}
</style>
