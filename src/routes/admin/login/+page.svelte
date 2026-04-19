<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { appwrite, account } from '$lib/appwrite';

	let email = '';
	let password = '';
	let isLoading = false;
	let errorMessage = '';

	async function handleLogin(e: Event) {
		e.preventDefault();
		isLoading = true;
		errorMessage = '';

		try {
			// Create email session
			const session = await account.createEmailPasswordSession(email, password);
			const user = await account.get();

			authStore.setUser(user);
			await goto('/admin/dashboard');
		} catch (err: any) {
			console.error('Login error:', err);
			errorMessage = err.message || 'Failed to login. Please check your credentials.';
			authStore.setError(errorMessage);
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Login - Astrobiologia</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<div class="bg-white rounded-lg shadow-xl p-8">
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-slate-900 mb-2">Astrobiologia Admin</h1>
				<p class="text-slate-600">Content Management System</p>
			</div>

			<form on:submit={handleLogin} class="space-y-6">
				{#if errorMessage}
					<div class="p-4 bg-red-100 text-red-700 rounded-lg text-sm">
						{errorMessage}
					</div>
				{/if}

				<div>
					<label for="email" class="block text-sm font-medium text-slate-700 mb-2">
						Email
					</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="admin@example.com"
						required
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-slate-700 mb-2">
						Password
					</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						placeholder="••••••••"
						required
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
				>
					{isLoading ? 'Logging in...' : 'Login'}
				</button>
			</form>

			<p class="text-center text-slate-600 text-sm mt-6">
				Demo credentials available upon request
			</p>
		</div>
	</div>
</main>
