<script lang="ts">
	import ArticleEditor from '$lib/components/ArticleEditor.svelte';
	import { 
        updateArticle, 
        updateTranslation, 
        createTranslation, 
        type ArticleTranslation 
    } from '$lib/appwrite';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let isLoading = $state(false);

	async function saveArticle(articleData: any, translations: any[]) {
		isLoading = true;

		try {
            // 1. Update master metadata
			await updateArticle(data.article.$id, articleData);

            // 2. Upsert translations
            for (const trans of translations) {
                const existing = data.translations.find((t: any) => t.language === trans.language);
                
                if (existing) {
                    await updateTranslation(existing.$id, trans);
                } else {
                    await createTranslation({
                        ...trans,
                        article_id: data.article.$id
                    });
                }
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
	<title>Editar Artigo - Admin Astrobiologia</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mb-8">
	<h1 class="text-3xl font-black text-slate-900 uppercase tracking-tight">Editar Artigo</h1>
	<p class="text-slate-500 mt-2 text-sm font-medium uppercase tracking-widest">Ajustando conteúdo e metadados</p>
</div>

<ArticleEditor 
    article={data.article} 
    translations={data.translations}
    bind:isLoading={isLoading} 
    onSave={saveArticle} 
/>
