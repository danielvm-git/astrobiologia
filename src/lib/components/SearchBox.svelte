<script lang="ts">
	import { Search } from 'lucide-svelte';
	let { onsearch } = $props();
	let query = $state('');

	function handleSearch() {
		onsearch?.({ query });
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSearch();
		}
	}
</script>

<div class="w-full">
	<div class="relative group">
		<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
			<Search class="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
		</div>
		<input
			type="text"
			placeholder="Buscar artigos..."
			bind:value={query}
			onkeydown={handleKeydown}
			class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 placeholder-slate-500 transition-all"
		/>
		<button
			onclick={handleSearch}
			class="absolute right-2 top-1.5 px-4 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium"
		>
			Buscar
		</button>
	</div>
</div>
