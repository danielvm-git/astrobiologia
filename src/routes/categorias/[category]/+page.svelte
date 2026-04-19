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

<main class="min-h-screen bg-background">
	<div class="max-w-7xl mx-auto px-4 py-16">
		<div class="mb-8">
			<h1 class="text-4xl font-bold text-foreground mb-2 font-sans">{data.categoryLabel}</h1>
			<p class="text-muted-foreground font-sans">
				{filteredArticles.length === 1 ? '1 artigo encontrado' : `${filteredArticles.length} artigos encontrados`}
			</p>
		</div>

		<div class="mb-12">
			<div class="relative max-w-md">
				<input
					type="text"
					placeholder="Buscar nesta categoria..."
					bind:value={searchQuery}
					class="w-full px-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans transition-all"
				/>
			</div>
		</div>

		{#if filteredArticles.length === 0}
			<div class="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
				<p class="text-muted-foreground mb-6 text-lg font-serif">Nenhum artigo encontrado nesta categoria no momento.</p>
				<a href="/" class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 font-sans">
					Voltar para a página inicial
				</a>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each filteredArticles as article (article.$id)}
					<ArticleCard {article} />
				{/each}
			</div>
		{/if}
	</div>
</main>
