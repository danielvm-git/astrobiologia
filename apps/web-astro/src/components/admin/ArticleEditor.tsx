import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { ARTICLE_LOCALES, getArticleLocaleLabels } from "@/lib/article-locales";
import { Save, Loader2, Globe, Upload } from "lucide-react";

type Translation = {
  language: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
};

type ArticleMeta = {
  category: string;
  tags: string[];
  featuredImage: string;
  featuredImageAlt: string;
  status: "draft" | "published";
  featured: boolean;
  authorName: string;
  publishedAt: string;
};

const CATEGORIES = [
  "noticias",
  "entrevistas",
  "analises",
  "pesquisas-brasileiras",
  "exoplanetas",
  "extremofilos",
];

function emptyTranslation(language: string): Translation {
  return {
    language,
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
  };
}

function defaultMeta(): ArticleMeta {
  return {
    category: "noticias",
    tags: [],
    featuredImage: "",
    featuredImageAlt: "",
    status: "draft",
    featured: false,
    authorName: "Admin",
    publishedAt: new Date().toISOString().slice(0, 16),
  };
}

export default function ArticleEditor({ articleId }: { articleId?: string }) {
  const isNew = !articleId;
  const [activeLocale, setActiveLocale] = useState("pt-br");
  const [translations, setTranslations] = useState<Record<string, Translation>>(
    Object.fromEntries(ARTICLE_LOCALES.map((l) => [l, emptyTranslation(l)]))
  );
  const [meta, setMeta] = useState<ArticleMeta>(defaultMeta());
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">(
    "idle"
  );
  const [loadError, setLoadError] = useState("");
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Escreva o conteúdo do artigo aqui…",
      }),
    ],
    content: translations[activeLocale]?.content ?? "",
    onUpdate({ editor: ed }) {
      setTranslations((prev) => ({
        ...prev,
        [activeLocale]: { ...prev[activeLocale], content: ed.getHTML() },
      }));
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(translations[activeLocale]?.content ?? "");
    }
  }, [activeLocale]);

  useEffect(() => {
    if (!articleId) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/articles/${articleId}`);
        const data = await res.json();
        if (!res.ok) {
          setLoadError(data.error || "Erro ao carregar artigo");
          return;
        }

        const { article, translations: rawTrans } = data;
        setMeta({
          category: article.category ?? "noticias",
          tags: article.tags ?? [],
          featuredImage: article.featuredImage ?? "",
          featuredImageAlt: article.featuredImageAlt ?? "",
          status: article.status ?? "draft",
          featured: article.featured ?? false,
          authorName: article.authorName ?? "Admin",
          publishedAt: (article.publishedAt ?? new Date().toISOString()).slice(
            0,
            16
          ),
        });

        const merged = Object.fromEntries(
          ARTICLE_LOCALES.map((l) => [l, emptyTranslation(l)])
        );
        for (const t of rawTrans ?? []) {
          merged[t.language] = {
            language: t.language,
            title: t.title ?? "",
            slug: t.slug ?? "",
            excerpt: t.excerpt ?? "",
            content: t.content ?? "",
            metaTitle: t.metaTitle ?? "",
            metaDescription: t.metaDescription ?? "",
          };
        }
        setTranslations(merged);
        if (editor && !editor.isDestroyed) {
          editor.commands.setContent(merged["pt-br"]?.content ?? "");
        }
      } catch {
        setLoadError("Falha de conexão.");
      }
    })();
  }, [articleId]);

  function updateTransField(field: keyof Translation, value: string) {
    setTranslations((prev) => ({
      ...prev,
      [activeLocale]: { ...prev[activeLocale], [field]: value },
    }));
  }

  async function autoSlug() {
    const title = translations[activeLocale]?.title ?? "";
    let slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    if (!slug && title.trim()) {
      // Fallback for CJK or other non-latin titles
      const ptSlug = translations["pt-br"]?.slug;
      slug =
        ptSlug && activeLocale !== "pt-br"
          ? `${ptSlug}-${activeLocale}`
          : `artigo-${activeLocale}-${Date.now().toString(36)}`;
    }
    updateTransField("slug", slug);
  }

  async function translateToLocale(targetLocale: string) {
    // Ensure we have the latest content from the editor if translating from pt-br
    let source = translations["pt-br"];
    if (activeLocale === "pt-br" && editor) {
      source = { ...source, content: editor.getHTML() };
    }

    if (!source.title && !source.content) {
      alert("Preencha o conteúdo em Português antes de traduzir.");
      return;
    }
    setTranslating(true);
    try {
      async function tr(text: string, isHtml = false) {
        if (!text.trim()) return "";
        const res = await fetch("/api/admin/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, targetLang: targetLocale, isHtml }),
        });
        const data = await res.json();
        return data.translated ?? text;
      }
      const [title, excerpt, content, metaTitle, metaDescription] =
        await Promise.all([
          tr(source.title),
          tr(source.excerpt),
          tr(source.content, true),
          tr(source.metaTitle || source.title),
          tr(source.metaDescription || source.excerpt),
        ]);
      setTranslations((prev) => ({
        ...prev,
        [targetLocale]: {
          language: targetLocale,
          title,
          slug:
            translations[targetLocale]?.slug ||
            (translations["pt-br"]?.slug
              ? `${translations["pt-br"].slug}-${targetLocale}`
              : ""),
          excerpt,
          content,
          metaTitle,
          metaDescription,
        },
      }));
    } catch {
      alert("Erro ao traduzir. Verifique a configuração do DeepL.");
    } finally {
      setTranslating(false);
    }
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.fileId) {
        setMeta((prev) => ({ ...prev, featuredImage: data.fileId }));
      }
    } catch {
      alert("Erro ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  }

  const [validationError, setValidationError] = useState("");

  async function save() {
    if (!translations["pt-br"]?.title?.trim()) {
      setValidationError("O título é obrigatório.");
      setTimeout(() => setValidationError(""), 4000);
      return;
    }
    setValidationError("");
    setSaving(true);
    setSaveStatus("idle");
    try {
      const body = {
        ...meta,
        publishedAt: new Date(meta.publishedAt).toISOString(),
        translations: Object.values(translations),
      };
      const url = isNew
        ? "/api/admin/articles"
        : `/api/admin/articles/${articleId}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaveStatus("saved");
      if (isNew && data.id) {
        const redirectId = data.id;
        setTimeout(() => {
          window.location.href = `/admin/artigos/${redirectId}/edit`;
        }, 2000);
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl text-center">
        <p className="font-bold">{loadError}</p>
      </div>
    );
  }

  const localeLabels = getArticleLocaleLabels("pt-br");
  const currentTrans = translations[activeLocale];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
            {isNew ? "Novo Artigo" : "Editar Artigo"}
          </h1>
          <a
            href="/admin/artigos"
            className="text-sm text-slate-400 hover:text-slate-700 font-bold"
          >
            ← Voltar para Artigos
          </a>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={save}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-700 transition disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving
            ? "Salvando..."
            : saveStatus === "saved"
              ? "Salvo!"
              : saveStatus === "error"
                ? "Erro"
                : "Confirmar e Salvar"}
        </button>
      </div>

      {validationError && (
        <div
          data-testid="title-error"
          className="fixed bottom-4 left-4 bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg z-50"
        >
          {validationError}
        </div>
      )}
      {saveStatus === "saved" && (
        <div
          data-testid="toast-success"
          className="toast-success fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg z-50"
        >
          Artigo salvo com sucesso!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2 flex-wrap items-center">
            {ARTICLE_LOCALES.map((locale) => (
              <button
                key={locale}
                type="button"
                onClick={() => setActiveLocale(locale)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition ${
                  activeLocale === locale
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-900"
                }`}
              >
                {locale.toUpperCase()}
                {translations[locale]?.title ? " ✓" : ""}
              </button>
            ))}
            {activeLocale !== "pt-br" && (
              <button
                type="button"
                disabled={translating}
                onClick={() => translateToLocale(activeLocale)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-black uppercase tracking-widest text-slate-600 hover:border-slate-900 hover:text-slate-900 transition disabled:opacity-40"
              >
                <Globe className="w-3.5 h-3.5" />
                {translating ? "Traduzindo..." : "Traduzir com DeepL"}
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Título
              </label>
              <input
                id="article-title"
                data-testid="article-title"
                type="text"
                value={currentTrans.title}
                onChange={(e) => updateTransField("title", e.target.value)}
                onBlur={() => {
                  if (!currentTrans.slug) autoSlug();
                }}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Título do artigo"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                  Slug
                </label>
                <div className="flex gap-2">
                  <input
                    id="article-slug"
                    data-testid="article-slug"
                    type="text"
                    value={currentTrans.slug}
                    onChange={(e) => updateTransField("slug", e.target.value)}
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="url-do-artigo"
                  />
                  <button
                    type="button"
                    onClick={autoSlug}
                    className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition"
                  >
                    Auto
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Resumo
              </label>
              <textarea
                rows={3}
                value={currentTrans.excerpt}
                onChange={(e) => updateTransField("excerpt", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                placeholder="Breve resumo do artigo"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Conteúdo
              </label>
              <div
                data-testid="article-editor"
                className="editor-content border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-slate-900"
              >
                <div className="border-b border-slate-100 px-3 py-2 flex gap-2 flex-wrap bg-slate-50">
                  {[
                    {
                      label: "B",
                      cmd: () => editor?.chain().focus().toggleBold().run(),
                      active: editor?.isActive("bold"),
                    },
                    {
                      label: "I",
                      cmd: () => editor?.chain().focus().toggleItalic().run(),
                      active: editor?.isActive("italic"),
                    },
                    {
                      label: "H2",
                      cmd: () =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({ level: 2 })
                          .run(),
                      active: editor?.isActive("heading", { level: 2 }),
                    },
                    {
                      label: "H3",
                      cmd: () =>
                        editor
                          ?.chain()
                          .focus()
                          .toggleHeading({ level: 3 })
                          .run(),
                      active: editor?.isActive("heading", { level: 3 }),
                    },
                    {
                      label: "UL",
                      cmd: () =>
                        editor?.chain().focus().toggleBulletList().run(),
                      active: editor?.isActive("bulletList"),
                    },
                    {
                      label: "OL",
                      cmd: () =>
                        editor?.chain().focus().toggleOrderedList().run(),
                      active: editor?.isActive("orderedList"),
                    },
                    {
                      label: "—",
                      cmd: () =>
                        editor?.chain().focus().setHorizontalRule().run(),
                      active: false,
                    },
                  ].map(({ label, cmd, active }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={cmd}
                      className={`px-2 py-1 text-xs font-bold rounded transition ${
                        active
                          ? "bg-slate-900 text-white"
                          : "hover:bg-slate-200 text-slate-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <EditorContent
                  editor={editor}
                  className="prose prose-slate max-w-none p-4 min-h-[300px] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">
              Configurações
            </h2>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Status
              </label>
              <select
                data-testid="status-select"
                value={meta.status}
                onChange={(e) =>
                  setMeta((prev) => ({
                    ...prev,
                    status: e.target.value as "draft" | "published",
                  }))
                }
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Categoria
              </label>
              <select
                id="category"
                data-testid="category-select"
                value={meta.category}
                onChange={(e) =>
                  setMeta((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Autor
              </label>
              <input
                type="text"
                value={meta.authorName}
                onChange={(e) =>
                  setMeta((prev) => ({ ...prev, authorName: e.target.value }))
                }
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Data de Publicação
              </label>
              <input
                type="datetime-local"
                value={meta.publishedAt}
                onChange={(e) =>
                  setMeta((prev) => ({ ...prev, publishedAt: e.target.value }))
                }
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={meta.featured}
                onChange={(e) =>
                  setMeta((prev) => ({ ...prev, featured: e.target.checked }))
                }
                className="w-4 h-4 rounded"
              />
              <label
                htmlFor="featured"
                className="text-sm font-bold text-slate-700"
              >
                Artigo em destaque
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">
              Imagem de Capa
            </h2>
            {meta.featuredImage && (
              <img
                src={`${import.meta.env.PUBLIC_APPWRITE_ENDPOINT ?? "https://nyc.cloud.appwrite.io/v1"}/storage/buckets/${import.meta.env.PUBLIC_STORAGE_BUCKET_ID ?? "images"}/files/${meta.featuredImage}/preview?width=400&height=250&project=${import.meta.env.PUBLIC_APPWRITE_PROJECT_ID ?? "69e462f20036d39192ba"}`}
                alt=""
                className="w-full rounded-xl object-cover aspect-video"
              />
            )}
            <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-slate-900 transition text-sm text-slate-500 font-bold">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />{" "}
                  {meta.featuredImage ? "Trocar imagem" : "Enviar imagem"}
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f);
                }}
              />
            </label>
            {meta.featuredImage && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                  Alt text
                </label>
                <input
                  type="text"
                  value={meta.featuredImageAlt}
                  onChange={(e) =>
                    setMeta((prev) => ({
                      ...prev,
                      featuredImageAlt: e.target.value,
                    }))
                  }
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  placeholder="Descrição da imagem"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
