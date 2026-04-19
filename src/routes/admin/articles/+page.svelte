<script lang="ts">
	import { goto } from '$app/navigation';
	import { databases } from '$lib/appwrite';
	import type { PageData } from './$types';

	export let data: PageData;
	let articles = data.articles;
	let isDeleting: Record<string, boolean> = {};

	async function deleteArticle(articleId: string) {
		if (!confirm('Are you sure you want to delete this article?')) return;

		isDeleting[articleId] = true;

		try {
			const DATABASE_ID = 'astrobiology_db';
			const ARTICLES_COLLECTION_ID = 'articles';

			await databases.deleteDocument(DATABASE_ID, ARTICLES_COLLECTION_ID, articleId);
			articles = articles.filter((a) => a.$id !== articleId);
		} catch (err) {
			console.error('Delete error:', err);
			alert('Failed to delete article');
		} finally {
			isDeleting[articleId] = false;
		}
	}
</script>

<svelte:head>
	<title>Manage Articles - Astrobiologia Admin</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div>
	<div class="flex justify-between items-center mb-8">
		<div>
			<h1 class="text-3xl font-bold text-slate-900">Articles</h1>
			<p class="text-slate-600 mt-2">Manage your published and draft articles</p>
		</div>
		<a
			href="/admin/articles/new"
			class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
		>
			New Article
		</a>
	</div>

	{#if articles && articles.length > 0}
		<div class="bg-white rounded-lg shadow overflow-hidden">
			<table class="w-full">
				<thead class="bg-slate-50 border-b border-slate-200">
					<tr>
						<th class="text-left py-4 px-6 font-semibold text-slate-700">Title</th>
						<th class="text-left py-4 px-6 font-semibold text-slate-700">Category</th>
						<th class="text-left py-4 px-6 font-semibold text-slate-700">Status</th>
						<th class="text-left py-4 px-6 font-semibold text-slate-700">Date</th>
						<th class="text-left py-4 px-6 font-semibold text-slate-700">Actions</th>
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
										href="/admin/articles/{article.$id}/edit"
										class="text-blue-600 hover:text-blue-700 font-medium"
									>
										Edit
									</a>
									<button
										on:click={() => deleteArticle(article.$id)}
										disabled={isDeleting[article.$id]}
										class="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
									>
										{isDeleting[article.$id] ? 'Deleting...' : 'Delete'}
									</button>
									<a
										href="/articles/{article.slug}"
										target="_blank"
										rel="noopener noreferrer"
										class="text-slate-600 hover:text-slate-700"
									>
										View
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
			<p class="text-slate-600 text-lg mb-6">No articles yet</p>
			<a
				href="/admin/articles/new"
				class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
			>
				Create Your First Article
			</a>
		</div>
	{/if}
</div>
