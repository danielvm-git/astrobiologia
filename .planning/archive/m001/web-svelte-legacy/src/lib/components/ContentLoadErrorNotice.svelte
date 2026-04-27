<script lang="ts">
	import * as m from '$lib/paraglide/messages';

	let { show = false }: { show?: boolean } = $props();
</script>

{#if show}
	<div
		role="alert"
		class="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
	>
		{m.error_detail()}
	</div>
{/if}
