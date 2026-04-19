<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const { stats } = data;
</script>

<svelte:head>
	<title>Admin Dashboard - Astrobiologia</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div>
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-slate-900">Dashboard</h1>
		<p class="text-slate-600 mt-2">Welcome to the Astrobiologia Content Management System</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
		<div class="bg-white rounded-lg shadow p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-slate-600 text-sm font-medium">Total Articles</p>
					<p class="text-3xl font-bold text-slate-900 mt-2">{stats.totalArticles}</p>
				</div>
				<div class="text-4xl">📄</div>
			</div>
		</div>

		<div class="bg-white rounded-lg shadow p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-slate-600 text-sm font-medium">Published</p>
					<p class="text-3xl font-bold text-slate-900 mt-2">{stats.publishedArticles}</p>
				</div>
				<div class="text-4xl">✓</div>
			</div>
		</div>

		<div class="bg-white rounded-lg shadow p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-slate-600 text-sm font-medium">Drafts</p>
					<p class="text-3xl font-bold text-slate-900 mt-2">{stats.draftArticles}</p>
				</div>
				<div class="text-4xl">✎</div>
			</div>
		</div>

		<div class="bg-white rounded-lg shadow p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-slate-600 text-sm font-medium">Categories</p>
					<p class="text-3xl font-bold text-slate-900 mt-2">{stats.categories}</p>
				</div>
				<div class="text-4xl">🏷️</div>
			</div>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="bg-white rounded-lg shadow p-6 mb-8">
		<h2 class="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<a
				href="/admin/articles/new"
				class="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium"
			>
				Create New Article
			</a>
			<a
				href="/admin/articles"
				class="px-4 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition text-center font-medium"
			>
				Manage Articles
			</a>
		</div>
	</div>

	<!-- Recent Articles -->
	<div class="bg-white rounded-lg shadow p-6">
		<h2 class="text-xl font-bold text-slate-900 mb-4">Recent Articles</h2>
		{#if stats.recentArticles && stats.recentArticles.length > 0}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="border-b border-slate-200">
						<tr>
							<th class="text-left py-3 px-4 font-semibold text-slate-700">Title</th>
							<th class="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
							<th class="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
							<th class="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each stats.recentArticles as article (article.$id)}
							<tr class="border-b border-slate-100 hover:bg-slate-50">
								<td class="py-3 px-4 text-slate-900">{article.title}</td>
								<td class="py-3 px-4">
									<span
										class="inline-block px-3 py-1 rounded-full text-sm font-medium {article.status === 'published'
											? 'bg-green-100 text-green-800'
											: 'bg-yellow-100 text-yellow-800'}"
									>
										{article.status}
									</span>
								</td>
								<td class="py-3 px-4 text-slate-600 text-sm">
									{new Date(article.publishedAt).toLocaleDateString()}
								</td>
								<td class="py-3 px-4">
									<a
										href="/admin/articles/{article.$id}/edit"
										class="text-blue-600 hover:text-blue-700 font-medium"
									>
										Edit
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p class="text-slate-600">No articles yet. Create your first article to get started!</p>
		{/if}
	</div>
</div>
