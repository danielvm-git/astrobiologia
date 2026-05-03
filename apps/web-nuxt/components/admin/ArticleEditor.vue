<script setup lang="ts">
import { Editor } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import {
  CheckCircle2,
  Copy,
  FileText,
  Globe,
  Sparkles,
  Trash2,
} from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { ARTICLE_CATEGORIES } from "@/lib/article-categories";
import {
  ARTICLE_LOCALES,
  getArticleLocaleLabels,
  ARTICLE_LOCALE_LABELS,
} from "@/lib/article-locales";

type TranslationState = {
  language: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
};

const props = defineProps<{
  article: Record<string, unknown> | null;
  translations: Array<Record<string, unknown>>;
  saving?: boolean;
}>();

const { locale } = useI18n();
const localeLabels = computed(() => getArticleLocaleLabels(locale.value));

const emit = defineEmits<{
  (
    e: "save",
    articleData: Record<string, unknown>,
    translations: TranslationState[]
  ): void;
}>();

function buildTranslationMap(
  src: Array<Record<string, unknown>>
): Record<string, TranslationState> {
  const state: Record<string, TranslationState> = {};
  for (const lang of ARTICLE_LOCALES) {
    const existing = src.find((t) => t.language === lang);
    state[lang] = {
      language: lang,
      title: String(existing?.title ?? ""),
      slug: String(existing?.slug ?? ""),
      excerpt: String(existing?.excerpt ?? ""),
      content: String(existing?.content ?? ""),
      metaTitle: String(existing?.metaTitle ?? ""),
      metaDescription: String(existing?.metaDescription ?? ""),
    };
  }
  return state;
}

const category = ref(String(props.article?.category ?? "noticias"));
const tags = ref(
  Array.isArray(props.article?.tags)
    ? (props.article?.tags as string[]).join(", ")
    : ""
);
const status = ref(String(props.article?.status ?? "draft"));
const featured = ref(Boolean(props.article?.featured ?? false));
const authorName = ref(
  String(props.article?.authorName ?? "Danilo Albergaria")
);
const featuredImageId = ref(String(props.article?.featuredImage ?? ""));
const activeLang = ref<string>("pt-br");
const transState = ref<Record<string, TranslationState>>(
  buildTranslationMap(props.translations)
);
const isBusy = ref(false);
const editorMountEl = ref<HTMLElement | null>(null);
const tiptapEditor = shallowRef<Editor | null>(null);

const previewUrl = useStoragePreviewUrl(featuredImageId, 800, 600);

watch(
  () => props.translations,
  (next) => {
    transState.value = buildTranslationMap(next ?? []);
  },
  { deep: true }
);

watch(
  () => props.article,
  (next) => {
    if (!next) return;
    category.value = String(next.category ?? "noticias");
    tags.value = Array.isArray(next.tags)
      ? (next.tags as string[]).join(", ")
      : "";
    status.value = String(next.status ?? "draft");
    featured.value = Boolean(next.featured ?? false);
    authorName.value = String(next.authorName ?? "Danilo Albergaria");
    featuredImageId.value = String(next.featuredImage ?? "");
  },
  { deep: true }
);

function destroyEditor() {
  if (tiptapEditor.value) {
    tiptapEditor.value.destroy();
    tiptapEditor.value = null;
  }
}

function mountEditor() {
  destroyEditor();
  const el = editorMountEl.value;
  if (!el) return;

  const lang = activeLang.value;
  tiptapEditor.value = new Editor({
    element: el,
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full h-auto my-6" },
      }),
      Placeholder.configure({
        placeholder: "Escreva seu artigo aqui...",
      }),
    ],
    content: transState.value[lang].content,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none focus:outline-none min-h-[400px] px-4 py-2",
      },
    },
    onUpdate: ({ editor: ed }) => {
      transState.value[activeLang.value].content = ed.getHTML();
    },
  });
}

onMounted(() => {
  nextTick(() => mountEditor());
});

onBeforeUnmount(() => {
  destroyEditor();
});

watch(activeLang, (lang, prev) => {
  if (tiptapEditor.value && prev !== undefined) {
    transState.value[prev].content = tiptapEditor.value.getHTML();
  }
  nextTick(() => {
    destroyEditor();
    mountEditor();
    if (tiptapEditor.value) {
      tiptapEditor.value.commands.setContent(transState.value[lang].content);
    }
  });
});

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function handleTitleChange() {
  const lang = activeLang.value;
  if (!transState.value[lang].slug) {
    transState.value[lang].slug = generateSlug(transState.value[lang].title);
  }
}

