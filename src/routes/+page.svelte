<script lang="ts">
	import { CATEGORIES, getImageUrl } from '$lib/appwrite';
	import type { Article } from '$lib/appwrite';
	import { formatDate } from '$lib/utils';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import { Telescope } from 'lucide-svelte';

	let { data } = $props();

	let activeCategory = $state('Todos');

	const recentArticles = $derived(
		(data.recent || [])
			.filter((a: any) => activeCategory === 'Todos' || a.category === activeCategory) as unknown as Article[]
	);
</script>

<svelte:head>
	<title>Astrobiologia.com.br - Explorando a vida no universo</title>
	<meta name="description" content="O portal de notícias e análises sobre astrobiologia no Brasil. Exoplanetas, vida extraterrestre, biologia espacial e exploração científica." />
</svelte:head>

<main class="bg-background min-h-screen">
	<!-- Page Header -->
	<header class="bg-slate-900 pt-32 pb-16 md:pt-48 md:pb-24">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
			<h1 class="text-4xl md:text-6xl font-black text-white mb-6 font-sans tracking-tight">
				Explorando a Vida no Universo<span class="text-accent">.</span>
			</h1>
			<p class="text-xl text-slate-400 font-serif max-w-2xl mx-auto italic">
				Jornalismo científico sobre astrobiologia, exoplanetas e a busca por vida além da Terra.
			</p>
		</div>
	</header>

	<!-- Main Content Feed -->
	<section class="py-16 md:py-24">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-slate-200 pb-8">
				<div>
					<h2 class="text-2xl font-bold text-slate-900 font-sans uppercase tracking-widest">Últimas Reportagens</h2>
				</div>
				
				<!-- Category Filters -->
				<div class="flex flex-wrap gap-2">
					<button
						class="rounded-full px-5 py-2 text-sm font-semibold transition-all {activeCategory === 'Todos' ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary'}"
						onclick={() => activeCategory = 'Todos'}
					>
						Todos
					</button>
					{#each CATEGORIES as category}
						<button
							class="rounded-full px-5 py-2 text-sm font-semibold transition-all {activeCategory === category.slug ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary hover:text-primary'}"
							onclick={() => activeCategory = category.slug}
						>
							{category.name}
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
						Nenhum artigo encontrado nesta categoria.
					</p>
					<button 
						onclick={() => activeCategory = 'Todos'}
						class="mt-4 text-primary hover:underline font-bold font-sans uppercase tracking-widest text-xs"
					>
						Ver todos os artigos
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
					Mantenha-se Informado
				</h2>
				<p class="mt-4 text-lg text-slate-600 font-serif mb-12 italic">
					Assine nossa newsletter e receba as últimas novidades da astrobiologia.
				</p>
				<form class="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
					<input
						type="email"
						placeholder="seu@email.com"
						class="flex-1 px-6 py-4 rounded-lg bg-white border border-slate-200 focus:border-primary outline-none transition-all text-slate-900"
						required
					/>
					<button
						type="submit"
						class="px-8 py-4 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20 uppercase tracking-widest text-sm"
					>
						Assinar
					</button>
				</form>
			</div>
		</div>
	</section>
</main>
