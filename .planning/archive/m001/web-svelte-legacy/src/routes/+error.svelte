<script lang="ts">
	import { page } from '$app/state';
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
</script>

<svelte:head>
	<title>{m.error_page_title()} {page.status || 500}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-slate-50">
	<div class="text-center px-4">
		<h1 class="text-6xl font-black text-slate-900 mb-4">
			{page.status || 500}
		</h1>
		<p class="text-xl text-slate-600 mb-2 font-serif italic">
			{page.error?.message || m.error_default_message()}
		</p>
		<p class="text-slate-600 mb-3 max-w-md mx-auto text-sm font-medium">{m.error_wip_kicker()}</p>
		<p class="text-slate-500 mb-8 uppercase tracking-widest text-xs font-bold">{m.error_detail()}</p>
		<a
			href={localizeHref('/')}
			class="inline-block px-8 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition shadow-lg shadow-primary/20"
			>{m.error_back_home()}</a
		>
	</div>
</div>

<style>
	:global(body) {
		background-color: #f8fafc;
	}
</style>