function copyPortugueseTo(lang: string) {
  const base = transState.value["pt-br"];
  if (!base.title) return false;
  const t = transState.value[lang];
  t.title = base.title;
  t.slug = base.slug
    ? `${base.slug}-${lang}`
    : `${generateSlug(base.title)}-${lang}`;
  t.excerpt = base.excerpt;
  t.content = base.content;
  t.metaTitle = base.metaTitle ?? "";
  t.metaDescription = base.metaDescription ?? "";
  if (tiptapEditor.value && activeLang.value === lang) {
    tiptapEditor.value.commands.setContent(base.content);
  }
  return true;
}

function copyEnglishTo(lang: string) {
  if (lang === "en") return false;
  const src = transState.value["en"];
  if (!src.title) return false;
  const t = transState.value[lang];
  t.title = src.title;
  t.slug = src.slug
    ? `${src.slug}-${lang}`
    : `${generateSlug(src.title)}-${lang}`;
  t.excerpt = src.excerpt;
  t.content = src.content;
  t.metaTitle = src.metaTitle ?? "";
  t.metaDescription = src.metaDescription ?? "";
  if (tiptapEditor.value && activeLang.value === lang) {
    tiptapEditor.value.commands.setContent(src.content);
  }
  return true;
}

function applyTranslationFallback(lang: string): boolean {
  if (lang !== "en" && copyEnglishTo(lang)) return true;
  return copyPortugueseTo(lang);
}

async function translateLine(
  text: string,
  targetLang: string,
  isHtml: boolean
): Promise<string | null> {
  try {
    const res = await $fetch<{ translated: string }>("/api/translate", {
      method: "POST",
      body: { text, targetLang, isHtml },
    });
    return res.translated || null;
  } catch {
    return null;
  }
}

async function translateWithDeepL() {
  const lang = activeLang.value;
  if (lang === "pt-br") return;
  const base = transState.value["pt-br"];
  if (!base.title) {
    alert("Por favor, preencha o título em Português antes de traduzir.");
    return;
  }

  isBusy.value = true;
  try {
    const titleTr = await translateLine(base.title, lang, false);
    if (!titleTr) {
      if (applyTranslationFallback(lang)) {
        alert(
          "DeepL indisponível ou erro na API. Conteúdo copiado do inglês ou do português."
        );
      } else {
        alert(
          "Erro ao traduzir o título. Verifique DEEPL_API_KEY ou preencha manualmente."
        );
      }
      return;
    }
    transState.value[lang].title = titleTr;

    if (base.excerpt) {
      const ex = await translateLine(base.excerpt, lang, false);
      if (ex) transState.value[lang].excerpt = ex;
      else if (lang !== "en" && transState.value["en"].excerpt) {
        transState.value[lang].excerpt = transState.value["en"].excerpt;
      } else {
        transState.value[lang].excerpt = base.excerpt;
      }
    }

    if (base.content) {
      const html = await translateLine(base.content, lang, true);
      if (html) {
        transState.value[lang].content = html;
        tiptapEditor.value?.commands.setContent(html);
      } else if (lang !== "en" && transState.value["en"].content) {
        transState.value[lang].content = transState.value["en"].content;
        tiptapEditor.value?.commands.setContent(transState.value["en"].content);
      } else {
        transState.value[lang].content = base.content;
        tiptapEditor.value?.commands.setContent(base.content);
      }
    }

    if (!transState.value[lang].slug) {
      transState.value[lang].slug = generateSlug(transState.value[lang].title);
    }
  } catch {
    if (applyTranslationFallback(lang)) {
      alert("Erro na API; conteúdo copiado do inglês ou do português.");
    } else {
      alert("Erro ao traduzir. Verifique a chave da API do DeepL em .env");
    }
  } finally {
    isBusy.value = false;
  }
}

