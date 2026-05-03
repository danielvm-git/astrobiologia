<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Telescope } from 'lucide-svelte';
</script>

<svelte:head>
	<title>{m.admin_seo_document_title()}</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="flex min-h-[55vh] flex-col items-center justify-center px-4 py-16">
	<div class="max-w-md text-center space-y-6">
		<span
			class="inline-block rounded-full border border-accent/40 bg-accent/10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-accent"
		>
			{m.wip_badge()}
		</span>
		<div class="flex justify-center">
			<div class="rounded-2xl bg-slate-100 p-6 text-primary">
				<Telescope class="h-12 w-12" strokeWidth={1.5} />
			</div>
		</div>
		<h1 class="text-3xl font-black uppercase tracking-tighter text-slate-900">{m.wip_title()}</h1>
		<p class="text-sm font-medium leading-relaxed text-slate-600">{m.wip_body()}</p>
	</div>
</div>
