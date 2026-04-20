<script lang="ts">
	import { goto } from '$app/navigation';
	import { CATEGORIES, uploadImage, getImageUrl, type ArticleTranslation } from '$lib/appwrite';
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';
	import Placeholder from '@tiptap/extension-placeholder';
    import { locales } from '$lib/paraglide/runtime';
    import { cn } from '$lib/utils';
    import { Languages, Copy, Trash2, Globe, FileText, CheckCircle2, Sparkles } from 'lucide-svelte';

	let { article = null, translations = [], isLoading = $bindable(false), onSave } = $props();

	// Master Metadata - Initialize with initial values from props
	let category = $state(article?.category || 'noticias');
	let tags = $state(article?.tags?.join(', ') || '');
	let status = $state(article?.status || 'draft');
	let featured = $state(article?.featured || false);
	let authorName = $state(article?.authorName || 'Danilo Albergaria');
	let featuredImageId = $state(article?.featuredImage || '');
	let featuredImageUrl = $derived(featuredImageId ? getImageUrl(featuredImageId) : '');

    // Translation Management
    let activeLang = $state('pt-br');
    
    // Initialize translations map
    type TranslationState = Omit<ArticleTranslation, '$id' | 'article_id'>;
    const initialTranslations: Record<string, TranslationState> = {};
    locales.forEach(lang => {
        const existing = translations.find((t: any) => t.language === lang);
        initialTranslations[lang] = {
            language: lang,
            title: existing?.title || '',
            slug: existing?.slug || '',
            excerpt: existing?.excerpt || '',
            content: existing?.content || '',
            metaTitle: existing?.metaTitle || '',
            metaDescription: existing?.metaDescription || ''
        };
    });

    let transState = $state<Record<string, TranslationState>>(initialTranslations);

    // Tiptap Editor
	let editorElement = $state<HTMLElement | null>(null);
	let editor = $state<Editor | null>(null);

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
				content: transState[activeLang].content,
				onUpdate: ({ editor }) => {
					transState[activeLang].content = editor.getHTML();
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

    // Handle language switch
    function handleLangSwitch(lang: string) {
        // Save current content to state before switching
        if (editor) {
            transState[activeLang].content = editor.getHTML();
        }
        activeLang = lang;
        // Update editor content
        if (editor) {
            editor.commands.setContent(transState[lang].content);
        }
    }

	function generateSlug(title: string) {
		return title
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-');
	}

	function handleTitleChange() {
		if (!transState[activeLang].slug) {
			transState[activeLang].slug = generateSlug(transState[activeLang].title);
		}
	}

    function copyFromBase() {
        const base = transState['pt-br'];
        transState[activeLang].title = base.title;
        transState[activeLang].slug = base.slug + '-en';
        transState[activeLang].excerpt = base.excerpt;
        transState[activeLang].content = base.content;
        if (editor) {
            editor.commands.setContent(base.content);
        }
    }
    
    async function translateWithDeepL() {
        if (activeLang === 'pt-br') return;
        
        const base = transState['pt-br'];
        if (!base.title) {
            alert('Por favor, preencha o título em Português antes de traduzir.');
            return;
        }

        isLoading = true;
        try {
            // Translate Title
            const titleRes = await fetch('/api/translate', {
                method: 'POST',
                body: JSON.stringify({ text: base.title, isHtml: false })
            });
            const titleData = await titleRes.json();
            if (titleData.error) throw new Error(titleData.error);
            if (titleData.translated) transState[activeLang].title = titleData.translated;

            // Translate Excerpt
            if (base.excerpt) {
                const excerptRes = await fetch('/api/translate', {
                    method: 'POST',
                    body: JSON.stringify({ text: base.excerpt, isHtml: false })
                });
                const excerptData = await excerptRes.json();
                if (excerptData.translated) transState[activeLang].excerpt = excerptData.translated;
            }

            // Translate Content (HTML)
            if (base.content) {
                const contentRes = await fetch('/api/translate', {
                    method: 'POST',
                    body: JSON.stringify({ text: base.content, isHtml: true })
                });
                const contentData = await contentRes.json();
                if (contentData.translated) {
                    transState[activeLang].content = contentData.translated;
                    if (editor) {
                        editor.commands.setContent(contentData.translated);
                    }
                }
            }

            // Auto-generate slug if title translated
            if (titleData.translated && !transState[activeLang].slug) {
                transState[activeLang].slug = generateSlug(titleData.translated);
            }
        } catch (err: any) {
            console.error('Translation error:', err);
            alert(err.message || 'Erro ao traduzir. Verifique a chave da API do DeepL em .env');
        } finally {
            isLoading = false;
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
        
        // Ensure current editor content is captured
        if (editor) {
            transState[activeLang].content = editor.getHTML();
        }

		const articleData = {
			category,
			tags: tags.split(',').map((t: string) => t.trim()),
			status,
			featured,
			authorName,
			featuredImage: featuredImageId,
			publishedAt: article?.publishedAt || new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

        // Filter out empty translations (at least title and content required)
        const finalTranslations = Object.values(transState).filter(t => t.title && t.content);

		try {
			await onSave(articleData, finalTranslations);
			await goto('/admin/artigos');
		} catch (err) {
			console.error('Save error:', err);
			alert('Erro ao salvar artigo. Por favor, tente novamente.');
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-8 pb-20">
    <!-- Lang Selector Tabs -->
    <div class="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit border border-slate-200">
        {#each locales as tag}
            <button
                type="button"
                onclick={() => handleLangSwitch(tag)}
                class={cn(
                    "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                    activeLang === tag 
                        ? "bg-white text-primary shadow-sm ring-1 ring-slate-200" 
                        : "text-slate-500 hover:text-slate-700"
                )}
            >
                {tag === 'pt-br' ? 'Português' : 'English'}
                {#if transState[tag].title}
                    <span class="ml-2 text-green-500">●</span>
                {/if}
            </button>
        {/each}
    </div>

	<!-- Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Editor Column -->
        <div class="lg:col-span-2 space-y-8">
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <FileText class="w-5 h-5 text-primary" />
                        Conteúdo ({activeLang})
                    </h2>
                    
                    {#if activeLang !== 'pt-br'}
                        <div class="flex items-center gap-2">
                            <button 
                                type="button"
                                onclick={translateWithDeepL}
                                disabled={isLoading}
                                class="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white bg-primary/5 hover:bg-primary border border-primary/20 rounded-lg transition-all disabled:opacity-50"
                            >
                                <Sparkles class="w-3 h-3" />
                                Traduzir com DeepL
                            </button>
                            <button 
                                type="button"
                                onclick={copyFromBase}
                                class="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary border border-slate-200 rounded-lg hover:border-primary/20 transition-all"
                            >
                                <Copy class="w-3 h-3" />
                                Copiar do Original
                            </button>
                        </div>
                    {/if}
                </div>

                <div class="space-y-6">
                    <div>
                        <label for="title" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            Título do Artigo
                        </label>
                        <input
                            id="title"
                            type="text"
                            bind:value={transState[activeLang].title}
                            oninput={handleTitleChange}
                            required={activeLang === 'pt-br'}
                            placeholder="Ex: A Vida em Exoplanetas"
                            class="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white outline-none transition-all font-serif text-lg font-bold"
                        />
                    </div>

                    <div>
                        <label for="slug" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            Link Permanente (Slug)
                        </label>
                        <div class="flex items-center gap-2 text-slate-400 font-mono text-xs bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                            <Globe class="w-3.5 h-3.5" />
                            <span>/{activeLang}/artigos/</span>
                            <input
                                id="slug"
                                type="text"
                                bind:value={transState[activeLang].slug}
                                placeholder="slug-do-artigo"
                                class="bg-transparent border-none outline-none text-slate-900 flex-1 min-w-0"
                            />
                        </div>
                    </div>

                    <div>
                        <label for="excerpt" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            Resumo / Lide
                        </label>
                        <textarea
                            id="excerpt"
                            bind:value={transState[activeLang].excerpt}
                            required={activeLang === 'pt-br'}
                            placeholder="Uma introdução envolvente para o artigo..."
                            rows="4"
                            class="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white outline-none transition-all font-serif italic text-slate-600"
                        ></textarea>
                    </div>

                    <!-- Tiptap Editor -->
                    <div>
                        <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                            Corpo do Artigo
                        </span>
                        <div class="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm ring-1 ring-slate-100">
                            <div class="bg-slate-50/50 border-b border-slate-200 p-2 flex flex-wrap gap-1">
                                <button
                                    type="button"
                                    onclick={() => editor?.chain().focus().toggleBold().run()}
                                    aria-label="Negrito"
                                    class={cn("p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all", editor?.isActive('bold') && "bg-white text-primary shadow-sm")}
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h8a4 4 0 100-8H6v8zm0 0h10a4 4 0 110 8H6v-8z" /></svg>
                                </button>
                                <button
                                    type="button"
                                    onclick={() => editor?.chain().focus().toggleItalic().run()}
                                    aria-label="Itálico"
                                    class={cn("p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all", editor?.isActive('italic') && "bg-white text-primary shadow-sm")}
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 0h4M4 20h4" /></svg>
                                </button>
                                <div class="w-px h-4 bg-slate-200 mx-1 self-center"></div>
                                <button
                                    type="button"
                                    onclick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                                    class={cn("p-2 rounded-lg text-xs font-bold hover:bg-white hover:shadow-sm transition-all", editor?.isActive('heading', { level: 2 }) && "bg-white text-primary shadow-sm")}
                                >
                                    H2
                                </button>
                                <button
                                    type="button"
                                    onclick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                                    class={cn("p-2 rounded-lg text-xs font-bold hover:bg-white hover:shadow-sm transition-all", editor?.isActive('heading', { level: 3 }) && "bg-white text-primary shadow-sm")}
                                >
                                    H3
                                </button>
                                <div class="w-px h-4 bg-slate-200 mx-1 self-center"></div>
                                <button
                                    type="button"
                                    onclick={addImageToContent}
                                    aria-label="Adicionar imagem"
                                    class="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </button>
                            </div>
                            <div bind:this={editorElement} class="editor-content"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sidebar Column -->
        <div class="space-y-8">
            <!-- Master Settings -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Globe class="w-4 h-4" />
                    Configurações Globais
                </h3>

                <div class="space-y-6">
                    <div>
                        <label for="category" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            Categoria
                        </label>
                        <select
                            id="category"
                            bind:value={category}
                            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white transition-all text-sm font-semibold"
                        >
                            {#each CATEGORIES as cat}
                                <option value={cat.slug}>{cat.name}</option>
                            {/each}
                        </select>
                    </div>

                    <div>
                        <label for="tags" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            Tags (vírgula)
                        </label>
                        <input
                            id="tags"
                            type="text"
                            bind:value={tags}
                            placeholder="exoplanetas, nasa, ciência"
                            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white transition-all text-sm"
                        />
                    </div>

                    <div>
                        <label for="featured-image" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                            Imagem de Destaque
                        </label>
                        
                        {#if featuredImageUrl}
                            <div class="relative aspect-video rounded-xl overflow-hidden border border-slate-200 mb-3 group">
                                <img src={featuredImageUrl} alt="Preview" class="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onclick={() => (featuredImageId = '')}
                                    class="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 class="w-3.5 h-3.5" />
                                </button>
                            </div>
                        {/if}

                        <input
                            id="featured-image"
                            type="file"
                            accept="image/*"
                            onchange={handleFeaturedImageUpload}
                            class="block w-full text-[10px] text-slate-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-[10px] file:font-black file:uppercase file:tracking-widest
                                file:bg-primary/10 file:text-primary
                                hover:file:bg-primary/20 transition-all cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            <!-- Publishing -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <CheckCircle2 class="w-4 h-4" />
                    Publicação
                </h3>

                <div class="space-y-4">
                    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span class="text-xs font-bold text-slate-600 uppercase tracking-widest">Status</span>
                        <select
                            bind:value={status}
                            class="bg-transparent text-xs font-black text-primary uppercase tracking-widest outline-none cursor-pointer"
                        >
                            <option value="draft">Rascunho</option>
                            <option value="published">Publicado</option>
                        </select>
                    </div>

                    <label class="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-slate-100">
                        <input 
                            type="checkbox" 
                            bind:checked={featured} 
                            class="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary transition-all" 
                        />
                        <span class="text-xs font-bold text-slate-600 uppercase tracking-widest group-hover:text-slate-900">Em Destaque</span>
                    </label>
                </div>
            </div>
        </div>
    </div>

	<!-- Bottom Action Bar -->
	<div class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-40">
		<div class="max-w-7xl mx-auto flex justify-between items-center px-4">
            <div class="flex items-center gap-4">
                {#each locales as tag}
                    <div class="flex items-center gap-1">
                        <div class={cn("w-2 h-2 rounded-full", transState[tag].title ? "bg-green-500" : "bg-slate-300")}></div>
                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">{tag}</span>
                    </div>
                {/each}
            </div>

            <div class="flex gap-4">
                <a
                    href="/admin/artigos"
                    class="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-all"
                >
                    Cancelar
                </a>
                <button
                    type="submit"
                    disabled={isLoading}
                    class="px-10 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                    {isLoading ? 'Salvando...' : 'Confirmar e Salvar'}
                </button>
            </div>
		</div>
	</div>
</form>

<style>
	:global(.tiptap p.is-editor-empty:first-child::before) {
		content: attr(data-placeholder);
		float: left;
		color: #cbd5e1;
		pointer-events: none;
		height: 0;
	}

	:global(.tiptap) {
		min-height: 400px;
		outline: none;
        font-family: serif;
        font-size: 1.125rem;
        line-height: 1.75;
	}

	.editor-content {
		background: white;
        padding: 2rem;
	}
</style>
