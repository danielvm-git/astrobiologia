<script lang="ts">
    import { deserialize } from '$app/forms';
    import { 
        Plus, 
        Search, 
        Filter, 
        MoreVertical, 
        Edit3, 
        Trash2, 
        Eye, 
        FileText,
        Globe,
        Calendar,
        ChevronLeft,
        ChevronRight
    } from 'lucide-svelte';
    import { cn } from '$lib/utils';
    import { localizeHref, locales } from '$lib/paraglide/runtime';
	
	let { data } = $props();
	let articles = $state<any[]>([]);
	let isDeleting = $state<Record<string, boolean>>({});
    let searchQuery = $state('');

    $effect(() => {
        if (data.articles) {
            articles = [...data.articles];
        }
    });

	async function deleteArticle(articleId: string) {
		if (!confirm('Tem certeza que deseja excluir este artigo? Todos os idiomas serão removidos.')) return;

		isDeleting[articleId] = true;

		try {
            const formData = new FormData();
            formData.append('id', articleId);

            const response = await fetch('?/delete', {
                method: 'POST',
                body: formData
            });

            const result = deserialize(await response.text());

            if (result.type === 'success') {
                articles = articles.filter((a) => a.$id !== articleId);
            } else {
                const errorMessage = (result as any).data?.error || 'Erro ao excluir';
                alert(errorMessage);
            }
		} catch (err) {
			console.error('Delete error:', err);
			alert('Erro ao excluir artigo');
		} finally {
			isDeleting[articleId] = false;
		}
	}

    const filteredArticles = $derived(
        articles.filter(a => 
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
</script>

<svelte:head>
	<title>Gerenciar Artigos - Admin Astrobiologia</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="space-y-8">
	<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
		<div>
			<h1 class="text-4xl font-black text-slate-900 uppercase tracking-tighter">Artigos</h1>
			<p class="text-slate-500 mt-2 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                <FileText class="w-4 h-4 text-primary" />
                Repositório de Conteúdo Científico
            </p>
		</div>
		<a
			href="/admin/artigos/new"
			class="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-primary/20"
		>
			<Plus class="w-4 h-4" />
			Novo Artigo
		</a>
	</div>

    <!-- Filters Bar -->
    <div class="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div class="relative flex-1">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
                type="text" 
                bind:value={searchQuery}
                placeholder="Buscar por título ou categoria..." 
                class="w-full pl-12 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm"
            />
        </div>
        <div class="flex gap-2">
            <button class="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2 text-sm font-bold">
                <Filter class="w-4 h-4" />
                Filtros
            </button>
        </div>
    </div>

	{#if filteredArticles && filteredArticles.length > 0}
		<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
			<table class="w-full border-collapse">
				<thead>
					<tr class="bg-slate-50/50 border-b border-slate-200">
						<th class="text-left py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Conteúdo</th>
						<th class="text-left py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
						<th class="text-left py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
						<th class="text-left py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Publicação</th>
						<th class="text-right py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100">
					{#each filteredArticles as article (article.$id)}
						<tr class="hover:bg-slate-50/50 transition-colors group">
							<td class="py-5 px-6">
                                <div class="flex items-center gap-4">
                                    <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <FileText class="w-5 h-5" />
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                                            {article.title}
                                        </p>
                                        <div class="flex items-center gap-2 mt-1">
                                            {#each locales as tag}
                                                <div class={cn("flex items-center gap-1", !article.languages[tag] && "opacity-40")}>
                                                    <div class={cn("w-2 h-2 rounded-full", article.languages[tag] ? "bg-green-500" : "bg-slate-300")}></div>
                                                    <span class="text-[9px] font-black text-slate-400 uppercase">{tag === 'pt-br' ? 'PT' : tag.toUpperCase()}</span>
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                </div>
                            </td>
							<td class="py-5 px-6">
								<span class="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                                    {article.category}
                                </span>
							</td>
							<td class="py-5 px-6">
								<span
									class={cn(
                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                        article.status === 'published'
										    ? 'bg-green-50 text-green-700 border-green-100'
										    : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                    )}
								>
                                    <div class={cn("w-1.5 h-1.5 rounded-full", article.status === 'published' ? 'bg-green-600' : 'bg-yellow-600')}></div>
									{article.status === 'published' ? 'Publicado' : 'Rascunho'}
								</span>
							</td>
							<td class="py-5 px-6">
								<div class="flex flex-col">
                                    <span class="text-xs font-bold text-slate-700">{formatDate(article.publishedAt || article.$createdAt)}</span>
                                    <span class="text-[10px] text-slate-400 uppercase tracking-widest font-black">Por {article.authorName || 'Danilo'}</span>
                                </div>
							</td>
							<td class="py-5 px-6">
								<div class="flex justify-end gap-2">
									<a
										href="/admin/artigos/{article.$id}/edit"
										class="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                        title="Editar"
									>
										<Edit3 class="w-4 h-4" />
									</a>
									<button
										onclick={() => deleteArticle(article.$id)}
										disabled={isDeleting[article.$id]}
										class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                        title="Excluir"
									>
										<Trash2 class="w-4 h-4" />
									</button>
									<a
										href={localizeHref(`/artigos/${article.slug}`)}
										target="_blank"
										rel="noopener noreferrer"
										class="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                                        title="Ver no site"
									>
										<Eye class="w-4 h-4" />
									</a>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
            
            <!-- Pagination Placeholder -->
            <div class="bg-slate-50/50 p-4 border-t border-slate-100 flex items-center justify-between">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Exibindo {filteredArticles.length} de {articles.length} artigos
                </p>
                <div class="flex items-center gap-2">
                    <button class="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-30" disabled>
                        <ChevronLeft class="w-4 h-4" />
                    </button>
                    <button class="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-30" disabled>
                        <ChevronRight class="w-4 h-4" />
                    </button>
                </div>
            </div>
		</div>
	{:else}
		<div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-20 text-center space-y-6">
			<div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                <FileText class="w-10 h-10" />
            </div>
			<div class="max-w-xs mx-auto">
                <h2 class="text-xl font-black text-slate-900 uppercase tracking-tight">Nenhum Artigo</h2>
                <p class="text-slate-500 mt-2 text-sm font-medium uppercase tracking-widest leading-relaxed">
                    Você ainda não possui publicações. Comece criando seu primeiro conteúdo.
                </p>
            </div>
			<a
				href="/admin/artigos/new"
				class="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
			>
                <Plus class="w-4 h-4" />
				Criar Primeiro Artigo
			</a>
		</div>
	{/if}
</div>
