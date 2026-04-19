<script lang="ts">
	import type { Article } from '$lib/appwrite';
	import { getImageUrl, CATEGORIES } from '$lib/appwrite';
	import { formatDate, readingTime, cn } from '$lib/utils';
	import { Clock, ArrowRight } from 'lucide-svelte';

	interface Props {
		article: Article;
		variant?: 'default' | 'featured' | 'compact';
		class?: string;
	}

	let { article, variant = 'default', class: className }: Props = $props();

	const category = $derived(article ? CATEGORIES.find((c) => c.slug === article.category) : null);
	const imageUrl = $derived(
		article?.featuredImage 
			? (article.featuredImage.startsWith('http') 
				? article.featuredImage 
				: getImageUrl(article.featuredImage, 800, 500))
			: null
	);
</script>

{#if article}
	{#if variant === 'featured'}
	<article class={cn('group relative overflow-hidden rounded-xl bg-card shadow-sm transition-shadow hover:shadow-md', className)}>
		<a href="/artigos/{article.slug}" class="block">
			<div class="relative aspect-[16/9] overflow-hidden">
				{#if imageUrl}
					<img
						src={imageUrl}
						alt={article.featuredImageAlt || article.title}
						class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				{:else}
					<div class="flex h-full w-full items-center justify-center bg-muted">
						<span class="text-4xl text-muted-foreground">🔭</span>
					</div>
				{/if}
				<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
				<div class="absolute bottom-0 left-0 right-0 p-6">
					{#if category}
						<span class="inline-flex rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground">
							{category.name}
						</span>
					{/if}
					<h2 class="mt-3 text-2xl font-bold leading-tight text-white text-balance md:text-3xl font-serif">
						{article.title}
					</h2>
					<p class="mt-2 line-clamp-2 text-sm text-white/80">
						{article.excerpt}
					</p>
					<div class="mt-4 flex items-center gap-4 text-xs text-white/70">
						<span>{formatDate(article.publishedAt || article.$createdAt)}</span>
						<span class="flex items-center gap-1">
							<Clock class="h-3 w-3" />
							{readingTime(article.content)} min de leitura
						</span>
					</div>
				</div>
			</div>
		</a>
	</article>
{:else if variant === 'compact'}
	<article class={cn('group flex gap-4', className)}>
		<a href="/artigos/{article.slug}" class="shrink-0">
			<div class="relative h-20 w-28 overflow-hidden rounded-lg">
				{#if imageUrl}
					<img
						src={imageUrl}
						alt={article.featuredImageAlt || article.title}
						class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				{:else}
					<div class="flex h-full w-full items-center justify-center bg-muted">
						<span class="text-xl text-muted-foreground">🔭</span>
					</div>
				{/if}
			</div>
		</a>
		<div class="flex flex-col justify-center">
			<a href="/artigos/{article.slug}">
				<h3 class="font-medium leading-snug text-foreground transition-colors group-hover:text-primary font-serif">
					{article.title}
				</h3>
			</a>
			<p class="mt-1 text-xs text-muted-foreground">
				{formatDate(article.publishedAt || article.$createdAt)}
			</p>
		</div>
	</article>
{:else}
	<article class={cn('group overflow-hidden bg-white border border-slate-200 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:border-primary/30 flex flex-col h-full', className)}>
		<a href="/artigos/{article.slug}" class="block overflow-hidden">
			<div class="relative aspect-[16/10] overflow-hidden bg-slate-100">
				{#if imageUrl}
					<img
						src={imageUrl}
						alt={article.featuredImageAlt || article.title}
						class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
					/>
				{:else}
					<div class="flex h-full w-full items-center justify-center">
						<span class="text-3xl grayscale opacity-30">🔭</span>
					</div>
				{/if}
				{#if article.featured}
					<div class="absolute top-4 left-4">
						<span class="bg-accent text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 shadow-lg">
							Destaque
						</span>
					</div>
				{/if}
			</div>
		</a>
		<div class="p-6 flex flex-col flex-1">
			{#if category}
				<a
					href="/categorias/{category.slug}"
					class="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:underline"
				>
					{category.name}
				</a>
			{/if}
			<a href="/artigos/{article.slug}" class="group-hover:text-primary transition-colors">
				<h3 class="text-xl md:text-2xl font-bold leading-[1.2] text-slate-900 mb-3 font-serif line-clamp-2">
					{article.title}
				</h3>
			</a>
			<p class="text-slate-600 text-sm leading-relaxed font-serif line-clamp-3 mb-6">
				{article.excerpt}
			</p>
			
			<div class="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
						{formatDate(article.publishedAt || article.$createdAt)}
					</div>
				</div>
				<div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
					<Clock class="h-3 w-3" />
					{readingTime(article.content)} min
				</div>
			</div>
		</div>
	</article>
	{/if}
{/if}
