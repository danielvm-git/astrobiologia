<script lang="ts">
	import { page as errorPage } from '$app/state';
</script>

<svelte:head>
	<title>Error</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-slate-50">
	<div class="text-center px-4">
		<h1 class="text-6xl font-black text-slate-900 mb-4">
			{errorPage.status || 500}
		</h1>
		<p class="text-xl text-slate-600 mb-2 font-serif italic">
			{errorPage.error?.message || 'Algo deu errado'}
		</p>
		<p class="text-slate-500 mb-8 uppercase tracking-widest text-xs font-bold">Desculpe, encontramos um erro. Por favor, tente novamente mais tarde.</p>
		<a href="/" class="inline-block px-8 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition shadow-lg shadow-primary/20"
			>Voltar para o Início</a
		>
	</div>
</div>

<style>
	:global(body) {
		background-color: #f8fafc;
	}
</style>
