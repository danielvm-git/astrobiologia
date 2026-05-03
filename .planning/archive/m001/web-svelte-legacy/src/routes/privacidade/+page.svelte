<script lang="ts">
	import { page } from '$app/state';
	import PageHeroShell from '$lib/components/PageHeroShell.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<svelte:head>
	<title>{m.page_privacy_title()} — {m.site_title()}</title>
	<meta name="description" content={m.page_privacy_intro()} />
</svelte:head>

<main class="min-h-screen bg-background">
	{#key page.url.pathname}
		<PageHeroShell title={m.page_privacy_title()} />
		<section class="border-t border-slate-200 py-12 md:py-16">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="prose prose-slate max-w-2xl">
					<p class="text-xl font-serif italic leading-relaxed text-slate-600">
						{m.page_privacy_intro()}
					</p>
					<p class="text-slate-700">
						{m.page_privacy_body()}
					</p>
				</div>
			</div>
		</section>
	{/key}
</main>
