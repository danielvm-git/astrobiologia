<script lang="ts">
	import { goto } from '$app/navigation';
	import { CATEGORIES, uploadImage, getImageUrl } from '$lib/appwrite';
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';
	import Placeholder from '@tiptap/extension-placeholder';

	let { article = null, isLoading = $bindable(false), onSave } = $props();

	let title = $state(article?.title || '');
	let slug = $state(article?.slug || '');
	let excerpt = $state(article?.excerpt || '');
	let content = $state(article?.content || '');
	let category = $state(article?.category || 'noticias');
	let tags = $state(article?.tags?.join(', ') || '');
	let status = $state(article?.status || 'draft');
	let featured = $state(article?.featured || false);
	let authorName = $state(article?.authorName || 'Danilo Albergaria');
	let featuredImageId = $state(article?.featuredImage || '');
	let featuredImageUrl = $derived(featuredImageId ? getImageUrl(featuredImageId) : '');

	let editorElement = $state<HTMLElement | null>(null);
	let editor = $state<Editor | null>(null);

	const categories = CATEGORIES;

	onMount(() => {
		if (editorElement) {
			editor = new Editor({
				element: editorElement,
				extensions: [
					StarterKit,
					Link.configure({
						openOnClick: false,
						HTMLAttributes: {
							class: 'text-primary underline'
						}
					}),
					Image.configure({
						HTMLAttributes: {
							class: 'rounded-lg max-w-full h-auto my-6'
						}
					}),
					Placeholder.configure({
						placeholder: 'Escreva seu artigo aqui...'
					})
				],
				content: content,
				onUpdate: ({ editor }) => {
					content = editor.getHTML();
				},
				editorProps: {
					attributes: {
						class: 'prose prose-slate max-w-none focus:outline-none min-h-[400px] px-4 py-2'
					}
				}
			});
		}
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

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

	async function handleFeaturedImageUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			isLoading = true;
			try {
				const fileId = await uploadImage(target.files[0]);
				featuredImageId = fileId;
			} catch (err) {
				console.error('Image upload error:', err);
				alert('Erro ao enviar imagem. Tente novamente.');
			} finally {
				isLoading = false;
			}
		}
	}

	async function addImageToContent() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = async () => {
			if (input.files && input.files[0]) {
				isLoading = true;
				try {
					const fileId = await uploadImage(input.files[0]);
					const url = getImageUrl(fileId);
					editor?.chain().focus().setImage({ src: url }).run();
				} catch (err) {
					console.error('Content image upload error:', err);
					alert('Erro ao enviar imagem para o conteúdo.');
				} finally {
					isLoading = false;
				}
			}
		};
		input.click();
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
			featuredImage: featuredImageId,
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

