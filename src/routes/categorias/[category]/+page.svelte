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

<main class="min-h-screen bg-background pt-32 pb-24">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-20">
			<nav class="flex mb-8" aria-label="Breadcrumb">
				<ol class="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
					<li>
						<a href="/" class="hover:text-primary transition-colors">Início</a>
					</li>
					<li class="flex items-center space-x-4">
						<span class="text-slate-300">/</span>
						<span class="text-slate-900">Categorias</span>
					</li>
					<li class="flex items-center space-x-4">
						<span class="text-slate-300">/</span>
						<span class="text-primary">{category?.name || 'Categoria'}</span>
					</li>
				</ol>
			</nav>
			
			<div class="max-w-4xl">
				<h1 class="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-8 font-sans tracking-tight uppercase">
					{category?.name || 'Categoria'}
				</h1>
				<p class="text-xl md:text-2xl text-slate-600 font-serif leading-relaxed italic border-l-4 border-accent pl-8 py-2">
					{category?.description || 'Descobertas e análises recentes.'}
				</p>
			</div>
		</div>

		<!-- Results -->
		{#if articles.length > 0}
			<div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
				{#each articles as article (article.$id)}
					<ArticleCard {article} />
				{/each}
			</div>
		{:else}
			<div class="py-40 text-center bg-slate-50 border border-dashed border-slate-200">
				<Telescope class="h-16 w-16 mx-auto text-slate-300 mb-8" />
				<h2 class="text-2xl font-bold text-slate-900 mb-4 font-serif">Nenhum artigo encontrado</h2>
				<p class="text-slate-500 font-serif mb-10 max-w-md mx-auto">
					Ainda não temos publicações nesta categoria. Explore outras áreas do conhecimento espacial.
				</p>
				<a 
					href="/"
					class="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all duration-300"
				>
					Voltar para o início
				</a>
			</div>
		{/if}
	</div>
</main>
