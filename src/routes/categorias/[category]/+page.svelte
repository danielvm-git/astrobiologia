<script lang="ts">
	import { CATEGORIES } from '$lib/appwrite';
	import type { Article } from '$lib/appwrite';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import { ArrowLeft, Telescope } from 'lucide-svelte';

	let { data } = $props();

	const category = CATEGORIES.find((c) => c.slug === data.categorySlug);
	const articles = $derived(data.articles as unknown as Article[]);
</script>

<svelte:head>
	<title>{category?.name || 'Categoria'} - Astrobiologia</title>
	<meta name="description" content={category?.description || 'Explore artigos de astrobiologia por categoria.'} />
</svelte:head>

<main class="min-h-screen bg-slate-50/50 pt-24 pb-20">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-12">
			<a
				href="/"
				class="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 mb-6 transition-colors"
			>
				<ArrowLeft class="h-4 w-4" />
				Voltar para o início
			</a>
			
			<div class="max-w-3xl">
				<h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-sans uppercase tracking-tight">
					{category?.name || 'Categoria'}
				</h1>
				<p class="text-xl text-slate-600 font-serif leading-relaxed">
					{category?.description || 'Descobertas e análises recentes.'}
				</p>
			</div>
		</div>

		<!-- Results -->
		{#if articles.length > 0}
			<div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
				{#each articles as article (article.$id)}
					<ArticleCard {article} />
				{/each}
			</div>
		{:else}
			<div class="py-32 text-center bg-white rounded-2xl border border-dashed border-slate-300">
				<Telescope class="h-16 w-16 mx-auto text-slate-300 mb-6" />
				<p class="text-xl text-slate-500 font-serif">
					Nenhum artigo encontrado nesta categoria ainda.
				</p>
				<a 
					href="/"
					class="mt-4 inline-block text-primary hover:underline font-bold font-sans"
				>
					Ver todos os artigos
				</a>
			</div>
		{/if}
	</div>
</main>
