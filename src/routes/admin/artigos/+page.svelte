<script lang="ts">
	import { databases, DATABASE_ID } from '$lib/appwrite';
	
	let { data } = $props();
	let articles = $state(data.articles);
	let isDeleting = $state<Record<string, boolean>>({});

	async function deleteArticle(articleId: string) {
		if (!confirm('Tem certeza que deseja excluir este artigo?')) return;

		isDeleting[articleId] = true;

		try {
			const ARTICLES_COLLECTION_ID = 'articles';

			await databases.deleteDocument(DATABASE_ID, ARTICLES_COLLECTION_ID, articleId);
			articles = articles.filter((a) => a.$id !== articleId);
		} catch (err) {
			console.error('Delete error:', err);
			alert('Erro ao excluir artigo');
		} finally {
			isDeleting[articleId] = false;
		}
	}
</script>

<svelte:head>
	<title>Gerenciar Artigos - Admin Astrobiologia</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div>
	<div class="flex justify-between items-center mb-8">
		<div>
			<h1 class="text-3xl font-bold text-slate-900">Artigos</h1>
			<p class="text-slate-600 mt-2">Gerencie seus artigos publicados e rascunhos</p>
		</div>
		<a
			href="/admin/artigos/new"
			class="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
		>
			Novo Artigo
		</a>
	</div>

	{#if articles && articles.length > 0}
		<div class="bg-white rounded-lg shadow overflow-hidden">
			<table class="w-full">
				<thead class="bg-slate-50 border-b border-slate-200">
					<tr>
						<th class="text-left py-4 px-6 font-semibold text-slate-700">Título</th>
						<th class="text-left py-4 px-6 font-semibold text-slate-700">Categoria</th>
						<th class="text-left py-4 px-6 font-semibold text-slate-700">Status</th>
						<th class="text-left py-4 px-6 font-semibold text-slate-700">Data</th>
						<th class="text-left py-4 px-6 font-semibold text-slate-700">Ações</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-200">
					{#each articles as article (article.$id)}
						<tr class="hover:bg-slate-50 transition">
							<td class="py-4 px-6 text-slate-900 font-medium">{article.title}</td>
							<td class="py-4 px-6 text-slate-600">{article.category}</td>
							<td class="py-4 px-6">
								<span
									class="inline-block px-3 py-1 rounded-full text-sm font-medium {article.status === 'published'
										? 'bg-green-100 text-green-800'
										: 'bg-yellow-100 text-yellow-800'}"
								>
									{article.status}
								</span>
							</td>
							<td class="py-4 px-6 text-slate-600 text-sm">
								{new Date(article.publishedAt || article.$createdAt).toLocaleDateString()}
							</td>
							<td class="py-4 px-6">
								<div class="flex gap-3">
									<a
										href="/admin/artigos/{article.$id}/edit"
										class="text-primary hover:text-primary/80 font-medium"
									>
										Editar
									</a>
									<button
										onclick={() => deleteArticle(article.$id)}
										disabled={isDeleting[article.$id]}
										class="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
									>
										{isDeleting[article.$id] ? 'Excluindo...' : 'Excluir'}
									</button>
									<a
										href="/artigos/{article.slug}"
										target="_blank"
										rel="noopener noreferrer"
										class="text-slate-600 hover:text-slate-700"
									>
										Ver
									</a>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="bg-white rounded-lg shadow p-12 text-center">
			<p class="text-slate-600 text-lg mb-6">Nenhum artigo encontrado</p>
			<a
				href="/admin/artigos/new"
				class="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
			>
				Criar seu primeiro artigo
			</a>
		</div>
	{/if}
</div>
