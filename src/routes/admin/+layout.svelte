<script lang="ts">
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { deLocalizeHref, localizeHref } from '$lib/paraglide/runtime';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();
	let showMobileMenu = $state(false);

	function closeMobileMenu() {
		showMobileMenu = false;
	}
</script>

<div class="min-h-screen bg-slate-100">
	{#if !deLocalizeHref(page.url.pathname).includes('/login')}
		<!-- Header -->
		<header class="bg-white border-b border-slate-200">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between items-center h-16">
					<div class="flex items-center gap-8">
						<a href="/admin/dashboard" class="font-bold text-xl text-primary flex items-center gap-2">
							<span class="text-2xl">🔭</span>
							Astrobiologia CMS
						</a>
						<nav class="hidden md:flex gap-6">
							<a
								href={localizeHref('/admin/dashboard')}
								class="text-slate-600 hover:text-slate-900 px-3 py-2 {deLocalizeHref(page.url.pathname) === '/admin/dashboard'
									? 'text-primary border-b-2 border-primary'
									: ''}"
							>
								Dashboard
							</a>
							<a
								href={localizeHref('/admin/artigos')}
								class="text-slate-600 hover:text-slate-900 px-3 py-2 {deLocalizeHref(page.url.pathname).startsWith('/admin/artigos')
									? 'text-primary border-b-2 border-primary'
									: ''}"
							>
								Artigos
							</a>
						</nav>
					</div>
					<div class="flex items-center gap-4">
					{#if data.user}
						<span class="text-sm text-slate-500 hidden md:block">{data.user.email}</span>
					{/if}
					<form method="POST" action="/admin/logout" use:enhance>
						<button
							type="submit"
							class="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
						>
							Sair
						</button>
					</form>
						<button
							onclick={() => (showMobileMenu = !showMobileMenu)}
							class="md:hidden p-2 hover:bg-slate-100 rounded-lg"
							aria-label="Abrir menu"
						>
							<svg
								class="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>
				</div>

				<!-- Mobile Menu -->
				{#if showMobileMenu}
					<nav class="md:hidden border-t border-slate-200 py-4">
						<a
							href={localizeHref('/admin/dashboard')}
							onclick={closeMobileMenu}
							class="block px-3 py-2 text-slate-600 hover:text-slate-900"
						>
							Dashboard
						</a>
						<a
							href={localizeHref('/admin/artigos')}
							onclick={closeMobileMenu}
							class="block px-3 py-2 text-slate-600 hover:text-slate-900"
						>
							Artigos
						</a>
					</nav>
				{/if}
			</div>
		</header>

		<!-- Main Content -->
		<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{@render children()}
		</main>
	{:else}
		{@render children()}
	{/if}
</div>
