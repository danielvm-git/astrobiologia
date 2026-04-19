<script lang="ts">
	import ArticleEditor from '$lib/components/ArticleEditor.svelte';
	import { databases, DATABASE_ID } from '$lib/appwrite';
	import type { PageData } from './$types';

	let { data } = $props();

	let isLoading = $state(false);

	async function saveArticle(articleData: any) {
		isLoading = true;

		try {
			const ARTICLES_COLLECTION_ID = 'articles';

			await databases.updateDocument(
				DATABASE_ID,
				ARTICLES_COLLECTION_ID,
				data.article.$id,
				articleData
			);
		} catch (err) {
			console.error('Error saving article:', err);
			throw err;
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Editar Artigo - Admin Astrobiologia</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mb-8">
	<h1 class="text-3xl font-bold text-slate-900">Editar Artigo</h1>
	<p class="text-slate-600 mt-2">Atualizando "{data.article.title}"</p>
</div>

<ArticleEditor article={data.article} bind:isLoading={isLoading} onSave={saveArticle} />
