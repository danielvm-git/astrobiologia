<script lang="ts">
	import { deserialize } from '$app/forms';
	import { goto } from '$app/navigation';
	import ArticleEditor from '$lib/components/ArticleEditor.svelte';

	let isLoading = $state(false);

	async function saveArticle(articleData: any, translations: any[]) {
		isLoading = true;

		try {
            const formData = new FormData();
            formData.append('articleData', JSON.stringify(articleData));
            formData.append('translations', JSON.stringify(translations));

            const response = await fetch('?/save', {
                method: 'POST',
                body: formData
            });

            const result = deserialize(await response.text());

            if (result.type === 'success') {
                await goto('/admin/artigos');
            } else if (result.type === 'failure' || result.type === 'error') {
                const errorMessage = (result as any).data?.error || (result as any).error?.message || 'Erro ao salvar';
                alert(errorMessage);
            }
		} catch (err) {
			console.error('Error saving article:', err);
			alert('Erro inesperado ao salvar.');
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
