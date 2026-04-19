<script lang="ts">
	import ArticleEditor from '$lib/components/ArticleEditor.svelte';
	import { databases } from '$lib/appwrite';

	let isLoading = false;

	async function saveArticle(articleData: any) {
		isLoading = true;

		try {
			const DATABASE_ID = 'astrobiology_db';
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
	<title>Create Article - Astrobiologia Admin</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mb-8">
	<h1 class="text-3xl font-bold text-slate-900">Create New Article</h1>
	<p class="text-slate-600 mt-2">Write and publish a new article to your blog</p>
</div>

<ArticleEditor {isLoading} onSave={saveArticle} />
