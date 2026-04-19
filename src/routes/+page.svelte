<script lang="ts">
	import { CATEGORIES } from '$lib/appwrite';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import { ArrowRight, Telescope, Sparkles, Globe, Microscope } from 'lucide-svelte';

	let { data } = $props();

	const featuredArticle = $derived(data.featured?.[0] || data.recent?.[0]);
	const recentArticles = $derived(data.recent?.filter((a: any) => a.$id !== featuredArticle?.$id).slice(0, 4) || []);
</script>

<svelte:head>
	<title>Astrobiologia.com - Explorando a vida no universo</title>
	<meta name="description" content="Explore as fronteiras da astrobiologia: exoplanetas, extremófilos, origem da vida e a busca por vida extraterrestre. Conteúdo científico em português." />
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center">
			<h1 class="text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl md:text-6xl">
				Cobertura da ciência da <span class="text-primary">vida no universo</span>
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
				Notícias, entrevistas e análises produzidas pelo jornalista e pesquisador <span class="font-semibold text-foreground">Danilo Albergaria</span>, especialista em comunicação da busca por vida fora da Terra.
			</p>
			<div class="mt-8 flex flex-wrap items-center justify-center gap-4">
				<a
					href="/artigos"
					class="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
				>
					Explorar Artigos
					<ArrowRight class="h-4 w-4" />
				</a>
				<a
					href="/sobre"
					class="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
				>
					Conheça o Autor
				</a>
			</div>
		</div>

		<!-- Feature Cards -->
		<div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-xl border border-border bg-card p-6 text-center">
				<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<Telescope class="h-6 w-6 text-primary" />
				</div>
				<h3 class="mt-4 font-semibold text-foreground">Exoplanetas</h3>
				<p class="mt-2 text-sm text-muted-foreground">Mundos além do Sistema Solar</p>
			</div>
			<div class="rounded-xl border border-border bg-card p-6 text-center">
				<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
					<Microscope class="h-6 w-6 text-secondary" />
				</div>
				<h3 class="mt-4 font-semibold text-foreground">Extremófilos</h3>
				<p class="mt-2 text-sm text-muted-foreground">Vida em condições extremas</p>
			</div>
			<div class="rounded-xl border border-border bg-card p-6 text-center">
				<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
					<Sparkles class="h-6 w-6 text-accent" />
				</div>
				<h3 class="mt-4 font-semibold text-foreground">Origem da Vida</h3>
				<p class="mt-2 text-sm text-muted-foreground">Como tudo começou</p>
			</div>
			<div class="rounded-xl border border-border bg-card p-6 text-center">
				<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<Globe class="h-6 w-6 text-primary" />
				</div>
				<h3 class="mt-4 font-semibold text-foreground">Missões Espaciais</h3>
				<p class="mt-2 text-sm text-muted-foreground">Explorando o cosmos</p>
			</div>
		</div>
	</div>
</section>

<!-- Featured Article -->
<section class="py-12 md:py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between">
			<h2 class="text-2xl font-bold text-foreground">Destaque</h2>
		</div>
		<div class="mt-6">
			<ArticleCard article={featuredArticle} variant="featured" />
		</div>
	</div>
</section>

<!-- Recent Articles -->
<section class="py-12 md:py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between">
			<h2 class="text-2xl font-bold text-foreground">Artigos Recentes</h2>
			<a
				href="/artigos"
				class="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
			>
				Ver todos
				<ArrowRight class="h-4 w-4" />
			</a>
		</div>
		<div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each recentArticles as article}
				<ArticleCard {article} />
			{/each}
		</div>
	</div>
</section>

<!-- Categories Section -->
<section class="bg-muted/30 py-12 md:py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center">
			<h2 class="text-2xl font-bold text-foreground">Explore por Categoria</h2>
			<p class="mt-2 text-muted-foreground">
				Navegue pelos principais temas da astrobiologia
			</p>
		</div>
		<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each CATEGORIES as category}
				<a
					href="/categorias/{category.slug}"
					class="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
				>
					<div class="flex-1">
						<h3 class="font-semibold text-foreground transition-colors group-hover:text-primary">
							{category.name}
						</h3>
						<p class="mt-1 text-sm text-muted-foreground">{category.description}</p>
					</div>
					<ArrowRight class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
				</a>
			{/each}
		</div>
	</div>
</section>

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
