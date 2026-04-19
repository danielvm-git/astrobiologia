<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let query = '';

	function handleSearch() {
		dispatch('search', { query });
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSearch();
		}
	}
</script>

<div class="w-full max-w-lg">
	<div class="relative">
		<input
			type="text"
			placeholder="Search articles..."
			bind:value={query}
			on:keydown={handleKeydown}
			class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-500"
		/>
		<button
			on:click={handleSearch}
			class="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
		>
			Search
		</button>
	</div>
</div>

<style>
	input::placeholder {
		color: rgb(100, 116, 139);
	}
</style>
