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

	const category = CATEGORIES.find((c) => c.slug === article.category);
	const imageUrl = article.featuredImage ? getImageUrl(article.featuredImage, 800, 500) : null;
</script>

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
				<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
				<div class="absolute bottom-0 left-0 right-0 p-6">
					{#if category}
						<span class="inline-flex rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground">
							{category.name}
						</span>
					{/if}
					<h2 class="mt-3 text-2xl font-bold leading-tight text-white text-balance md:text-3xl">
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
				<h3 class="font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
					{article.title}
				</h3>
			</a>
			<p class="mt-1 text-xs text-muted-foreground">
				{formatDate(article.publishedAt || article.$createdAt)}
			</p>
		</div>
	</article>
{:else}
	<article class={cn('group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md', className)}>
		<a href="/artigos/{article.slug}" class="block">
			<div class="relative aspect-[16/10] overflow-hidden">
				{#if imageUrl}
					<img
						src={imageUrl}
						alt={article.featuredImageAlt || article.title}
						class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				{:else}
					<div class="flex h-full w-full items-center justify-center bg-muted">
						<span class="text-3xl text-muted-foreground">🔭</span>
					</div>
				{/if}
			</div>
		</a>
		<div class="p-5">
			{#if category}
				<a
					href="/categorias/{category.slug}"
					class="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
				>
					{category.name}
				</a>
			{/if}
			<a href="/artigos/{article.slug}">
				<h3 class="mt-2 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary text-balance">
					{article.title}
				</h3>
			</a>
			<p class="mt-2 line-clamp-2 text-sm text-muted-foreground">
				{article.excerpt}
			</p>
			<div class="mt-4 flex items-center justify-between text-xs text-muted-foreground">
				<span>{formatDate(article.publishedAt || article.$createdAt)}</span>
				<span class="flex items-center gap-1">
					<Clock class="h-3 w-3" />
					{readingTime(article.content)} min
				</span>
			</div>
		</div>
	</article>
{/if}
