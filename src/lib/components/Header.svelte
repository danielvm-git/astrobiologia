<script lang="ts">
	import { page } from '$app/stores';
	import { Menu, X, Telescope, Search } from 'lucide-svelte';
	import { CATEGORIES } from '$lib/appwrite';

	let mobileMenuOpen = $state(false);

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/categorias/noticias', label: 'Notícias' },
		{ href: '/categorias/entrevistas', label: 'Entrevistas' },
		{ href: '/categorias/analises', label: 'Análises' },
		{ href: '/categorias/pesquisas-brasileiras', label: 'Pesquisas Brasileiras' },
		{ href: '/sobre', label: 'Sobre' }
	];

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<header class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
		<!-- Logo -->
		<a href="/" class="flex items-center gap-2" onclick={closeMobileMenu}>
			<Telescope class="h-7 w-7 text-primary" />
			<span class="text-xl font-bold tracking-tight text-foreground">
				Astrobiologia<span class="text-primary">.com</span>
			</span>
		</a>

		<!-- Desktop Navigation -->
		<nav class="hidden items-center gap-1 md:flex">
			{#each navLinks as link}
				<a
					href={link.href}
					class="rounded-md px-3 py-2 text-sm font-medium transition-colors {$page.url.pathname === link.href
						? 'bg-primary/10 text-primary'
						: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<!-- Search & CTA -->
		<div class="hidden items-center gap-4 md:flex">
			<button
				type="button"
				class="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				aria-label="Buscar"
			>
				<Search class="h-5 w-5" />
			</button>
			<a
				href="/admin"
				class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
			>
				Admin
			</a>
		</div>

		<!-- Mobile Menu Button -->
		<button
			type="button"
			class="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
			onclick={toggleMobileMenu}
			aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
		>
			{#if mobileMenuOpen}
				<X class="h-6 w-6" />
			{:else}
				<Menu class="h-6 w-6" />
			{/if}
		</button>
	</div>

	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<div class="border-t border-border bg-background md:hidden">
			<nav class="mx-auto max-w-7xl px-4 py-4 sm:px-6">
				<div class="flex flex-col gap-1">
					{#each navLinks as link}
						<a
							href={link.href}
							class="rounded-md px-3 py-2 text-base font-medium transition-colors {$page.url.pathname === link.href
								? 'bg-primary/10 text-primary'
								: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
							onclick={closeMobileMenu}
						>
							{link.label}
						</a>
					{/each}
					<hr class="my-2 border-border" />
					<a
						href="/admin"
						class="rounded-md bg-primary px-3 py-2 text-center text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
						onclick={closeMobileMenu}
					>
						Admin
					</a>
				</div>
			</nav>
		</div>
	{/if}
</header>
