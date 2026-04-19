<script lang="ts">
	import { page } from '$app/state';
	import { Menu, X, Search, ShieldCheck } from 'lucide-svelte';
	import { authStore } from '$lib/stores/auth';
	import { account, OAuthProvider } from '$lib/appwrite';
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import LanguageSwitcher from './LanguageSwitcher.svelte';

	let mobileMenuOpen = $state(false);
	let showLoginModal = $state(false);

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
			<LanguageSwitcher variant="header" />

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
					Painel
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
					
					<LanguageSwitcher variant="mobile" />

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

<!-- Login Modal -->
{#if showLoginModal}
	<div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
		<!-- Backdrop -->
		<button 
			type="button"
			class="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity cursor-default w-full h-full border-none" 
			onclick={() => (showLoginModal = false)}
			aria-label="Fechar modal"
		></button>

		<!-- Modal Content -->
		<div class="relative w-full max-w-md scale-100 transform overflow-hidden rounded-2xl bg-card p-8 shadow-2xl border border-border transition-all animate-in fade-in zoom-in duration-200">
			<button 
				type="button"
				class="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
				onclick={() => (showLoginModal = false)}
			>
				<X class="h-5 w-5" />
			</button>

			<div class="text-center mb-8">
				<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<ShieldCheck class="h-6 w-6 text-primary" />
				</div>
				<h2 class="text-2xl font-bold text-foreground font-serif">Área Restrita</h2>
				<p class="mt-2 text-muted-foreground font-sans text-sm text-pretty">
					Acesse o painel administrativo para gerenciar seus artigos e conteúdos científicos.
				</p>
			</div>

			<div class="space-y-4">
				<button
					onclick={loginWithGoogle}
					class="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted hover:shadow-md active:scale-[0.98]"
				>
					<svg class="h-5 w-5" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							style="fill: #4285F4"
						/>
						<path
							fill="currentColor"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							style="fill: #34A853"
						/>
						<path
							fill="currentColor"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
							style="fill: #FBBC05"
						/>
						<path
							fill="currentColor"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							style="fill: #EA4335"
						/>
					</svg>
					Entrar com Google
				</button>
				
				<p class="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
					Acesso restrito a administradores
				</p>
			</div>
		</div>
	</div>
{/if}
