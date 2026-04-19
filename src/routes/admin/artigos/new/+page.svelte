<script lang="ts">
	import ArticleEditor from '$lib/components/ArticleEditor.svelte';
	import { databases, DATABASE_ID } from '$lib/appwrite';

	let isLoading = $state(false);

	async function saveArticle(articleData: any) {
		isLoading = true;

		try {
			const ARTICLES_COLLECTION_ID = 'articles';

			await databases.createDocument(
				DATABASE_ID,
				ARTICLES_COLLECTION_ID,
				'unique()',
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
	<title>Criar Artigo - Admin Astrobiologia</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mb-8">
	<h1 class="text-3xl font-bold text-slate-900">Criar Novo Artigo</h1>
	<p class="text-slate-600 mt-2">Escreva e publique um novo artigo no seu site</p>
</div>

<ArticleEditor bind:isLoading={isLoading} onSave={saveArticle} />
