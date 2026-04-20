<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import { formatDate, readingTime } from '$lib/utils';
	import { CATEGORIES, getImageUrl } from '$lib/appwrite';
	import { Clock, Share2, Calendar } from 'lucide-svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	import { generateSchemaMarkup } from '$lib/seo';

	let { data }: { data: PageData } = $props();
	const article = $derived(data.article);
	const relatedArticles = $derived(data.relatedArticles);

	// Use translation data if available, fallback to master (legacy support)
	const title = $derived(article.translation?.title || (article as any).title);
	const slug = $derived(article.translation?.slug || (article as any).slug);
	const excerpt = $derived(article.translation?.excerpt || (article as any).excerpt);
	const content = $derived(article.translation?.content || (article as any).content || '');
	const lang = $derived(getLocale());
	const articleUrl = $derived(`https://astrobiologia.com.br/${lang}/artigos/${slug}`);

	const category = $derived(CATEGORIES.find(c => c.slug === article.category));
	const imageUrl = $derived(article.featuredImage 
		? (article.featuredImage.startsWith('http') 
			? article.featuredImage 
			: `${getImageUrl(article.featuredImage, 1200, 630)}&output=webp&quality=85`) 
		: null);
	const schemaMarkup = $derived(
		generateSchemaMarkup({
			title,
			excerpt,
			featuredImage: imageUrl,
			publishedAt: article.publishedAt,
			$createdAt: article.$createdAt,
			$updatedAt: article.$updatedAt,
			url: articleUrl,
			language: lang
		})
	);
	const schemaJson = $derived(JSON.stringify(schemaMarkup).replace(/</g, '\\u003c'));

	const copy = $derived.by(() => {
		const _ = page.url;
		const categories: Record<string, string> = {
			noticias: m.category_noticias(),
			entrevistas: m.category_entrevistas(),
			analises: m.category_analises(),
			'pesquisas-brasileiras': m.category_pesquisas(),
			exoplanetas: m.category_exoplanetas(),
			extremofilos: m.category_extremofilos()
		};
		return {
			site_title: m.site_title(),
			share: m.share(),
			continue_exploring: m.continue_exploring(),
			categoryLabel: (slug: string) => categories[slug] ?? slug,
			readingTimeLabel: (minutes: number) => m.reading_time({ minutes })
		};
	});
</script>

<svelte:head>
	<title>{title} - {copy.site_title}</title>
	<meta name="description" content={excerpt} />
	<link rel="canonical" href={articleUrl} />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="article" />
	<meta property="og:url" content={articleUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={excerpt} />
	{#if imageUrl}
		<meta property="og:image" content={imageUrl} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{/if}
	<meta property="article:published_time" content={article.publishedAt || article.$createdAt} />
	<meta property="article:author" content={article.authorName || 'Danilo Albergaria'} />
	<meta property="article:section" content={category?.name || 'Astrobiologia'} />
	<script type="application/ld+json">
		{@html schemaJson}
	</script>
</svelte:head>

<main class="min-h-screen bg-background">
	<!-- Page Header -->
	<div class="relative overflow-hidden pt-32 pb-16 md:pt-48 md:pb-24 border-b border-slate-100 bg-white">
		<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
			{#if category}
				<a href="/{lang}/categorias/{article.category}" class="inline-block text-primary text-xs font-black uppercase tracking-[0.2em] mb-8 hover:underline">
					{copy.categoryLabel(article.category)}
				</a>
			{/if}
			
			<h1 class="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] mb-10 text-balance font-sans tracking-tight">
				{title}
			</h1>
			
			<p class="text-xl md:text-2xl text-slate-600 leading-relaxed mb-12 font-serif text-balance italic">
				{excerpt}
			</p>
			
			<div class="flex flex-wrap items-center gap-8 text-slate-400 text-[10px] font-black uppercase tracking-widest border-t border-slate-100 pt-8">
				<div class="flex items-center gap-3">
					<div class="h-8 w-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
						{article.authorName?.charAt(0) || 'D'}
					</div>
					<div class="text-slate-900">{article.authorName || 'Danilo Albergaria'}</div>
				</div>
				<div class="flex items-center gap-2">
					<Calendar class="h-3.5 w-3.5" />
					{formatDate(article.publishedAt || article.$createdAt, lang)}
				</div>
				<div class="flex items-center gap-2">
					<Clock class="h-3.5 w-3.5" />
					{copy.readingTimeLabel(readingTime(content))}
				</div>
			</div>
		</div>
	</div>

	<!-- Featured Image -->
	{#if imageUrl}
		<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
			<figure>
				<div class="aspect-[16/9] overflow-hidden bg-slate-100">
					<img
						src={imageUrl}
						alt={article.featuredImageAlt || title}
						class="w-full h-full object-cover"
						fetchpriority="high"
					/>
				</div>
				{#if article.featuredImageAlt}
					<figcaption class="mt-4 text-center text-slate-500 text-sm italic font-serif">
						{article.featuredImageAlt}
					</figcaption>
				{/if}
			</figure>
		</div>
	{/if}

	<!-- Content -->
	<article class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 md:py-24">
		<div class="prose prose-astro max-w-none">
			{@html content}
		</div>

		<!-- Footer Meta -->
		<div class="mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
			{#if article.tags && article.tags.length > 0}
				<div class="flex flex-wrap gap-3">
					{#each article.tags as tag}
						<span class="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
							#{tag}
						</span>
					{/each}
				</div>
			{/if}
			
			<div class="flex items-center gap-6">
				<button 
					onclick={() => {
						if (navigator.share) {
							navigator.share({
								title,
								text: excerpt,
								url: window.location.href
							});
						}
					}}
					class="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
				>
					<Share2 class="h-4 w-4" />
					{copy.share}
				</button>
			</div>
		</div>
	</article>

	<!-- Related Articles -->
	{#if relatedArticles && relatedArticles.length > 0}
		<section class="bg-slate-50 border-t border-slate-100 py-24">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h2 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-16 text-center">{copy.continue_exploring}</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-12">
					{#each relatedArticles as related}
						{@const rTitle = related.translation?.title || (related as any).title}
						{@const rSlug = related.translation?.slug || (related as any).slug}
						{@const rExcerpt = related.translation?.excerpt || (related as any).excerpt}
						<div class="flex flex-col h-full bg-white border border-slate-100 hover:shadow-xl transition-all duration-300">
							<a
								href="/{lang}/artigos/{rSlug}"
								class="block overflow-hidden aspect-[16/10]"
							>
								{#if related.featuredImage}
									<img
										src={related.featuredImage.startsWith('http') ? related.featuredImage : `${getImageUrl(related.featuredImage, 600, 375)}&output=webp&quality=80`}
										alt={rTitle}
										class="w-full h-full object-cover hover:scale-105 transition duration-700"
										loading="lazy"
									/>
								{:else}
									<div class="w-full h-full flex items-center justify-center text-4xl bg-slate-50 opacity-30 grayscale">🔭</div>
								{/if}
							</a>
							<div class="p-6 flex flex-col flex-1">
								<a href="/{lang}/artigos/{rSlug}" class="hover:text-primary transition-colors">
									<h3 class="text-xl font-bold text-slate-900 mb-4 line-clamp-2 font-serif leading-tight">
										{rTitle}
									</h3>
								</a>
								<p class="text-slate-500 text-sm line-clamp-2 font-serif mb-6 italic">{rExcerpt}</p>
								<div class="mt-auto pt-6 border-t border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
									{formatDate(related.publishedAt || related.$createdAt, lang)}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/if}
</main>
