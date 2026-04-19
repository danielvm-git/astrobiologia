<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import { CATEGORIES } from '$lib/appwrite';
	import type { Article } from '$lib/appwrite';

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

	const categories = [{ slug: 'all', name: 'Todas as Categorias' }, ...CATEGORIES];
</script>

<svelte:head>
	<title>Artigos - Astrobiologia</title>
	<meta name="description" content="Explore nossa coleção completa de artigos sobre astrobiologia." />
	<meta name="og:title" content="Artigos - Astrobiologia" />
	<meta name="og:description" content="Explore nossa coleção completa de artigos sobre astrobiologia." />
</svelte:head>

<main class="min-h-screen bg-slate-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<div class="text-center mb-12">
			<h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Artigos</h1>
			<p class="text-xl text-slate-600 max-w-2xl mx-auto font-serif">
				Descubra as últimas pesquisas e análises no campo da astrobiologia.
			</p>
		</div>

		<!-- Filters -->
		<div class="mb-12 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Search -->
				<div>
					<label for="search" class="block text-sm font-medium text-slate-700 mb-2">
						Buscar artigos
					</label>
					<input
						id="search"
						type="text"
						placeholder="Título, tema ou palavra-chave..."
						bind:value={searchQuery}
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
					/>
				</div>

				<!-- Category Filter -->
				<div>
					<label for="category" class="block text-sm font-medium text-slate-700 mb-2">
						Categoria
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
				<p class="text-xl text-slate-600">Nenhum artigo encontrado com esses filtros.</p>
				<button 
					onclick={() => { selectedCategory = 'all'; searchQuery = ''; }}
					class="mt-4 text-primary hover:underline font-medium"
				>
					Limpar filtros
				</button>
			</div>
		{/if}
	</div>
</main>
