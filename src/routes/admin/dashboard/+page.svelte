<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const { stats, error } = data;
</script>

<svelte:head>
	<title>Painel Administrativo - Astrobiologia</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="max-w-7xl mx-auto">
	{#if error}
		<div class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg mb-8">
			<h2 class="text-lg font-bold mb-2">Erro ao carregar dados</h2>
			<p>{error}</p>
			<button 
				onclick={() => window.location.reload()} 
				class="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition font-medium"
			>
				Tentar Novamente
			</button>
		</div>
	{/if}

	<div class="mb-8">
		<h1 class="text-3xl font-bold text-slate-900">Dashboard</h1>
		<p class="text-slate-600 mt-2">Bem-vindo ao Sistema de Gerenciamento de Conteúdo do Astrobiologia.com.br</p>
	</div>

	{#if stats}
		<!-- Stats Grid -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-slate-600 text-sm font-medium">Total de Artigos</p>
						<p class="text-3xl font-bold text-slate-900 mt-2">{stats.totalArticles}</p>
					</div>
					<div class="text-4xl text-primary/40">📄</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-slate-600 text-sm font-medium">Publicados</p>
						<p class="text-3xl font-bold text-slate-900 mt-2">{stats.publishedArticles}</p>
					</div>
					<div class="text-4xl text-green-500/40">✓</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-slate-600 text-sm font-medium">Rascunhos</p>
						<p class="text-3xl font-bold text-slate-900 mt-2">{stats.draftArticles}</p>
					</div>
					<div class="text-4xl text-yellow-500/40">✎</div>
				</div>
			</div>

			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-slate-600 text-sm font-medium">Categorias</p>
						<p class="text-3xl font-bold text-slate-900 mt-2">{stats.categories}</p>
					</div>
					<div class="text-4xl text-accent/40">🏷️</div>
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="bg-white rounded-lg shadow p-6 mb-8">
			<h2 class="text-xl font-bold text-slate-900 mb-4">Ações Rápidas</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<a
					href="/admin/artigos/new"
					class="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-center font-medium"
				>
					Criar Novo Artigo
				</a>
				<a
					href="/admin/artigos"
					class="px-4 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition text-center font-medium"
				>
					Gerenciar Artigos
				</a>
			</div>
		</div>

		<div class="bg-white rounded-lg shadow p-6">
			<h2 class="text-xl font-bold text-slate-900 mb-4">Artigos Recentes</h2>
			{#if stats.recentArticles && stats.recentArticles.length > 0}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="border-b border-slate-200">
							<tr>
								<th class="text-left py-3 px-4 font-semibold text-slate-700">Título</th>
								<th class="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
								<th class="text-left py-3 px-4 font-semibold text-slate-700">Data</th>
								<th class="text-left py-3 px-4 font-semibold text-slate-700">Ações</th>
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
										{new Date(article.publishedAt || article.$createdAt).toLocaleDateString()}
									</td>
									<td class="py-3 px-4">
										<a
											href="/admin/artigos/{article.$id}/edit"
											class="text-primary hover:text-primary/80 font-medium"
										>
											Editar
										</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<p class="text-slate-600">Nenhum artigo encontrado. Crie seu primeiro artigo para começar!</p>
			{/if}
		</div>
	{:else if !error}
		<div class="flex justify-center items-center py-20">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
		</div>
	{/if}
</div>
