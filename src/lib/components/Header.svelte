<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Lock, Mail, Menu, Search, ShieldCheck, Telescope, X } from 'lucide-svelte';
	import { authStore } from '$lib/stores/auth';

	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import LanguageSwitcher from './LanguageSwitcher.svelte';

	let mobileMenuOpen = $state(false);
	let showLoginModal = $state(false);
	let loginError = $state('');

	const navLinks = $derived.by(() => {
		// Access page.url to ensure this derived value re-runs on navigation/locale change
		const _ = page.url;
		return [
			{ href: localizeHref('/'), label: m.nav_home() },
			{ href: localizeHref('/categorias/noticias'), label: m.category_noticias() },
			{ href: localizeHref('/categorias/entrevistas'), label: m.category_entrevistas() },
			{ href: localizeHref('/categorias/analises'), label: m.category_analises() },
			{ href: localizeHref('/categorias/pesquisas-brasileiras'), label: m.category_pesquisas() },
			{ href: localizeHref('/sobre'), label: m.nav_about() }
		];
	});

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function openModal() {
		loginError = '';
		showLoginModal = true;
	}



	// Same full-page redirect pattern as /admin/login to avoid cookie race condition.
	function modalLoginEnhance() {
		return async ({ result }: { result: { type: string; location?: string; data?: any } }) => {
			if (result.type === 'redirect' && result.location) {
				window.location.href = result.location;
			} else if (result.type === 'failure') {
				loginError = result.data?.message ?? 'Login falhou. Verifique suas credenciais.';
			}
		};
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

			<a
				href={localizeHref('/busca')}
				class="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				aria-label={m.search_placeholder()}
			>
				<Search class="h-5 w-5" />
			</a>

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
					onclick={openModal}
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
							onclick={() => { closeMobileMenu(); openModal(); }}
						>
							Acesso Administrativo
						</button>
					{/if}
				</div>
			</nav>
		</div>
	{/if}
</header>

<!-- Login Modal — Command Center style -->
{#if showLoginModal}
	<div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
		<!-- Backdrop -->
		<button
			type="button"
			class="absolute inset-0 bg-slate-900/70 backdrop-blur-sm cursor-default w-full h-full border-none"
			onclick={() => (showLoginModal = false)}
			aria-label="Fechar modal"
		></button>

		<!-- Modal card -->
		<div class="relative w-full max-w-md rounded-[32px] bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
			<!-- Close -->
			<button
				type="button"
				class="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
				onclick={() => (showLoginModal = false)}
			>
				<X class="h-4 w-4" />
			</button>

			<!-- Dark header band -->
			<div class="bg-slate-900 px-10 pt-8 pb-7 flex items-center gap-3">
				<div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shrink-0">
					<Telescope class="w-6 h-6 text-primary" />
				</div>
				<div class="flex flex-col">
					<span class="text-base font-black text-white uppercase tracking-tighter leading-none">Astrobiologia</span>
					<span class="text-[9px] font-black text-accent uppercase tracking-[0.3em] leading-none mt-1">Command Center</span>
				</div>
			</div>

			<!-- Form area -->
			<div class="px-10 py-8 space-y-5">
				<!-- Title -->
				<div class="text-center">
					<h2 class="text-xl font-black text-slate-900 uppercase tracking-tight">Autenticação</h2>
					<p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Acesse as ferramentas de editoria</p>
				</div>

				{#if loginError}
					<div class="p-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3">
						<div class="w-2 h-2 rounded-full bg-red-600 shrink-0"></div>
						{loginError}
					</div>
				{/if}

				<!-- Google — posts to the same server action as /admin/login page -->
				<form method="POST" action="/admin/login?/google">
					<button
						type="submit"
						class="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl hover:bg-slate-100 transition-all font-black uppercase tracking-widest text-[10px] shadow-sm"
					>
						<svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24">
							<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
							<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
							<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
							<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
						</svg>
						Continuar com Google
					</button>
				</form>

				<!-- Divider -->
				<div class="relative flex items-center">
					<div class="flex-1 border-t border-slate-100"></div>
					<span class="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">ou e-mail</span>
					<div class="flex-1 border-t border-slate-100"></div>
				</div>

				<!-- Email / password — posts to the real login server action -->
				<form
					method="POST"
					action="/admin/login?/login"
					class="space-y-3"
					use:enhance={modalLoginEnhance}
				>
					<div class="relative group">
						<Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
						<input
							type="email"
							name="email"
							placeholder="E-mail Administrativo"
							required
							class="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-medium"
						/>
					</div>
					<div class="relative group">
						<Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
						<input
							type="password"
							name="password"
							placeholder="Chave de Acesso"
							required
							class="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-medium"
						/>
					</div>
					<button
						type="submit"
						class="w-full px-5 py-3.5 bg-primary text-white rounded-2xl hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 transition-all font-black uppercase tracking-widest text-[10px] active:scale-[0.98]"
					>
						Entrar no Sistema
					</button>
				</form>
			</div>

			<!-- Footer -->
			<div class="bg-slate-50 px-10 py-4 border-t border-slate-100 flex items-center justify-center gap-2">
				<div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
				<p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Acesso restrito a administradores</p>
			</div>
		</div>
	</div>
{/if}
