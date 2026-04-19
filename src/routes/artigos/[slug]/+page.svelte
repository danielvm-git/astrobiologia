<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { formatDate, readingTime } from '$lib/utils';
	import { CATEGORIES, getImageUrl } from '$lib/appwrite';
	import { Clock, ArrowLeft, Share2, Calendar } from 'lucide-svelte';

	export let data: PageData;
	const { article, relatedArticles } = data;

	const category = CATEGORIES.find(c => c.slug === article.category);
	const imageUrl = article.featuredImage ? getImageUrl(article.featuredImage, 1200, 675) : null;
</script>

<svelte:head>
	<title>{article.title} - Astrobiologia.com.br</title>
	<meta name="description" content={article.excerpt} />
	<meta property="og:title" content={article.title} />
	<meta property="og:description" content={article.excerpt} />
	{#if imageUrl}
		<meta property="og:image" content={imageUrl} />
	{/if}
	<meta name="author" content={article.authorName || 'Danilo Albergaria'} />
</svelte:head>

<main class="min-h-screen bg-background">
	<!-- Hero Section -->
	<div class="relative overflow-hidden bg-muted/30 pt-16 pb-12 md:pt-24 md:pb-20">
		<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
			<a href="/categorias/{article.category}" class="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 mb-6 transition-colors">
				<ArrowLeft class="h-4 w-4" />
				{category?.name || 'Voltar'}
			</a>
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 text-balance font-sans">
				{article.title}
			</h1>
			<p class="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 text-balance">
				{article.excerpt}
			</p>
			
			<div class="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
				<div class="flex items-center gap-2">
					<div class="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold font-sans">
						DA
					</div>
					<div>
						<p class="text-foreground font-medium font-sans">{article.authorName || 'Danilo Albergaria'}</p>
						<p class="text-xs">Jornalista e Pesquisador</p>
					</div>
				</div>
				<div class="flex items-center gap-4 border-l border-border pl-6">
					<div class="flex items-center gap-1.5">
						<Calendar class="h-4 w-4" />
						{formatDate(article.publishedAt || article.$createdAt)}
					</div>
					<div class="flex items-center gap-1.5">
						<Clock class="h-4 w-4" />
						{readingTime(article.content)} min de leitura
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Featured Image -->
	{#if imageUrl}
		<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-8 md:-mt-12 relative z-10">
			<div class="aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-4 border-background bg-muted">
				<img
					src={imageUrl}
					alt={article.featuredImageAlt || article.title}
					class="w-full h-full object-cover"
				/>
			</div>
		</div>
	{/if}

	<!-- Content -->
	<article class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
		<div class="prose prose-astro prose-lg lg:prose-xl max-w-none prose-headings:font-bold prose-headings:font-sans prose-p:leading-relaxed prose-img:rounded-xl">
			{@html article.content}
		</div>

		<!-- Footer Meta -->
		<div class="mt-16 pt-8 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
			{#if article.tags && article.tags.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each article.tags as tag}
						<span class="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium font-sans">
							#{tag}
						</span>
					{/each}
				</div>
			{/if}
			
			<div class="flex items-center gap-4">
				<button class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors font-sans">
					<Share2 class="h-4 w-4" />
					Compartilhar
				</button>
			</div>
		</div>
	</article>

	<!-- Related Articles -->
	{#if relatedArticles && relatedArticles.length > 0}
		<section class="bg-muted/30 py-16 md:py-24">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h2 class="text-3xl font-bold text-foreground mb-12 font-sans">Continue lendo</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
					{#each relatedArticles as related}
						<a
							href="/artigos/{related.slug}"
							class="group block"
						>
							<div class="aspect-[16/10] rounded-xl overflow-hidden bg-muted mb-4">
								{#if related.featuredImage}
									<img
										src={getImageUrl(related.featuredImage, 600, 375)}
										alt={related.title}
										class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
									/>
								{:else}
									<div class="w-full h-full flex items-center justify-center text-4xl">🔭</div>
								{/if}
							</div>
							<h3 class="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2 font-sans">
								{related.title}
							</h3>
							<p class="text-muted-foreground text-sm line-clamp-2">{related.excerpt}</p>
						</a>
					{/each}
				</div>
			</div>
		</section>
	{/if}
</main>

<style>
	/* Any page-specific overrides if necessary */
</style>
