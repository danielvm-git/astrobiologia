import { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  PenTool,
  Tag,
  Plus,
  ExternalLink,
  TrendingUp,
  Calendar,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

type RecentArticle = {
  $id: string;
  title?: string;
  status?: string;
  category?: string;
  publishedAt?: string;
  $createdAt?: string;
};

type Stats = {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  categories: number;
  recentArticles: RecentArticle[];
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadError, setLoadError] = useState("");
  const [redeploying, setRedeploying] = useState(false);
  const [redeployStatus, setRedeployStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  async function loadStats() {
    setLoadError("");
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (data.error) {
        setLoadError(data.error);
        return;
      }
      setStats(data.stats);
    } catch {
      setLoadError("Falha ao carregar dados do painel.");
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  async function triggerRedeploy() {
    setRedeploying(true);
    setRedeployStatus("idle");
    try {
      const res = await fetch("/api/admin/redeploy", { method: "POST" });
      setRedeployStatus(res.ok ? "success" : "error");
    } catch {
      setRedeployStatus("error");
    } finally {
      setRedeploying(false);
      setTimeout(() => setRedeployStatus("idle"), 4000);
    }
  }

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl flex flex-col items-center text-center">
        <p className="font-bold mb-4">{loadError}</p>
        <button
          onClick={loadStats}
          className="px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total de Artigos",
      value: stats.totalArticles,
      Icon: FileText,
      color: "text-primary bg-primary/5",
    },
    {
      label: "Publicados",
      value: stats.publishedArticles,
      Icon: CheckCircle2,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Rascunhos",
      value: stats.draftArticles,
      Icon: PenTool,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      label: "Categorias",
      value: stats.categories,
      Icon: Tag,
      color: "text-slate-600 bg-slate-100",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Painel de Controle
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Visão Geral do Portal Científico
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, Icon, color }) => (
          <div
            key={label}
            className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {label}
                </p>
                <p className="text-3xl font-black text-slate-900">{value}</p>
              </div>
              <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-400" />
              Artigos Recentes
            </h2>
            <a
              href="/admin/artigos"
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-1"
            >
              Ver Todos <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {stats.recentArticles.length > 0 ? (
              stats.recentArticles.map((article) => (
                <div
                  key={article.$id}
                  className="p-5 hover:bg-slate-50 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">
                      {article.title || "(Sem título)"}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
                      {formatDate(
                        article.publishedAt || article.$createdAt || ""
                      )}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                      article.status === "published"
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "bg-yellow-50 text-yellow-700 border-yellow-100"
                    }`}
                  >
                    {article.status === "published" ? "Publicado" : "Rascunho"}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-12 text-center text-slate-400 italic">
                Nenhum artigo ainda.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-tight">
            Ações Rápidas
          </h2>
          <div className="space-y-3">
            <a
              href="/admin/artigos/new"
              className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-700 transition group"
            >
              <div className="flex items-center gap-3">
                <Plus className="w-5 h-5" />
                <span className="font-black uppercase tracking-widest text-xs">
                  Novo Artigo
                </span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="/admin/artigos"
              className="flex items-center justify-between p-4 bg-white border border-slate-200 text-slate-900 rounded-2xl hover:border-slate-900 transition group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <span className="font-black uppercase tracking-widest text-xs">
                  Gerenciar Todos
                </span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <button
              type="button"
              disabled={redeploying}
              onClick={triggerRedeploy}
              className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 text-slate-900 rounded-2xl hover:border-slate-900 transition group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <RefreshCw
                  className={`w-5 h-5 ${redeploying ? "animate-spin" : ""}`}
                />
                <span className="font-black uppercase tracking-widest text-xs">
                  {redeploying
                    ? "Publicando..."
                    : redeployStatus === "success"
                      ? "Publicado!"
                      : redeployStatus === "error"
                        ? "Erro ao Publicar"
                        : "Publicar Site"}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
