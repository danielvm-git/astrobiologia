<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;
	const { article, relatedArticles } = data;
</script>

<svelte:head>
	<title>{article.title} - Astrobiologia</title>
	<meta name="description" content={article.description} />
	<meta name="og:title" content={article.title} />
	<meta name="og:description" content={article.description} />
	{#if article.featuredImage}
		<meta name="og:image" content={article.featuredImage} />
	{/if}
	<meta name="article:author" content={article.author || 'Danilo Couto'} />
	<meta name="article:published_time" content={article.publishedAt} />
	<meta name="article:modified_time" content={article.updatedAt} />
	{#each article.tags || [] as tag}
		<meta name="article:tag" content={tag} />
	{/each}
</svelte:head>

<main class="min-h-screen bg-white">
	<!-- Hero Section -->
	{#if article.featuredImage}
		<div class="relative h-96 md:h-[500px] bg-slate-200 overflow-hidden">
			<img
				src={article.featuredImage}
				alt={article.title}
				class="w-full h-full object-cover"
			/>
			<div
				class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
			/>
		</div>
	{/if}

	<!-- Content -->
	<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
		<div class="mb-8">
			<div class="flex items-center gap-4 mb-4">
				<span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
					{article.category}
				</span>
				<time class="text-slate-600 text-sm">
					{new Date(article.publishedAt).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</time>
			</div>
			<h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
				{article.title}
			</h1>
			<p class="text-xl text-slate-600 mb-6">
				{article.description}
			</p>
			{#if article.author}
				<div class="text-slate-600">
					By <strong>{article.author}</strong>
				</div>
			{/if}
		</div>

		<!-- Article Body -->
		<div class="prose prose-lg max-w-none mb-12">
			{@html article.content}
		</div>

		<!-- Tags -->
		{#if article.tags && article.tags.length > 0}
			<div class="py-8 border-t border-slate-200">
				<h3 class="text-sm font-semibold text-slate-900 mb-4">Tags</h3>
				<div class="flex flex-wrap gap-2">
					{#each article.tags as tag}
						<a
							href="/articles?search={tag}"
							class="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition"
						>
							{tag}
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</article>

	<!-- Related Articles -->
	{#if relatedArticles && relatedArticles.length > 0}
		<section class="bg-slate-50 py-16">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 class="text-3xl font-bold text-slate-900 mb-12">Related Articles</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{#each relatedArticles as relatedArticle (relatedArticle.$id)}
						<a
							href="/articles/{relatedArticle.slug}"
							class="group block bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition"
						>
							{#if relatedArticle.featuredImage}
								<div class="h-48 bg-slate-200 overflow-hidden">
									<img
										src={relatedArticle.featuredImage}
										alt={relatedArticle.title}
										class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
									/>
								</div>
							{/if}
							<div class="p-6">
								<h3 class="font-bold text-slate-900 group-hover:text-blue-600 mb-2">
									{relatedArticle.title}
								</h3>
								<p class="text-slate-600 text-sm">{relatedArticle.description}</p>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</section>
	{/if}
</main>

<style>
	:global(.prose) {
		--tw-prose-body: rgb(51, 65, 85);
		--tw-prose-headings: rgb(15, 23, 42);
		--tw-prose-links: rgb(37, 99, 235);
		--tw-prose-code: rgb(51, 65, 85);
	}

	:global(.prose code) {
		background-color: rgb(241, 245, 249);
		border-radius: 0.375rem;
		padding: 0.125rem 0.375rem;
	}

	:global(.prose pre) {
		background-color: rgb(15, 23, 42);
		color: rgb(226, 232, 240);
		border-radius: 0.5rem;
		overflow-x: auto;
	}
</style>
