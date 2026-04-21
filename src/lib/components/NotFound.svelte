<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	interface Props {
		title?: string;
		message?: string;
		showHome?: boolean;
	}

	let { title, message, showHome = true }: Props = $props();
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
	<div class="text-center">
		<h1 class="text-6xl font-bold text-slate-900 mb-4">404</h1>
		<h2 class="text-2xl font-semibold text-slate-700 mb-2">{title ?? m.not_found_title()}</h2>
		<p class="text-slate-600 mb-3 max-w-md mx-auto">{message ?? m.not_found_message()}</p>
		<p class="text-slate-500 mb-8 max-w-md mx-auto text-sm">{m.not_found_wip_hint()}</p>
		{#if showHome}
			<a
				href={localizeHref('/')}
				class="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
			>
				{m.not_found_back_home()}
			</a>
		{/if}
	</div>
</div>
