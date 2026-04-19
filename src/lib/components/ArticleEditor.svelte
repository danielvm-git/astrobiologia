<script lang="ts">
	import { goto } from '$app/navigation';
	import { CATEGORIES } from '$lib/appwrite';

	let { article = null, isLoading = $bindable(false), onSave } = $props();

	let title = $state(article?.title || '');
	let slug = $state(article?.slug || '');
	let excerpt = $state(article?.excerpt || '');
	let content = $state(article?.content || '');
	let category = $state(article?.category || 'astrobiology');
	let tags = $state(article?.tags?.join(', ') || '');
	let status = $state(article?.status || 'draft');
	let featured = $state(article?.featured || false);
	let authorName = $state(article?.authorName || 'Danilo Albergaria');
	let featuredImageUrl = $state(article?.featuredImage || '');

	const categories = CATEGORIES;

	function generateSlug(title: string) {
		return title
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-');
	}

	function handleTitleChange() {
		if (!article) {
			slug = generateSlug(title);
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		const articleData = {
			title,
			slug: slug || generateSlug(title),
			excerpt,
			content,
			category,
			tags: tags.split(',').map((t) => t.trim()),
			status,
			featured,
			authorName,
			featuredImage: featuredImageUrl,
			publishedAt: article?.publishedAt || new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		try {
			await onSave(articleData);
			await goto('/admin/artigos');
		} catch (err) {
			console.error('Save error:', err);
			alert('Erro ao salvar artigo. Por favor, tente novamente.');
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-8">
	<!-- Basic Info -->
	<div class="bg-white rounded-lg shadow p-8">
		<h2 class="text-2xl font-bold text-slate-900 mb-6">Detalhes do Artigo</h2>

		<div class="space-y-6">
			<div>
				<label for="title" class="block text-sm font-medium text-slate-700 mb-2">
					Título *
				</label>
				<input
					id="title"
					type="text"
					bind:value={title}
					onchange={handleTitleChange}
					required
					placeholder="Título do artigo"
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label for="slug" class="block text-sm font-medium text-slate-700 mb-2">
						Slug *
					</label>
					<input
						id="slug"
						type="text"
						bind:value={slug}
						required
						placeholder="slug-do-artigo"
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<div>
					<label for="category" class="block text-sm font-medium text-slate-700 mb-2">
						Categoria *
					</label>
					<select
						id="category"
						bind:value={category}
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						{#each categories as cat}
							<option value={cat.slug}>{cat.name}</option>
						{/each}
					</select>
				</div>
			</div>

			<div>
				<label for="excerpt" class="block text-sm font-medium text-slate-700 mb-2">
					Resumo *
				</label>
				<textarea
					id="excerpt"
					bind:value={excerpt}
					required
					placeholder="Breve descrição para o card e SEO"
					rows="3"
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				></textarea>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label for="author" class="block text-sm font-medium text-slate-700 mb-2">
						Autor
					</label>
					<input
						id="author"
						type="text"
						bind:value={authorName}
						placeholder="Danilo Albergaria"
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<div>
					<label for="tags" class="block text-sm font-medium text-slate-700 mb-2">
						Tags (comma-separated)
					</label>
					<input
						id="tags"
						type="text"
						bind:value={tags}
						placeholder="tag1, tag2, tag3"
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
			</div>

			<div>
				<label for="featuredImage" class="block text-sm font-medium text-slate-700 mb-2">
					URL da Imagem de Destaque
				</label>
				<input
					id="featuredImage"
					type="url"
					bind:value={featuredImageUrl}
					placeholder="https://example.com/image.jpg"
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			</div>
		</div>
	</div>

	<!-- Content -->
	<div class="bg-white rounded-lg shadow p-8">
		<h2 class="text-2xl font-bold text-slate-900 mb-6">Conteúdo</h2>

		<div>
			<label for="content" class="block text-sm font-medium text-slate-700 mb-2">
				Conteúdo (Suporta HTML) *
			</label>
			<textarea
				id="content"
				bind:value={content}
				required
				placeholder="Escreva seu artigo aqui..."
				rows="15"
				class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
			></textarea>
			<p class="text-sm text-slate-600 mt-2">
				Você pode usar tags HTML como &lt;h2&gt;, &lt;p&gt;, &lt;img&gt;, etc.
			</p>
		</div>
	</div>

	<!-- Publishing -->
	<div class="bg-white rounded-lg shadow p-8">
		<h2 class="text-2xl font-bold text-slate-900 mb-6">Publicação</h2>

		<div class="space-y-4">
			<div class="flex items-center gap-4">
				<label for="status" class="block text-sm font-medium text-slate-700">
					Status
				</label>
				<select
					id="status"
					bind:value={status}
					class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				>
					<option value="draft">Rascunho</option>
					<option value="published">Publicado</option>
				</select>
			</div>

			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" bind:checked={featured} class="w-4 h-4 rounded border-slate-300" />
				<span class="text-sm font-medium text-slate-700">Artigo em Destaque</span>
			</label>
		</div>
	</div>

	<!-- Actions -->
	<div class="flex gap-4">
		<button
			type="submit"
			disabled={isLoading}
			class="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
		>
			{isLoading ? 'Salvando...' : 'Salvar Artigo'}
		</button>
		<a
			href="/admin/artigos"
			class="px-8 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition font-medium"
		>
			Cancelar
		</a>
	</div>
</form>
