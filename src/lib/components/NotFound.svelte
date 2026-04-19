<script lang="ts">
	export let title = 'Page Not Found';
	export let message = 'The page you&apos;re looking for does not exist.';
	export let showHome = true;
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
	<div class="text-center">
		<h1 class="text-6xl font-bold text-slate-900 mb-4">404</h1>
		<h2 class="text-2xl font-semibold text-slate-700 mb-2">{title}</h2>
		<p class="text-slate-600 mb-8 max-w-md mx-auto">{message}</p>
		{#if showHome}
			<a href="/" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
				Return to Home
			</a>
		{/if}
	</div>
</div>
