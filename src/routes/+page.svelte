<script lang="ts">
	import { CATEGORIES, getImageUrl } from '$lib/appwrite';
	import type { Article } from '$lib/appwrite';
	import { formatDate } from '$lib/utils';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import { ArrowRight, Clock, User, Calendar, Telescope } from 'lucide-svelte';

	let { data } = $props();

	let activeCategory = $state('Todos');

	const featuredArticle = $derived((data.featured?.[0] || data.recent?.[0]) as unknown as Article | undefined);
	const recentArticles = $derived(
		(data.recent?.filter((a: any) => a.$id !== featuredArticle?.$id) || [])
			.filter((a: any) => activeCategory === 'Todos' || a.category === activeCategory) as unknown as Article[]
	);

	const heroImageUrl = $derived(featuredArticle?.featuredImage ? getImageUrl(featuredArticle.featuredImage, 1600, 900) : null);
</script>

<svelte:head>
	<title>Astrobiologia.com.br - Explorando a vida no universo</title>
	<meta name="description" content="O portal de notícias e análises sobre astrobiologia no Brasil. Exoplanetas, vida extraterrestre, biologia espacial e exploração científica." />
</svelte:head>

<main class="bg-background min-h-screen">
	<!-- Hero Section: Featured Article -->
	{#if featuredArticle}
		<section class="relative min-h-[85vh] flex items-center overflow-hidden bg-[#0a0a0c] pt-20">
			{#if heroImageUrl}
				<div class="absolute inset-0 z-0">
					<img 
						src={heroImageUrl} 
						alt={featuredArticle.title} 
						class="w-full h-full object-cover opacity-70 scale-100 transition-transform duration-[10s] hover:scale-105" 
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent"></div>
					<div class="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/80 via-transparent to-transparent"></div>
				</div>
			{/if}
			
			<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
				<div class="max-w-4xl">
					<div class="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-accent text-white text-[10px] font-bold mb-8 uppercase tracking-[0.2em]">
						<span class="relative flex h-2 w-2">
							<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
							<span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
						</span>
						Destaque Principal
					</div>
					
					<h1 class="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.95] font-sans tracking-tight text-balance">
						{featuredArticle.title}
					</h1>
					
					<p class="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed font-serif max-w-2xl line-clamp-3">
						{featuredArticle.excerpt}
					</p>
					
					<div class="flex flex-wrap items-center gap-8 mb-12 text-slate-400 text-xs font-bold uppercase tracking-widest font-sans">
						<div class="flex items-center gap-3">
							<div class="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
								<User class="h-4 w-4 text-accent" />
							</div>
							{featuredArticle.authorName || 'Danilo Albergaria'}
						</div>
						<div class="flex items-center gap-3">
							<div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
								<Calendar class="h-4 w-4 text-slate-300" />
							</div>
							{formatDate(featuredArticle.publishedAt || featuredArticle.$createdAt)}
						</div>
					</div>
					
					<a
						href="/artigos/{featuredArticle.slug}"
						class="inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-sm hover:bg-accent hover:text-white transition-all duration-300 shadow-2xl font-black uppercase tracking-widest text-sm group"
					>
						Leia a reportagem
						<ArrowRight class="h-5 w-5 group-hover:translate-x-2 transition-transform" />
					</a>
				</div>
			</div>
		</section>
	{/if}

	<!-- Recent Articles (Main Feed) -->
	<section class="py-16 md:py-24 bg-slate-50/50">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-slate-200 pb-8">
				<div>
					<h2 class="text-3xl md:text-4xl font-bold text-slate-900 font-sans mb-4">Exploração Recente</h2>
					<p class="text-slate-600 font-serif max-w-md">As últimas descobertas e análises do mundo da astrobiologia.</p>
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
				<div class="py-32 text-center bg-white rounded-2xl border border-dashed border-slate-300">
					<Telescope class="h-16 w-16 mx-auto text-slate-300 mb-6" />
					<p class="text-xl text-slate-500 font-serif">
						Nenhum artigo encontrado nesta categoria.
					</p>
					<button 
						onclick={() => activeCategory = 'Todos'}
						class="mt-4 text-primary hover:underline font-bold font-sans"
					>
						Ver todos os artigos
					</button>
				</div>
			{/if}
		</div>
	</section>

	<!-- Newsletter CTA -->
	<section class="py-20 md:py-32 relative overflow-hidden">
		<div class="absolute inset-0 bg-primary/5 -z-10"></div>
		<div class="absolute -top-24 -right-24 h-64 w-64 bg-accent/10 rounded-full blur-3xl"></div>
		<div class="absolute -bottom-24 -left-24 h-64 w-64 bg-primary/10 rounded-full blur-3xl"></div>
		
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="max-w-4xl mx-auto text-center">
				<h2 class="text-3xl md:text-5xl font-bold text-slate-900 mb-6 font-sans">
					Fique por dentro das descobertas
				</h2>
				<p class="mt-4 text-xl text-slate-600 font-serif mb-12">
					Assine nossa newsletter e receba as fronteiras da ciência diretamente na sua caixa de entrada.
				</p>
				<form class="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto p-2 bg-white rounded-xl shadow-xl border border-slate-100">
					<input
						type="email"
						placeholder="seu@email.com"
						class="flex-1 px-6 py-4 rounded-lg bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900"
						required
					/>
					<button
						type="submit"
						class="px-8 py-4 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20"
					>
						Assinar
					</button>
				</form>
				<p class="mt-6 text-sm text-slate-500 font-sans">Sem spam. Apenas ciência. Cancele quando quiser.</p>
			</div>
		</div>
	</section>
</main>
