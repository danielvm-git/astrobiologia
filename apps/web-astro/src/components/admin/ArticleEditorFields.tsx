import type { Editor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";
import { Globe } from "lucide-react";
import { ARTICLE_LOCALES } from "@/lib/article-locales";
import type { ArticleTranslation } from "@/lib/article-editor-types";

type ArticleEditorFieldsProps = {
  activeLocale: string;
  localeLabels: Record<string, string>;
  translations: Record<string, ArticleTranslation>;
  translating: boolean;
  editor: Editor | null;
  onLocaleChange: (locale: string) => void;
  onTranslate: (locale: string) => void;
  onFieldChange: (field: keyof ArticleTranslation, value: string) => void;
  onAutoSlug: () => void;
};

const TOOLBAR_ACTIONS = [
  { label: "B", action: "bold" as const },
  { label: "I", action: "italic" as const },
  { label: "H2", action: "h2" as const },
  { label: "H3", action: "h3" as const },
  { label: "UL", action: "bulletList" as const },
  { label: "OL", action: "orderedList" as const },
  { label: "—", action: "hr" as const },
];

function runToolbarAction(editor: Editor | null, action: string): void {
  if (!editor) return;
  const chain = editor.chain().focus();
  switch (action) {
    case "bold":
      chain.toggleBold().run();
      break;
    case "italic":
      chain.toggleItalic().run();
      break;
    case "h2":
      chain.toggleHeading({ level: 2 }).run();
      break;
    case "h3":
      chain.toggleHeading({ level: 3 }).run();
      break;
    case "bulletList":
      chain.toggleBulletList().run();
      break;
    case "orderedList":
      chain.toggleOrderedList().run();
      break;
    case "hr":
      chain.setHorizontalRule().run();
      break;
  }
}

function isToolbarActive(editor: Editor | null, action: string): boolean {
  if (!editor) return false;
  switch (action) {
    case "bold":
      return editor.isActive("bold");
    case "italic":
      return editor.isActive("italic");
    case "h2":
      return editor.isActive("heading", { level: 2 });
    case "h3":
      return editor.isActive("heading", { level: 3 });
    case "bulletList":
      return editor.isActive("bulletList");
    case "orderedList":
      return editor.isActive("orderedList");
    default:
      return false;
  }
}

export default function ArticleEditorFields({
  activeLocale,
  localeLabels,
  translations,
  translating,
  editor,
  onLocaleChange,
  onTranslate,
  onFieldChange,
  onAutoSlug,
}: ArticleEditorFieldsProps) {
  const currentTrans = translations[activeLocale];

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex gap-2 flex-wrap items-center">
        {ARTICLE_LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            data-testid={`locale-tab-${locale}`}
            aria-pressed={activeLocale === locale}
            onClick={() => onLocaleChange(locale)}
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
            onClick={() => onTranslate(activeLocale)}
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
            Título ({localeLabels[activeLocale] ?? activeLocale})
          </label>
          <input
            id="article-title"
            data-testid="article-title"
            type="text"
            value={currentTrans.title}
            onChange={(e) => onFieldChange("title", e.target.value)}
            onBlur={() => {
              if (!currentTrans.slug) onAutoSlug();
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
                onChange={(e) => onFieldChange("slug", e.target.value)}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="url-do-artigo"
              />
              <button
                type="button"
                onClick={onAutoSlug}
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
            onChange={(e) => onFieldChange("excerpt", e.target.value)}
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
              {TOOLBAR_ACTIONS.map(({ label, action }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => runToolbarAction(editor, action)}
                  className={`px-2 py-1 text-xs font-bold rounded transition ${
                    isToolbarActive(editor, action)
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
  );
}
