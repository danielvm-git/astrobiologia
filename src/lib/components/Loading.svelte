<script lang="ts">
	export let message = 'Loading...';
</script>

<div class="flex items-center justify-center min-h-screen">
	<div class="text-center">
		<div class="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-slate-300 border-t-blue-600 animate-spin mb-4"></div>
		<p class="text-slate-600">{message}</p>
	</div>
</div>
