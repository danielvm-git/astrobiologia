<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { data } = $props();
	let searchTerm = $state('');

	$effect(() => {
		searchTerm = data.query || '';
	});

	const hasQuery = $derived(searchTerm.trim().length > 0);
	const resultCount = $derived(data.articles.length);
</script>

<svelte:head>
	<title>Busca - Astrobiologia</title>
	<meta
		name="description"
		content="Busque artigos por tema, palavra-chave ou descoberta no portal Astrobiologia."
	/>
	<meta name="robots" content="index, follow" />
</svelte:head>

<main class="min-h-screen bg-slate-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<div class="max-w-3xl mx-auto mb-12">
			<h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center">Busca Global</h1>
			<p class="text-xl text-slate-600 font-serif text-center mb-8">
				Encontre artigos por título, resumo e conteúdo.
			</p>

			<form method="GET" action={localizeHref('/busca')} class="flex gap-3">
				<input
					type="search"
					name="q"
					placeholder="Ex.: exoplanetas, biossinais, Marte..."
					bind:value={searchTerm}
					class="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
				/>
				<button
					type="submit"
					class="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition font-semibold"
				>
					Buscar
				</button>
			</form>
		</div>

		{#if hasQuery}
			{#if resultCount > 0}
				<p class="text-sm text-slate-500 mb-8">
					{resultCount} resultado(s) para <strong>"{searchTerm}"</strong>
				</p>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{#each data.articles as article (article.$id)}
						<ArticleCard {article} />
					{/each}
				</div>
			{:else}
				<div class="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
					<p class="text-xl text-slate-600">Nenhum artigo encontrado para "{searchTerm}".</p>
					<p class="text-slate-500 mt-2">Tente outra palavra-chave ou termo mais amplo.</p>
				</div>
			{/if}
		{:else}
			<div class="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
				<p class="text-xl text-slate-600">Digite um termo para iniciar a busca.</p>
			</div>
		{/if}
	</div>
</main>
