<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { account } from '$lib/appwrite';

	import { onMount } from 'svelte';
	let showMobileMenu = false;
	let checkingAuth = true;

	onMount(async () => {
		try {
			// Extract OAuth parameters from URL search or hash
			let userId = $page.url.searchParams.get('userId');
			let secret = $page.url.searchParams.get('secret');

			if (!userId || !secret) {
				const hashParams = new URLSearchParams($page.url.hash.replace('#', ''));
				userId = hashParams.get('userId');
				secret = hashParams.get('secret');
			}

			// If returning from OAuth, establish the session first
			if (userId && secret) {
				try {
					await account.createSession(userId, secret);
					// Clean up URL
					window.history.replaceState({}, '', $page.url.pathname);
				} catch (e) {
					console.warn('Could not create session from URL parameters', e);
				}
			}

			// Get current user session
			const user = await account.get();
			authStore.setUser(user);
			
			// If we're on the login page but have a session, go to dashboard
			if ($page.url.pathname.includes('/login')) {
				await goto('/admin/dashboard');
			}
		} catch (err) {
			console.log('Session check failed:', err);
			
			// Only redirect to login if we're not already there
			if (!$page.url.pathname.includes('/login')) {
				await goto('/admin/login');
			}
		} finally {
			checkingAuth = false;
		}
	});

	async function handleLogout() {
		try {
			await account.deleteSession('current');
		} catch (err) {
			console.warn('Logout session deletion failed (already logged out?):', err);
		} finally {
			authStore.clearUser();
			await goto('/admin/login');
		}
	}

	function closeMobileMenu() {
		showMobileMenu = false;
	}
</script>

<div class="min-h-screen bg-slate-100">
	{#if !$page.url.pathname.includes('/login')}
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
								href="/admin/dashboard"
								class="text-slate-600 hover:text-slate-900 px-3 py-2 {$page.url.pathname === '/admin/dashboard'
									? 'text-primary border-b-2 border-primary'
									: ''}"
							>
								Dashboard
							</a>
							<a
								href="/admin/artigos"
								class="text-slate-600 hover:text-slate-900 px-3 py-2 {$page.url.pathname.startsWith('/admin/artigos')
									? 'text-primary border-b-2 border-primary'
									: ''}"
							>
								Artigos
							</a>
						</nav>
					</div>
					<div class="flex items-center gap-4">
						<button
							onclick={handleLogout}
							class="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
						>
							Sair
						</button>
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
							href="/admin/dashboard"
							onclick={closeMobileMenu}
							class="block px-3 py-2 text-slate-600 hover:text-slate-900"
						>
							Dashboard
						</a>
						<a
							href="/admin/artigos"
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
			{#if checkingAuth}
				<div class="flex justify-center items-center py-20">
					<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				</div>
			{:else}
				<slot />
			{/if}
		</main>
	{:else}
		<slot />
	{/if}
</div>
