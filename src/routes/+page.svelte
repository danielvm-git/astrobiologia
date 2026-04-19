<script lang="ts">
	import { CATEGORIES } from '$lib/appwrite';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import { ArrowRight, Telescope, Sparkles, Globe, Microscope } from 'lucide-svelte';

	let { data } = $props();

	let activeCategory = $state('Todos');

	const featuredArticle = $derived(data.featured?.[0] || data.recent?.[0]);
	const recentArticles = $derived(
		(data.recent?.filter((a: any) => a.$id !== featuredArticle?.$id) || [])
			.filter((a: any) => activeCategory === 'Todos' || a.category === activeCategory || a.category === CATEGORIES.find(c => c.slug === activeCategory)?.name)
			.slice(0, 8)
	);
</script>

<svelte:head>
	<title>Astrobiologia.com - Explorando a vida no universo</title>
	<meta name="description" content="Explore as fronteiras da astrobiologia: exoplanetas, extremófilos, origem da vida e a busca por vida extraterrestre. Conteúdo científico em português." />
</svelte:head>

<main class="bg-background min-h-screen">
	<!-- Recent Articles (Main Feed) -->
	<section class="py-12 md:py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8 mb-8">
				<h1 class="text-4xl md:text-5xl font-bold text-foreground font-serif">Todos os Artigos</h1>
				
				<!-- Category Filters -->
				<div class="flex flex-wrap gap-2">
					<button
						class="rounded-full px-4 py-1.5 text-sm font-medium transition-all {activeCategory === 'Todos' ? 'bg-foreground text-background shadow-sm' : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'}"
						onclick={() => activeCategory = 'Todos'}
					>
						Todos
					</button>
					{#each CATEGORIES as category}
						<button
							class="rounded-full px-4 py-1.5 text-sm font-medium transition-all {activeCategory === category.slug ? 'bg-foreground text-background shadow-sm' : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'}"
							onclick={() => activeCategory = category.slug}
						>
							{category.name}
						</button>
					{/each}
				</div>
			</div>

			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{#each recentArticles as article}
					<ArticleCard {article} />
				{:else}
					<p class="col-span-full py-20 text-center text-muted-foreground font-serif text-lg">
						Nenhum artigo publicado nesta categoria recentemente.
					</p>
				{/each}
			</div>
		</div>
	</section>
</main>

<!-- Newsletter CTA -->
<section class="py-16 md:py-24">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="rounded-2xl bg-primary/5 px-6 py-12 text-center md:px-12 md:py-16">
			<h2 class="text-2xl font-bold text-foreground md:text-3xl text-balance">
				Fique por dentro das descobertas
			</h2>
			<p class="mx-auto mt-4 max-w-xl text-muted-foreground text-balance">
				Assine nossa newsletter e receba os artigos mais recentes sobre astrobiologia diretamente no seu e-mail.
			</p>
			<form class="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
				<input
					type="email"
					placeholder="seu@email.com"
					class="flex-1 rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
					required
				/>
				<button
					type="submit"
					class="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
				>
					Assinar Newsletter
				</button>
			</form>
		</div>
	</div>
</section>
