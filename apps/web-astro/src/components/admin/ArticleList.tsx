import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, PenTool } from "lucide-react";
import { ARTICLE_LOCALES } from "@/lib/article-locales";

type ArticleRow = {
  $id: string;
  title: string;
  status: "draft" | "published";
  category?: string;
  $createdAt: string;
  publishedAt?: string;
  languages: Record<string, boolean>;
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ArticleList() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/articles");
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setArticles(data.articles ?? []);
    } catch {
      setError("Erro ao carregar artigos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteArticle(id: string, title: string) {
    if (!confirm(`Excluir "${title}"? Esta ação não pode ser desfeita.`))
      return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setArticles((prev) => prev.filter((a) => a.$id !== id));
    } catch {
      alert("Erro ao excluir artigo.");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
            Artigos
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {articles.length} artigos encontrados
          </p>
        </div>
        <a
          href="/admin/artigos/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-700 transition"
        >
          <Plus className="w-4 h-4" />
          Novo Artigo
        </a>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {articles.length === 0 ? (
          <p className="p-12 text-center text-slate-400 italic">
            Nenhum artigo encontrado. Crie o primeiro!
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Título
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Idiomas
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Data
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((article) => (
                <tr
                  key={article.$id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 truncate max-w-xs">
                      {article.title}
                    </p>
                    {article.category && (
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">
                        {article.category}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                        article.status === "published"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-yellow-50 text-yellow-700 border-yellow-100"
                      }`}
                    >
                      {article.status === "published" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Publicado
                        </>
                      ) : (
                        <>
                          <PenTool className="w-3 h-3" /> Rascunho
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {ARTICLE_LOCALES.map((locale) => (
                        <span
                          key={locale}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                            article.languages[locale]
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {locale}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                    {formatDate(article.publishedAt || article.$createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <a
                        href={`/admin/artigos/${article.$id}/edit`}
                        data-testid="article-edit-link"
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        disabled={deleting === article.$id}
                        onClick={() =>
                          deleteArticle(article.$id, article.title)
                        }
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-40"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
