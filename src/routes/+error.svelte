<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Error</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
	<div class="text-center px-4">
		<h1 class="text-6xl font-bold text-slate-900 mb-4">
			{$page.status || 500}
		</h1>
		<p class="text-xl text-slate-600 mb-2">
			{$page.error?.message || 'Something went wrong'}
		</p>
		<p class="text-slate-500 mb-8">Sorry, we encountered an error. Please try again later.</p>
		<a href="/" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
			>Return Home</a
		>
	</div>
</div>

<style>
	:global(body) {
		background: linear-gradient(to bottom right, rgb(241, 245, 249), rgb(226, 232, 240));
	}
</style>
