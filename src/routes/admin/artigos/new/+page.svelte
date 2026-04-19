<script lang="ts">
	import ArticleEditor from '$lib/components/ArticleEditor.svelte';
	import { createArticle, createTranslation } from '$lib/appwrite';

	let isLoading = $state(false);

	async function saveArticle(articleData: any, translations: any[]) {
		isLoading = true;

		try {
			// 1. Create master
			const master = await createArticle(articleData);

            // 2. Create translations
            for (const trans of translations) {
                await createTranslation({
                    ...trans,
                    article_id: master.$id
                });
            }
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
	<h1 class="text-3xl font-black text-slate-900 uppercase tracking-tight">Criar Novo Artigo</h1>
	<p class="text-slate-500 mt-2 text-sm font-medium uppercase tracking-widest">Inicie um novo conteúdo científico</p>
</div>

<ArticleEditor bind:isLoading={isLoading} onSave={saveArticle} />
