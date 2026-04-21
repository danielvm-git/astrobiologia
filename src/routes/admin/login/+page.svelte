<script lang="ts">
	import { enhance } from '$app/forms';
	import { Telescope, Lock, Mail, Chrome } from 'lucide-svelte';
	import type { ActionData } from './$types';
	import { startGoogleOAuth } from '$lib/auth/google-oauth-browser';

	function loginEnhance() {
		return async ({ result }: { result: { type: string; location?: string } }) => {
			// Force a full-page navigation so the session cookie is committed before
			// hooks.server.ts validates it on the dashboard SSR request.
			if (result.type === 'redirect' && result.location) {
				window.location.href = result.location;
			}
		};
	}

	let { form }: { form: ActionData } = $props();
	let errorMessage = $state('');

	$effect(() => {
		if (form?.message) {
			errorMessage = form.message;
		}
	});

	function onGoogleClick() {
		const { error } = startGoogleOAuth();
		if (error) {
			errorMessage = error;
		}
	}
</script>

<svelte:head>
	<title>Acesso Administrativo - Astrobiologia</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
    </div>

	<div class="w-full max-w-lg relative z-10">
        <div class="flex justify-center mb-10">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                    <Telescope class="w-8 h-8 text-primary" />
                </div>
                <div class="flex flex-col">
                    <span class="text-2xl font-black text-white uppercase tracking-tighter leading-none">Astrobiologia</span>
                    <span class="text-[10px] font-black text-accent uppercase tracking-[0.3em] leading-none mt-1">Command Center</span>
                </div>
            </div>
        </div>

		<div class="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-white/20">
			<div class="p-10 md:p-12">
				<div class="text-center mb-10">
					<h1 class="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Autenticação</h1>
					<p class="text-slate-500 text-sm font-medium uppercase tracking-widest">Acesse as ferramentas de editoria</p>
				</div>

				<div class="space-y-8">
					{#if errorMessage}
						<div class="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3 animate-shake">
							<div class="w-2 h-2 rounded-full bg-red-600"></div>
                            {errorMessage}
						</div>
					{/if}

					<button
						type="button"
						onclick={onGoogleClick}
						class="w-full flex items-center justify-center gap-4 px-6 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl hover:bg-slate-100 transition-all font-black uppercase tracking-widest text-[10px] shadow-sm group"
					>
						<Chrome class="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
						Continuar com Google
					</button>
					
					<div class="relative py-2 flex items-center">
						<div class="flex-1 border-t border-slate-100"></div>
						<span class="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">ou e-mail</span>
						<div class="flex-1 border-t border-slate-100"></div>
					</div>

					<form action="?/login" method="POST" class="space-y-4" use:enhance={loginEnhance}>
						<div class="relative group">
                            <Mail class="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
							<input 
								type="email" 
								name="email" 
								placeholder="E-mail Administrativo" 
								required 
								class="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-medium"
							/>
						</div>
						<div class="relative group">
                            <Lock class="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
							<input 
								type="password" 
								name="password" 
								placeholder="Chave de Acesso" 
								required 
								class="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-medium"
							/>
						</div>
						<button 
							type="submit"
							class="w-full px-6 py-4 bg-primary text-white rounded-2xl hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 transition-all font-black uppercase tracking-widest text-[10px] active:scale-[0.98]"
						>
							Entrar no Sistema
						</button>
					</form>
				</div>

				<div class="mt-12 flex flex-col items-center gap-6">
                    <div class="flex items-center gap-4">
                        <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Servidores Operacionais</span>
                    </div>
                </div>
			</div>
            
            <div class="bg-slate-50 p-6 text-center border-t border-slate-100">
                <p class="text-slate-400 text-[9px] font-black uppercase tracking-widest">
                    Desenvolvido para o Astrobiologia.com.br • © 2026
                </p>
            </div>
		</div>
	</div>
</main>

<style>
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-4px); }
        75% { transform: translateX(4px); }
    }
    .animate-shake {
        animation: shake 0.2s ease-in-out 0s 2;
    }
</style>
