import { Loader2, Upload } from "lucide-react";
import {
  ARTICLE_CATEGORIES,
  type ArticleMeta,
} from "@/lib/article-editor-types";

type ArticleEditorSidebarProps = {
  meta: ArticleMeta;
  uploading: boolean;
  onMetaChange: (patch: Partial<ArticleMeta>) => void;
  onUploadImage: (file: File) => void;
};

function featuredImagePreviewUrl(fileId: string): string {
  const endpoint =
    import.meta.env.PUBLIC_APPWRITE_ENDPOINT ??
    "https://nyc.cloud.appwrite.io/v1";
  const bucket = import.meta.env.PUBLIC_STORAGE_BUCKET_ID ?? "images";
  const project =
    import.meta.env.PUBLIC_APPWRITE_PROJECT_ID ?? "69e462f20036d39192ba";
  return `${endpoint}/storage/buckets/${bucket}/files/${fileId}/preview?width=400&height=250&project=${project}`;
}

export default function ArticleEditorSidebar({
  meta,
  uploading,
  onMetaChange,
  onUploadImage,
}: ArticleEditorSidebarProps) {
  return (
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
              onMetaChange({ status: e.target.value as ArticleMeta["status"] })
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
            onChange={(e) => onMetaChange({ category: e.target.value })}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            {ARTICLE_CATEGORIES.map((c) => (
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
            onChange={(e) => onMetaChange({ authorName: e.target.value })}
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
            onChange={(e) => onMetaChange({ publishedAt: e.target.value })}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            checked={meta.featured}
            onChange={(e) => onMetaChange({ featured: e.target.checked })}
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
            src={featuredImagePreviewUrl(meta.featuredImage)}
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
              const file = e.target.files?.[0];
              if (file) onUploadImage(file);
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
                onMetaChange({ featuredImageAlt: e.target.value })
              }
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
              placeholder="Descrição da imagem"
            />
          </div>
        )}
      </div>
    </div>
  );
}
