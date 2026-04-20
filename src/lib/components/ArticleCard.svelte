<script lang="ts">
	import type { Article } from '$lib/appwrite';
	import { getImageUrl, CATEGORIES } from '$lib/appwrite';
	import { formatDate, readingTime, cn } from '$lib/utils';
	import { Clock } from 'lucide-svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	interface Props {
		article: Article;
		variant?: 'default' | 'featured' | 'compact';
		class?: string;
	}

	let { article, variant = 'default', class: className }: Props = $props();

	// Use translation data if available, fallback to master (legacy support during migration)
	const title = $derived(article.translation?.title || (article as any).title);
	const slug = $derived(article.translation?.slug || (article as any).slug);
	const excerpt = $derived(article.translation?.excerpt || (article as any).excerpt);
	const content = $derived(article.translation?.content || (article as any).content || '');
	const lang = $derived(getLocale());

	const category = $derived(article ? CATEGORIES.find((c) => c.slug === article.category) : null);
	const imageUrl = $derived(
		article?.featuredImage 
			? (article.featuredImage.startsWith('http') 
				? article.featuredImage 
				: `${getImageUrl(article.featuredImage, 800, 500)}&output=webp&quality=80`)
			: null
	);

    const getCategoryName = (slug: string) => {
        switch(slug) {
            case 'noticias': return m.category_noticias();
            case 'entrevistas': return m.category_entrevistas();
            case 'analises': return m.category_analises();
            case 'pesquisas-brasileiras': return m.category_pesquisas();
            case 'exoplanetas': return m.category_exoplanetas();
            case 'extremofilos': return m.category_extremofilos();
            default: return slug;
        }
    }
</script>

{#if article}
	{#if variant === 'featured'}
	<article class={cn('group relative overflow-hidden rounded-xl bg-card shadow-sm transition-shadow hover:shadow-md', className)}>
		<a href="/{lang}/artigos/{slug}" class="block">
			<div class="relative aspect-[16/9] overflow-hidden">
				{#if imageUrl}
					<img
						src={imageUrl}
						alt={article.featuredImageAlt || title}
						class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						fetchpriority="high"
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
							{getCategoryName(category.slug)}
						</span>
					{/if}
					<h2 class="mt-3 text-2xl font-bold leading-tight text-white text-balance md:text-3xl font-serif">
						{title}
					</h2>
					<p class="mt-2 line-clamp-2 text-sm text-white/80">
						{excerpt}
					</p>
					<div class="mt-4 flex items-center gap-4 text-xs text-white/70">
						<span>{formatDate(article.publishedAt || article.$createdAt, lang)}</span>
						<span class="flex items-center gap-1">
							<Clock class="h-3 w-3" />
							{readingTime(content)} min de leitura
						</span>
					</div>
				</div>
			</div>
		</a>
	</article>
{:else if variant === 'compact'}
	<article class={cn('group flex gap-4', className)}>
		<a href="/{lang}/artigos/{slug}" class="shrink-0">
			<div class="relative h-20 w-28 overflow-hidden rounded-lg">
				{#if imageUrl}
					<img
						src={imageUrl}
						alt={article.featuredImageAlt || title}
						class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						loading="lazy"
					/>
				{:else}
					<div class="flex h-full w-full items-center justify-center bg-muted">
						<span class="text-xl text-muted-foreground">🔭</span>
					</div>
				{/if}
			</div>
		</a>
		<div class="flex flex-col justify-center">
			<a href="/{lang}/artigos/{slug}">
				<h3 class="font-medium leading-snug text-foreground transition-colors group-hover:text-primary font-serif">
					{title}
				</h3>
			</a>
			<p class="mt-1 text-xs text-muted-foreground">
				{formatDate(article.publishedAt || article.$createdAt, lang)}
			</p>
		</div>
	</article>
{:else}
	<article class={cn('group overflow-hidden bg-white border border-slate-100 transition-all duration-500 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] hover:border-primary/20 flex flex-col h-full', className)}>
		<a href="/{lang}/artigos/{slug}" class="block overflow-hidden">
			<div class="relative aspect-[16/10] overflow-hidden bg-slate-50">
				{#if imageUrl}
					<img
						src={imageUrl}
						alt={article.featuredImageAlt || title}
						class="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
						loading="lazy"
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
					href="/{lang}/categorias/{category.slug}"
					class="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:underline"
				>
					{getCategoryName(category.slug)}
				</a>
			{/if}
			<a href="/{lang}/artigos/{slug}" class="group-hover:text-primary transition-colors duration-300">
				<h3 class="text-xl md:text-2xl font-bold leading-[1.15] text-slate-900 mb-4 font-serif group-hover:underline decoration-accent/30 decoration-2 underline-offset-4 transition-all">
					{title}
				</h3>
			</a>
			<p class="text-slate-600 text-base leading-relaxed font-serif line-clamp-3 mb-8 italic">
				{excerpt}
			</p>
			
			<div class="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
						{formatDate(article.publishedAt || article.$createdAt, lang)}
					</div>
				</div>
				<div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
					<Clock class="h-3 w-3" />
					{readingTime(content)} min
				</div>
			</div>
		</div>
	</article>
	{/if}
{/if}
