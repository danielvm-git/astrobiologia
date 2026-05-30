import { useState, useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { ARTICLE_LOCALES, getArticleLocaleLabels } from "@/lib/article-locales";
import { deriveArticleSlug } from "@/lib/article-editor-slug";
import { buildTranslatedLocaleFields } from "@/lib/article-editor-translate";
import {
  defaultArticleMeta,
  emptyTranslationsByLocale,
  type ArticleMeta,
  type ArticleTranslation,
} from "@/lib/article-editor-types";
import {
  getPortugueseTitleValidationError,
  MASTER_ARTICLE_LOCALE,
} from "@/lib/article-editor-validation";
import { Save, Loader2 } from "lucide-react";
import ArticleEditorFields from "./ArticleEditorFields";
import ArticleEditorSidebar from "./ArticleEditorSidebar";

export default function ArticleEditor({ articleId }: { articleId?: string }) {
  const isNew = !articleId;
  const [activeLocale, setActiveLocale] = useState(MASTER_ARTICLE_LOCALE);
  const [translations, setTranslations] = useState(emptyTranslationsByLocale);
  const [meta, setMeta] = useState<ArticleMeta>(defaultArticleMeta());
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">(
    "idle"
  );
  const [loadError, setLoadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [validationError, setValidationError] = useState("");

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

        const merged = emptyTranslationsByLocale();
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
          editor.commands.setContent(
            merged[MASTER_ARTICLE_LOCALE]?.content ?? ""
          );
        }
      } catch {
        setLoadError("Falha de conexão.");
      }
    })();
  }, [articleId, editor]);

  function updateTransField(field: keyof ArticleTranslation, value: string) {
    setTranslations((prev) => ({
      ...prev,
      [activeLocale]: { ...prev[activeLocale], [field]: value },
    }));
  }

  function autoSlug() {
    const title = translations[activeLocale]?.title ?? "";
    const slug = deriveArticleSlug({
      activeLocale,
      title,
      ptBrSlug: translations[MASTER_ARTICLE_LOCALE]?.slug ?? "",
    });
    updateTransField("slug", slug);
  }

  async function translateToLocale(targetLocale: string) {
    let source = translations[MASTER_ARTICLE_LOCALE];
    if (activeLocale === MASTER_ARTICLE_LOCALE && editor) {
      source = { ...source, content: editor.getHTML() };
    }

    if (!source.title && !source.content) {
      alert("Preencha o conteúdo em Português antes de traduzir.");
      return;
    }
    setTranslating(true);
    try {
      const translated = await buildTranslatedLocaleFields(
        source,
        targetLocale,
        {
          existingSlug: translations[targetLocale]?.slug ?? "",
          ptBrSlug: translations[MASTER_ARTICLE_LOCALE]?.slug ?? "",
        }
      );
      setTranslations((prev) => ({
        ...prev,
        [targetLocale]: translated,
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

  function showTitleValidationError(message: string) {
    if (activeLocale !== MASTER_ARTICLE_LOCALE) {
      setActiveLocale(MASTER_ARTICLE_LOCALE);
    }
    setValidationError(message);
    setTimeout(() => setValidationError(""), 4000);
  }

  async function save() {
    const titleError = getPortugueseTitleValidationError(translations);
    if (titleError) {
      showTitleValidationError(titleError);
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

  const localeLabels = getArticleLocaleLabels(MASTER_ARTICLE_LOCALE);

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
        <ArticleEditorFields
          activeLocale={activeLocale}
          localeLabels={localeLabels}
          translations={translations}
          translating={translating}
          editor={editor}
          onLocaleChange={setActiveLocale}
          onTranslate={translateToLocale}
          onFieldChange={updateTransField}
          onAutoSlug={autoSlug}
        />
        <ArticleEditorSidebar
          meta={meta}
          uploading={uploading}
          onMetaChange={(patch) => setMeta((prev) => ({ ...prev, ...patch }))}
          onUploadImage={uploadImage}
        />
      </div>
    </div>
  );
}
