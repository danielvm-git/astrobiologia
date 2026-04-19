<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import { page } from '$app/stores';
	let { children } = $props();
	const isAdmin = $derived($page.url.pathname.startsWith('/admin'));
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="flex min-h-screen flex-col">
{#if !isAdmin}
	<Header />
{/if}
<main class="flex-1">
	{@render children()}
</main>
{#if !isAdmin}
	<Footer />
{/if}
</div>
