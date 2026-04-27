<script lang="ts">
	import { page } from '$app/state';
	import PageHeroShell from '$lib/components/PageHeroShell.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<svelte:head>
	<title>{m.page_contact_title()} — {m.site_title()}</title>
	<meta name="description" content={m.page_contact_intro()} />
</svelte:head>

<main class="min-h-screen bg-background">
	{#key page.url.pathname}
		<PageHeroShell title={m.page_contact_title()} />
		<section class="border-t border-slate-200 py-12 md:py-16">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="prose prose-slate max-w-2xl">
					<p class="text-xl font-serif italic leading-relaxed text-slate-600">
						{m.page_contact_intro()}
					</p>
					<p class="text-slate-800">
						<span class="font-semibold">{m.page_contact_email_prefix()}</span>
						<a href="mailto:danilo.albergaria@gmail.com" class="text-primary underline underline-offset-2 hover:text-primary/90"
							>danilo.albergaria@gmail.com</a
						>
					</p>
				</div>
			</div>
		</section>
	{/key}
</main>