async function translateAllWithDeepL() {
  // Flush the active editor so base.content is always current before translating
  if (tiptapEditor.value) {
    transState.value[activeLang.value].content = tiptapEditor.value.getHTML();
  }
  const base = transState.value["pt-br"];
  if (!base.title) {
    alert("Por favor, preencha o título em Português antes de traduzir.");
    return;
  }
  const otherLocales = ARTICLE_LOCALES.filter((l) => l !== "pt-br");
  if (
    !confirm(
      `Isso irá traduzir o artigo para ${otherLocales.length} idiomas. Deseja continuar?`
    )
  ) {
    return;
  }

  const editorLang = activeLang.value;
  isBusy.value = true;
  try {
    for (const lang of otherLocales) {
      const titleTr = await translateLine(base.title, lang, false);
      if (!titleTr) {
        applyTranslationFallback(lang);
        continue;
      }
      transState.value[lang].title = titleTr;

      if (base.excerpt) {
        const ex = await translateLine(base.excerpt, lang, false);
        if (ex) transState.value[lang].excerpt = ex;
        else if (lang !== "en" && transState.value["en"].excerpt) {
          transState.value[lang].excerpt = transState.value["en"].excerpt;
        } else {
          transState.value[lang].excerpt = base.excerpt;
        }
      }

      if (base.content) {
        const html = await translateLine(base.content, lang, true);
        if (html) transState.value[lang].content = html;
        else if (lang !== "en" && transState.value["en"].content) {
          transState.value[lang].content = transState.value["en"].content;
        } else {
          transState.value[lang].content = base.content;
        }
      }

      if (!transState.value[lang].slug) {
        const generated = generateSlug(transState.value[lang].title);
        if (generated) {
          transState.value[lang].slug = generated;
        } else {
          // CJK and other non-Latin scripts produce empty slugs — fall back to
          // the PT slug with the language code appended so Appwrite gets a
          // valid non-empty value (e.g. "radar-em-drone-ja").
          const ptSlug = base.slug || generateSlug(base.title);
          transState.value[lang].slug = ptSlug ? `${ptSlug}-${lang}` : lang;
        }
      }
    }

    if (tiptapEditor.value) {
      tiptapEditor.value.commands.setContent(
        transState.value[editorLang].content
      );
    }
  } catch {
    alert(
      "Erro durante a tradução em lote. Algumas traduções podem estar incompletas."
    );
  } finally {
    isBusy.value = false;
  }
}

async function uploadImageRequest(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const data = (await res.json()) as { fileId?: string; error?: string };
  if (!res.ok) {
    throw new Error(data.error || "Upload failed");
  }
  if (!data.fileId) throw new Error("Upload failed");
  return data.fileId;
}

async function handleFeaturedImageUpload(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  isBusy.value = true;
  try {
    featuredImageId.value = await uploadImageRequest(file);
  } catch {
    alert("Erro ao enviar imagem. Tente novamente.");
  } finally {
    isBusy.value = false;
    target.value = "";
  }
}

async function addImageToContent() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    isBusy.value = true;
    try {
      const fileId = await uploadImageRequest(file);
      const config = useRuntimeConfig();
      const endpoint = config.public.appwriteEndpoint.replace(/\/$/, "");
      const url = `${endpoint}/storage/buckets/${config.public.storageBucketId}/files/${fileId}/preview?project=${config.public.appwriteProjectId}&width=800&height=600`;
      tiptapEditor.value?.chain().focus().setImage({ src: url }).run();
    } catch {
      alert("Erro ao enviar imagem para o conteúdo.");
    } finally {
      isBusy.value = false;
    }
  };
  input.click();
}

const localePath = useLocalePath();

function handleSubmit() {
  if (tiptapEditor.value) {
    transState.value[activeLang.value].content = tiptapEditor.value.getHTML();
  }

  const articleData: Record<string, unknown> = {
    category: category.value,
    tags: tags.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    status: status.value,
    featured: featured.value,
    authorName: authorName.value,
    featuredImage: featuredImageId.value,
    publishedAt:
      (props.article?.publishedAt as string) || new Date().toISOString(),
  };

  const finalTranslations = Object.values(transState.value).filter(
    (t) => t.title && t.content
  );

  emit("save", articleData, finalTranslations);
}

const isSavingFlag = computed(() => props.saving ?? false);
const disableActions = computed(() => isBusy.value || isSavingFlag.value);
</script>

