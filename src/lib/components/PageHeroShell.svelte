<script lang="ts">
	let {
		kicker,
		title,
		quote
	}: {
		kicker?: string;
		title: string;
		quote?: string;
	} = $props();
</script>

<header class="bg-slate-900">
	<div class="mx-auto max-w-7xl px-4 pt-8 pb-6 text-center sm:px-6 md:pt-10 md:pb-8 lg:px-8">
		{#if kicker}
			<p class="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-accent">{kicker}</p>
		{/if}
		<h1 class="font-sans text-3xl font-black tracking-tight text-white md:text-5xl md:leading-tight">
			{title}<span class="text-accent">.</span>
		</h1>
		{#if quote}
			<p class="mx-auto mt-6 max-w-3xl font-serif text-lg italic leading-relaxed text-slate-400 md:text-xl">
				{quote}
			</p>
		{/if}
	</div>
</header>
