<script lang="ts">
	import { account, OAuthProvider } from '$lib/appwrite';

	import { goto } from '$app/navigation';

	let errorMessage = $state('');

	async function loginWithGoogle() {
		try {
			// Create Google OAuth2 token
			// Appwrite will redirect to Google, then back to our success URL with userId and secret
			account.createOAuth2Token(
				OAuthProvider.Google,
				`${window.location.origin}/admin/dashboard`,
				`${window.location.origin}/admin/login?error=google_failed`
			);
		} catch (err: any) {
			console.error('Google login error:', err);
			errorMessage = err.message || 'Failed to initialize Google login.';
		}
	}
</script>

<svelte:head>
	<title>Acesso Administrativo - Astrobiologia</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<div class="bg-white rounded-2xl shadow-2xl p-8">
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-slate-900 mb-2">Astrobiologia Admin</h1>
				<p class="text-slate-600">Sistema de Gerenciamento de Conteúdo</p>
			</div>

			<div class="space-y-6">
				{#if errorMessage}
					<div class="p-4 bg-red-100 text-red-700 rounded-lg text-sm">
						{errorMessage}
					</div>
				{/if}

				<button
					onclick={loginWithGoogle}
					class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium shadow-sm"
				>
					<svg class="w-5 h-5" viewBox="0 0 24 24">
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
					Continuar com Google
				</button>
				
				<div class="relative py-2">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-slate-300"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="px-2 bg-white text-slate-500">Ou</span>
					</div>
				</div>

				<form class="space-y-4" onsubmit={async (e) => {
					e.preventDefault();
					const formData = new FormData(e.target as HTMLFormElement);
					const email = formData.get('email') as string;
					const password = formData.get('password') as string;
					try {
						await account.createEmailPasswordSession(email, password);
						// Small delay to ensure SDK writes fallback tokens if needed
						setTimeout(() => {
							goto('/admin/dashboard');
						}, 100);
					} catch (err: any) {
						console.error('Login error:', err);
						errorMessage = err.message || 'Login falhou.';
					}
				}}>
					<div>
						<input 
							type="email" 
							name="email" 
							placeholder="Email" 
							required 
							class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
						/>
					</div>
					<div>
						<input 
							type="password" 
							name="password" 
							placeholder="Senha" 
							required 
							class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
						/>
					</div>
					<button 
						type="submit"
						class="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
					>
						Entrar com Email
					</button>
				</form>
			</div>

			<p class="text-center text-slate-500 text-xs mt-8">
				Acesso restrito a administradores autorizados.
			</p>
		</div>
	</div>
</main>