<template>
  <form class="space-y-8 pb-20" @submit.prevent="handleSubmit">
    <div
      class="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit flex-wrap border border-slate-200"
    >
      <button
        v-for="tag in ARTICLE_LOCALES"
        :key="tag"
        type="button"
        :class="
          cn(
            'px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all',
            activeLang === tag
              ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200'
              : 'text-slate-500 hover:text-slate-700'
          )
        "
        @click="activeLang = tag"
      >
        {{ ARTICLE_LOCALE_LABELS[tag] || tag.toUpperCase() }}
        <span v-if="transState[tag]?.title" class="ml-2 text-green-500">●</span>
      </button>
      <div class="w-px h-6 bg-slate-200 mx-2 hidden sm:block"></div>
      <button
        type="button"
        :disabled="disableActions"
        class="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-lg transition-all disabled:opacity-50"
        title="Traduzir para todos os idiomas"
        @click="translateAllWithDeepL"
      >
        <Sparkles class="w-3 h-3" />
        Traduzir Todos
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div class="flex items-center justify-between mb-8 flex-wrap gap-2">
            <h2
              class="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2"
            >
              <FileText class="w-5 h-5 text-primary" />
              Conteúdo ({{ activeLang }})
            </h2>

            <div
              v-if="activeLang !== 'pt-br'"
              class="flex items-center gap-2 flex-wrap"
            >
              <button
                type="button"
                :disabled="disableActions"
                class="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white bg-primary/5 hover:bg-primary border border-primary/20 rounded-lg transition-all disabled:opacity-50"
                @click="translateWithDeepL"
              >
                <Sparkles class="w-3 h-3" />
                Traduzir com DeepL
              </button>
              <button
                type="button"
                class="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary border border-slate-200 rounded-lg hover:border-primary/20 transition-all"
                @click="copyPortugueseTo(activeLang)"
              >
                <Copy class="w-3 h-3" />
                Copiar do Original
              </button>
              <button
                v-if="transState['en']?.title"
                type="button"
                class="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary border border-slate-200 rounded-lg hover:border-primary/20 transition-all"
                @click="copyEnglishTo(activeLang)"
              >
                <Copy class="w-3 h-3" />
                Copiar do Inglês
              </button>
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <label
                for="article-title"
                class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2"
              >
                Título do Artigo
              </label>
              <input
                id="article-title"
                v-model="transState[activeLang].title"
                type="text"
                :required="activeLang === 'pt-br'"
                placeholder="Ex: A Vida em Exoplanetas"
                class="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white outline-none transition-all font-serif text-lg font-bold"
                @input="handleTitleChange"
              />
            </div>

            <div>
              <label
                for="article-slug"
                class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2"
              >
                Link Permanente (Slug)
              </label>
              <div
                class="flex items-center gap-2 text-slate-400 font-mono text-xs bg-slate-50 px-4 py-2 rounded-lg border border-slate-200"
              >
                <Globe class="w-3.5 h-3.5 shrink-0" />
                <span>/{{ activeLang }}/artigos/</span>
                <input
                  id="article-slug"
                  v-model="transState[activeLang].slug"
                  type="text"
                  placeholder="slug-do-artigo"
                  class="bg-transparent border-none outline-none text-slate-900 flex-1 min-w-0"
                />
              </div>
            </div>

            <div>
              <label
                for="article-excerpt"
                class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2"
              >
                Resumo / Lide
              </label>
              <textarea
                id="article-excerpt"
                v-model="transState[activeLang].excerpt"
                :required="activeLang === 'pt-br'"
                placeholder="Uma introdução envolvente para o artigo..."
                rows="4"
                class="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white outline-none transition-all font-serif italic text-slate-600"
              ></textarea>
            </div>

            <div>
              <span
                class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4"
              >
                Corpo do Artigo
              </span>
              <div
                class="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm ring-1 ring-slate-100"
              >
                <div
                  class="bg-slate-50/50 border-b border-slate-200 p-2 flex flex-wrap gap-1"
                >
                  <button
                    type="button"
                    class="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                    aria-label="Negrito"
                    @click="tiptapEditor?.chain().focus().toggleBold().run()"
                  >
                    <span class="text-xs font-bold">B</span>
                  </button>
                  <button
                    type="button"
                    class="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                    aria-label="Itálico"
                    @click="tiptapEditor?.chain().focus().toggleItalic().run()"
                  >
                    <span class="text-xs italic">I</span>
                  </button>
                  <div class="w-px h-4 bg-slate-200 mx-1 self-center"></div>
                  <button
                    type="button"
                    class="p-2 rounded-lg text-xs font-bold hover:bg-white hover:shadow-sm transition-all"
                    @click="
                      tiptapEditor
                        ?.chain()
                        .focus()
                        .toggleHeading({ level: 2 })
                        .run()
                    "
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    class="p-2 rounded-lg text-xs font-bold hover:bg-white hover:shadow-sm transition-all"
                    @click="
                      tiptapEditor
                        ?.chain()
                        .focus()
                        .toggleHeading({ level: 3 })
                        .run()
                    "
                  >
                    H3
                  </button>
                  <div class="w-px h-4 bg-slate-200 mx-1 self-center"></div>
                  <button
                    type="button"
                    class="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                    aria-label="Adicionar imagem"
                    @click="addImageToContent"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
                <div ref="editorMountEl" class="editor-content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-8">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3
            class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"
          >
            <Globe class="w-4 h-4" />
            Configurações Globais
          </h3>

          <div class="space-y-6">
            <div>
              <label
                for="category"
                class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2"
              >
                Categoria
              </label>
              <select
                id="category"
                v-model="category"
                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white transition-all text-sm font-semibold"
              >
                <option
                  v-for="cat in ARTICLE_CATEGORIES"
                  :key="cat.$id"
                  :value="cat.slug"
                >
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div>
              <label
                for="tags"
                class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2"
              >
                Tags (vírgula)
              </label>
              <input
                id="tags"
                v-model="tags"
                type="text"
                placeholder="exoplanetas, nasa, ciência"
                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white transition-all text-sm"
              />
            </div>

            <div>
              <label
                for="featured-image"
                class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3"
              >
                Imagem de Destaque
              </label>

              <div
                v-if="previewUrl"
                class="relative aspect-video rounded-xl overflow-hidden border border-slate-200 mb-3 group"
              >
                <img
                  :src="previewUrl"
                  alt=""
                  class="w-full h-full object-cover"
                />
                <button
                  type="button"
                  class="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  @click="featuredImageId = ''"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                id="featured-image"
                type="file"
                accept="image/*"
                class="block w-full text-[10px] text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                @change="handleFeaturedImageUpload"
              />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3
            class="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"
          >
            <CheckCircle2 class="w-4 h-4" />
            Publicação
          </h3>

          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
            >
              <span
                class="text-xs font-bold text-slate-600 uppercase tracking-widest"
                >Status</span
              >
              <select
                v-model="status"
                class="bg-transparent text-xs font-black text-primary uppercase tracking-widest outline-none cursor-pointer"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>

            <label
              class="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-slate-100"
            >
              <input
                v-model="featured"
                type="checkbox"
                class="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary transition-all"
              />
              <span
                class="text-xs font-bold text-slate-600 uppercase tracking-widest group-hover:text-slate-900"
                >Em Destaque</span
              >
            </label>
          </div>
        </div>
      </div>
    </div>

    <div
      class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-40"
    >
      <div
        class="max-w-7xl mx-auto flex justify-between items-center px-4 flex-wrap gap-4"
      >
        <div class="flex items-center gap-4 flex-wrap">
          <div
            v-for="tag in ARTICLE_LOCALES"
            :key="tag"
            class="flex items-center gap-1"
          >
            <div
              :class="
                cn(
                  'w-2 h-2 rounded-full',
                  transState[tag]?.title ? 'bg-green-500' : 'bg-slate-300'
                )
              "
            ></div>
            <span
              class="text-[10px] font-black uppercase tracking-widest text-slate-400"
              >{{ localeLabels[tag] || tag }}</span
            >
          </div>
        </div>

        <div class="flex gap-4">
          <NuxtLink
            :to="localePath('/admin/artigos')"
            class="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-all"
          >
            Cancelar
          </NuxtLink>
          <button
            type="submit"
            :disabled="disableActions"
            class="px-10 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {{ isSavingFlag || isBusy ? "Salvando..." : "Confirmar e Salvar" }}
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
:deep(.tiptap p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #cbd5e1;
  pointer-events: none;
  height: 0;
}

:deep(.tiptap) {
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
