<script lang="ts">
	import { page, navigating } from '$app/state';
	import { getLocale, locales, localizeHref } from '$lib/paraglide/runtime';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

    const isAdmin = $derived(page.url.pathname.startsWith('/admin'));
</script>

<svelte:head>
	<link
		rel="preconnect"
		href="https://fonts.googleapis.com"
	/>

	<link
		rel="preconnect"
		href="https://fonts.gstatic.com"
		crossorigin="anonymous"
	/>

	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{#if navigating.to}
	<div
		class="fixed top-0 left-0 z-50 h-1 bg-accent transition-all duration-300 ease-out"
		style="width: 30%"
	>
		<div
			class="h-full w-full animate-pulse shadow-[0_0_10px_var(--accent)]"
		></div>
	</div>
{/if}

<div
	class="flex min-h-screen flex-col {isAdmin ? 'bg-muted/10' : ''}"
>
	{#if !isAdmin}
		<Header />
	{/if}

	<main
		class="flex-1 {isAdmin ? '' : 'transition-opacity duration-300'} {navigating.to ? 'opacity-50' : 'opacity-100'}"
	>
        {@render children()}
    </main>

	{#if !isAdmin}
		<Footer />
	{/if}
</div>
