<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import type { PageData } from './$types';

	let { data } = $props();

	let searchQuery = $state('');
	
	const filteredArticles = $derived(
		data.articles.filter(
			(article: any) =>
				article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
</script>

<svelte:head>
	<title>{data.categoryLabel} - Astrobiologia</title>
	<meta name="description" content="Navegue pelos artigos de {data.categoryLabel} no Astrobiologia.com.br" />
	<meta property="og:title" content="{data.categoryLabel} - Astrobiologia" />
	<meta property="og:description" content="Navegue pelos artigos de {data.categoryLabel} no Astrobiologia.com.br" />
	<meta property="og:type" content="website" />
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
	<div class="max-w-7xl mx-auto px-4 py-16">
		<div class="mb-8">
			<h1 class="text-4xl font-bold text-slate-900 mb-2">{data.categoryLabel}</h1>
			<p class="text-slate-600">
				{filteredArticles.length === 1 ? '1 artigo encontrado' : `${filteredArticles.length} artigos encontrados`}
			</p>
		</div>

		<div class="mb-8">
			<input
				type="text"
				placeholder="Buscar artigos..."
				bind:value={searchQuery}
				class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
			/>
		</div>

		{#if filteredArticles.length === 0}
			<div class="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
				<p class="text-slate-600 mb-4 text-lg">Nenhum artigo encontrado nesta categoria.</p>
				<a href="/" class="text-primary hover:underline font-medium">Voltar para a página inicial</a>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredArticles as article (article.$id)}
					<ArticleCard {article} />
				{/each}
			</div>
		{/if}
	</div>
</main>
