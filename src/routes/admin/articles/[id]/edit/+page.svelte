<script lang="ts">
	import ArticleEditor from '$lib/components/ArticleEditor.svelte';
	import { databases } from '$lib/appwrite';
	import type { PageData } from './$types';

	export let data: PageData;

	let isLoading = false;

	async function saveArticle(articleData: any) {
		isLoading = true;

		try {
			const DATABASE_ID = 'astrobiology_db';
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
	<title>Edit Article - Astrobiologia Admin</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mb-8">
	<h1 class="text-3xl font-bold text-slate-900">Edit Article</h1>
	<p class="text-slate-600 mt-2">Update "{data.article.title}"</p>
</div>

<ArticleEditor article={data.article} {isLoading} onSave={saveArticle} />