<form onsubmit={handleSubmit} class="space-y-8 pb-20">
	<!-- Basic Info -->
	<div class="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
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
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
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
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
					/>
				</div>

				<div>
					<label for="category" class="block text-sm font-medium text-slate-700 mb-2">
						Categoria *
					</label>
					<select
						id="category"
						bind:value={category}
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
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
					class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
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
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
					/>
				</div>

				<div>
					<label for="tags" class="block text-sm font-medium text-slate-700 mb-2">
						Tags (separadas por vírgula)
					</label>
					<input
						id="tags"
						type="text"
						bind:value={tags}
						placeholder="tag1, tag2, tag3"
						class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
					/>
				</div>
			</div>

			<div>
				<label class="block text-sm font-medium text-slate-700 mb-2">
					Imagem de Destaque
				</label>
				<div class="flex items-start gap-4">
					{#if featuredImageUrl}
						<div class="relative w-40 h-24 rounded-lg overflow-hidden border border-slate-200">
							<img src={featuredImageUrl} alt="Preview" class="w-full h-full object-cover" />
							<button
								type="button"
								onclick={() => (featuredImageId = '')}
								class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
							>
								<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					{/if}
					<div class="flex-1">
						<input
							type="file"
							accept="image/*"
							onchange={handleFeaturedImageUpload}
							class="block w-full text-sm text-slate-500
								file:mr-4 file:py-2 file:px-4
								file:rounded-full file:border-0
								file:text-sm file:font-semibold
								file:bg-primary/10 file:text-primary
								hover:file:bg-primary/20 transition"
						/>
						<p class="mt-1 text-xs text-slate-500">PNG, JPG ou WEBP. Máx 5MB.</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Content (Tiptap Editor) -->
	<div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
		<div class="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap gap-1">
			<!-- Editor Toolbar -->
			<button
				type="button"
				onclick={() => editor?.chain().focus().toggleBold().run()}
				class="p-2 rounded hover:bg-slate-200 transition {editor?.isActive('bold') ? 'bg-slate-200' : ''}"
				title="Negrito"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h8a4 4 0 100-8H6v8zm0 0h10a4 4 0 110 8H6v-8z" />
				</svg>
			</button>
			<button
				type="button"
				onclick={() => editor?.chain().focus().toggleItalic().run()}
				class="p-2 rounded hover:bg-slate-200 transition {editor?.isActive('italic') ? 'bg-slate-200' : ''}"
				title="Itálico"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 0h4M4 20h4" />
				</svg>
			</button>
			<div class="w-px h-6 bg-slate-300 mx-1 self-center"></div>
			<button
				type="button"
				onclick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
				class="p-2 rounded hover:bg-slate-200 transition {editor?.isActive('heading', { level: 2 }) ? 'bg-slate-200' : ''}"
				title="Título 2"
			>
				<span class="font-bold">H2</span>
			</button>
			<button
				type="button"
				onclick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
				class="p-2 rounded hover:bg-slate-200 transition {editor?.isActive('heading', { level: 3 }) ? 'bg-slate-200' : ''}"
				title="Título 3"
			>
				<span class="font-bold">H3</span>
			</button>
			<div class="w-px h-6 bg-slate-300 mx-1 self-center"></div>
			<button
				type="button"
				onclick={() => editor?.chain().focus().toggleBulletList().run()}
				class="p-2 rounded hover:bg-slate-200 transition {editor?.isActive('bulletList') ? 'bg-slate-200' : ''}"
				title="Lista com Marcadores"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
			<button
				type="button"
				onclick={() => editor?.chain().focus().toggleOrderedList().run()}
				class="p-2 rounded hover:bg-slate-200 transition {editor?.isActive('orderedList') ? 'bg-slate-200' : ''}"
				title="Lista Numerada"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h10M4 8l.01.01M4 12l.01.01M4 16l.01.01M7 16h10" />
				</svg>
			</button>
			<div class="w-px h-6 bg-slate-300 mx-1 self-center"></div>
			<button
				type="button"
				onclick={() => editor?.chain().focus().toggleBlockquote().run()}
				class="p-2 rounded hover:bg-slate-200 transition {editor?.isActive('blockquote') ? 'bg-slate-200' : ''}"
				title="Citação"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h10M4 8l.01.01M4 12l.01.01M4 16l.01.01M7 16h10" />
				</svg>
			</button>
			<button
				type="button"
				onclick={addImageToContent}
				class="p-2 rounded hover:bg-slate-200 transition"
				title="Inserir Imagem"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
			</button>
		</div>

		<div bind:this={editorElement} class="editor-container"></div>
	</div>

	<!-- Publishing -->
	<div class="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
		<h2 class="text-2xl font-bold text-slate-900 mb-6">Publicação</h2>

		<div class="space-y-4">
			<div class="flex items-center gap-4">
				<label for="status" class="block text-sm font-medium text-slate-700">
					Status
				</label>
				<select
					id="status"
					bind:value={status}
					class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
				>
					<option value="draft">Rascunho</option>
					<option value="published">Publicado</option>
				</select>
			</div>

			<label class="flex items-center gap-2 cursor-pointer group">
				<input type="checkbox" bind:checked={featured} class="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary transition" />
				<span class="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition">Artigo em Destaque</span>
			</label>
		</div>
	</div>

	<!-- Actions -->
	<div class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:p-6 flex justify-center gap-4 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
		<div class="max-w-7xl w-full flex justify-end gap-4">
			<a
				href="/admin/artigos"
				class="px-8 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium"
			>
				Cancelar
			</a>
			<button
				type="submit"
				disabled={isLoading}
				class="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm shadow-primary/20"
			>
				{isLoading ? 'Processando...' : 'Salvar Artigo'}
			</button>
		</div>
	</div>
</form>

<style>
	:global(.tiptap p.is-editor-empty:first-child::before) {
		content: attr(data-placeholder);
		float: left;
		color: #adb5bd;
		pointer-events: none;
		height: 0;
	}

	:global(.tiptap) {
		min-height: 400px;
		outline: none;
	}

	.editor-container {
		background: white;
	}
</style>
