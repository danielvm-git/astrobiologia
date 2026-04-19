<script lang="ts">
	import { page } from '$app/state';
	import { Menu, X, Search, ShieldCheck, Languages, ChevronDown } from 'lucide-svelte';
	import { authStore } from '$lib/stores/auth';
	import { account, OAuthProvider } from '$lib/appwrite';
	import { getLocale, locales, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	let mobileMenuOpen = $state(false);
	let showLoginModal = $state(false);
	let showLangMenu = $state(false);

	const lang = $derived(getLocale());

	const navLinks = $derived([
		{ href: localizeHref('/'), label: m.nav_home() },
		{ href: localizeHref('/categorias/noticias'), label: 'Notícias' },
		{ href: localizeHref('/categorias/entrevistas'), label: 'Entrevistas' },
		{ href: localizeHref('/categorias/analises'), label: 'Análises' },
		{ href: localizeHref('/categorias/pesquisas-brasileiras'), label: 'Pesquisas' },
		{ href: localizeHref('/sobre'), label: m.nav_about() }
	]);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	async function loginWithGoogle() {
		try {
			account.createOAuth2Session(
				OAuthProvider.Google,
				`${window.location.origin}/admin/dashboard`,
				`${window.location.origin}/admin/login?error=google_failed`
			);
		} catch (err) {
			console.error('Google login error:', err);
		}
	}
</script>

<header class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
		<!-- Logo -->
		<a href={localizeHref('/')} class="flex items-center gap-2" onclick={closeMobileMenu}>
			<span class="text-2xl font-bold tracking-tighter text-foreground font-serif">
				ASTROBIOLOGIA<span class="text-primary">.</span>
			</span>
		</a>

		<!-- Desktop Navigation -->
		<nav class="hidden items-center gap-6 md:flex">
			{#each navLinks as link}
				<a
					href={link.href}
					class="text-sm font-semibold transition-colors font-sans {page.url.pathname === link.href
						? 'text-primary'
						: 'text-muted-foreground hover:text-foreground'}"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<!-- Search & Lang & CTA -->
		<div class="hidden items-center gap-4 md:flex">
			<!-- Language Switcher -->
			<div class="relative">
				<button
					type="button"
					onclick={() => (showLangMenu = !showLangMenu)}
					class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
				>
					<Languages class="h-4 w-4" />
					{lang}
					<ChevronDown class="h-3 w-3 transition-transform {showLangMenu ? 'rotate-180' : ''}" />
				</button>

				{#if showLangMenu}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div 
						class="absolute right-0 mt-2 w-32 rounded-lg bg-card border border-border shadow-xl py-1 z-50 animate-in fade-in zoom-in duration-150"
						onclick={() => (showLangMenu = false)}
					>
						{#each locales as tag}
							<a
								href={localizeHref(page.url.pathname, { locale: tag })}
								class="block px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-muted transition-colors {lang === tag ? 'text-primary' : 'text-muted-foreground'}"
							>
								{tag === 'pt-br' ? 'Português' : 'English'}
							</a>
						{/each}
					</div>
					<!-- Backdrop for closing -->
					<button 
						class="fixed inset-0 z-[-1] cursor-default bg-transparent w-full h-full border-none" 
						onclick={() => (showLangMenu = false)}
						aria-label="Fechar menu"
					></button>
				{/if}
			</div>

			<button
				type="button"
				class="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				aria-label={m.search_placeholder()}
			>
				<Search class="h-5 w-5" />
			</button>
			
			{#if $authStore.isLoggedIn}
				<a
					href="/admin/dashboard"
					class="rounded-md bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/20 flex items-center gap-2"
				>
					<ShieldCheck class="h-4 w-4" />
					Panel
				</a>
			{:else}
				<button
					onclick={() => (showLoginModal = true)}
					class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-sm"
				>
					Admin
				</button>
			{/if}
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
							class="rounded-md px-3 py-2 text-base font-medium transition-colors {page.url.pathname === link.href
								? 'bg-primary/10 text-primary'
								: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
							onclick={closeMobileMenu}
						>
							{link.label}
						</a>
					{/each}
					<hr class="my-2 border-border" />
					
					<!-- Mobile Lang Switcher -->
					<div class="flex items-center gap-4 px-3 py-2">
						<span class="text-xs font-bold text-muted-foreground uppercase tracking-widest">Idioma:</span>
						{#each locales as tag}
							<a
								href={localizeHref(page.url.pathname, { locale: tag })}
								class="text-xs font-bold uppercase tracking-widest {lang === tag ? 'text-primary' : 'text-muted-foreground'}"
								onclick={closeMobileMenu}
							>
								{tag}
							</a>
						{/each}
					</div>

					<hr class="my-2 border-border" />

					{#if $authStore.isLoggedIn}
						<a
							href="/admin/dashboard"
							class="rounded-md bg-primary/10 px-3 py-2 text-center text-base font-semibold text-primary transition-colors"
							onclick={closeMobileMenu}
						>
							Painel de Controle
						</a>
					{:else}
						<button
							class="rounded-md bg-primary px-3 py-2 text-center text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
							onclick={() => {
								closeMobileMenu();
								showLoginModal = true;
							}}
						>
							Acesso Administrativo
						</button>
					{/if}
				</div>
			</nav>
		</div>
	{/if}
</header>
...
