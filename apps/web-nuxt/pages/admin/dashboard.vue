<script setup lang="ts">
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
  Telescope,
  Settings,
} from "lucide-vue-next";
import { cn } from "@/lib/utils";

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

useHead({
  title: "Painel Administrativo - Astrobiologia",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const localePath = useLocalePath();

type RecentArticle = {
  $id: string;
  title?: string;
  status?: string;
  category?: string;
  publishedAt?: string;
  $createdAt?: string;
  authorName?: string;
};

type DashboardPayload = {
  stats?: {
    totalArticles: number;
    publishedArticles: number;
    draftArticles: number;
    categories: number;
    recentArticles: RecentArticle[];
  };
  error?: string;
};

const { data, error: fetchError, refresh } = await useAsyncData<DashboardPayload>(
  "admin-dashboard",
  () => $fetch<DashboardPayload>("/api/admin/dashboard")
);

const stats = computed(() => data.value?.stats);
const loadError = computed(() => data.value?.error || fetchError.value?.message);

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
</script>

<template>
  <div class="space-y-10">
    <div v-if="loadError" class="space-y-4">
      <div
        class="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl flex flex-col items-center text-center shadow-sm"
      >
        <div
          class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4"
        >
          <Settings class="w-6 h-6" />
        </div>
        <h2 class="text-xl font-black uppercase tracking-tight mb-2">
          Erro de Conexão
        </h2>
        <p class="text-slate-600 max-w-md">{{ loadError }}</p>
        <button
          type="button"
          class="mt-6 px-6 py-2 bg-red-600 text-white hover:bg-red-700 rounded-xl transition font-black uppercase tracking-widest text-xs shadow-lg shadow-red-200"
          @click="refresh()"
        >
          Tentar Novamente
        </button>
      </div>
    </div>

    <div v-else-if="stats" class="space-y-10">
      <div>
        <h1 class="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Painel de Controle
        </h1>
        <p
          class="text-slate-500 mt-2 text-sm font-medium uppercase tracking-widest flex items-center gap-2"
        >
          <TrendingUp class="w-4 h-4 text-accent" />
          Visão Geral do Portal Científico
        </p>
      </div>

      <div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            class="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
          >
            <div class="flex items-start justify-between">
              <div>
                <p
                  class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1"
                >
                  Total de Artigos
                </p>
                <p class="text-3xl font-black text-slate-900">
                  {{ stats.totalArticles }}
                </p>
              </div>
              <div
                class="p-3 bg-primary/5 rounded-xl text-primary transition-colors group-hover:bg-primary group-hover:text-white"
              >
                <FileText class="w-6 h-6" />
              </div>
            </div>
            <div class="mt-4 flex items-center gap-2">
              <span
                class="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded"
                >+12% este mês</span
              >
            </div>
          </div>

          <div
            class="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
          >
            <div class="flex items-start justify-between">
              <div>
                <p
                  class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1"
                >
                  Publicados
                </p>
                <p class="text-3xl font-black text-slate-900">
                  {{ stats.publishedArticles }}
                </p>
              </div>
              <div
                class="p-3 bg-green-50 rounded-xl text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white"
              >
                <CheckCircle2 class="w-6 h-6" />
              </div>
            </div>
            <div class="mt-4 text-[10px] font-bold text-slate-400">
              Prontos para leitura
            </div>
          </div>

          <div
            class="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
          >
            <div class="flex items-start justify-between">
              <div>
                <p
                  class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1"
                >
                  Rascunhos
                </p>
                <p class="text-3xl font-black text-slate-900">
                  {{ stats.draftArticles }}
                </p>
              </div>
              <div
                class="p-3 bg-yellow-50 rounded-xl text-yellow-600 transition-colors group-hover:bg-yellow-600 group-hover:text-white"
              >
                <PenTool class="w-6 h-6" />
              </div>
            </div>
            <div class="mt-4 text-[10px] font-bold text-slate-400">
              Em desenvolvimento
            </div>
          </div>

          <div
            class="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
          >
            <div class="flex items-start justify-between">
              <div>
                <p
                  class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1"
                >
                  Categorias
                </p>
                <p class="text-3xl font-black text-slate-900">
                  {{ stats.categories }}
                </p>
              </div>
              <div
                class="p-3 bg-accent/5 rounded-xl text-accent transition-colors group-hover:bg-accent group-hover:text-white"
              >
                <Tag class="w-6 h-6" />
              </div>
            </div>
            <div class="mt-4 text-[10px] font-bold text-slate-400">
              Tópicos científicos
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div class="lg:col-span-2 space-y-6">
            <div class="flex items-center justify-between">
              <h2
                class="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2"
              >
                <Calendar class="w-5 h-5 text-primary" />
                Artigos Recentes
              </h2>
              <NuxtLink
                :to="localePath('/admin/artigos')"
                class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-1"
              >
                Ver Todos <ExternalLink class="w-3 h-3" />
              </NuxtLink>
            </div>

            <div
              class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div
                v-if="stats.recentArticles?.length"
                class="divide-y divide-slate-100"
              >
                <div
                  v-for="article in stats.recentArticles"
                  :key="article.$id"
                  class="p-6 hover:bg-slate-50/50 transition-colors group"
                >
                  <div class="flex items-center justify-between gap-4">
                    <div class="min-w-0 flex-1">
                      <h3
                        class="text-lg font-bold text-slate-900 truncate group-hover:text-primary transition-colors"
                      >
                        {{
                          article.title ||
                          "(Sem título)"
                        }}
                      </h3>
                      <div class="flex items-center gap-3 mt-2">
                        <span
                          :class="
                            cn(
                              'px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border',
                              article.status === 'published'
                                ? 'bg-green-50 text-green-700 border-green-100'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                            )
                          "
                        >
                          {{
                            article.status === "published"
                              ? "Publicado"
                              : "Rascunho"
                          }}
                        </span>
                        <span
                          class="text-[10px] text-slate-400 flex items-center gap-1 uppercase tracking-widest font-black"
                        >
                          <Calendar class="w-3 h-3" />
                          {{
                            formatDate(
                              article.publishedAt || article.$createdAt || ""
                            )
                          }}
                        </span>
                        <span
                          v-if="article.category"
                          class="text-[10px] text-slate-400 flex items-center gap-1 uppercase tracking-widest font-black"
                        >
                          <Tag class="w-3 h-3" />
                          {{ article.category }}
                        </span>
                      </div>
                    </div>
                    <NuxtLink
                      :to="
                        localePath(`/admin/artigos/${article.$id}/edit`)
                      "
                      class="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0"
                    >
                      Editar
                    </NuxtLink>
                  </div>
                </div>
              </div>
              <div v-else class="p-12 text-center">
                <p class="text-slate-400 font-medium italic">
                  Nenhum artigo encontrado. Crie seu primeiro artigo para
                  começar!
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <h2
              class="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2"
            >
              <CheckCircle2 class="w-5 h-5 text-accent" />
              Ações Rápidas
            </h2>

            <div class="space-y-3">
              <NuxtLink
                :to="localePath('/admin/artigos/new')"
                class="flex items-center justify-between p-4 bg-primary text-white rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all group"
              >
                <div class="flex items-center gap-3">
                  <Plus class="w-5 h-5" />
                  <span class="font-black uppercase tracking-widest text-xs"
                    >Novo Artigo</span
                  >
                </div>
                <ChevronRight
                  class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </NuxtLink>

              <NuxtLink
                :to="localePath('/admin/artigos')"
                class="flex items-center justify-between p-4 bg-white border border-slate-200 text-slate-900 rounded-2xl hover:border-primary transition-all group"
              >
                <div class="flex items-center gap-3">
                  <FileText class="w-5 h-5 text-primary" />
                  <span class="font-black uppercase tracking-widest text-xs"
                    >Gerenciar Todos</span
                  >
                </div>
                <ChevronRight
                  class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </NuxtLink>

              <div
                class="p-6 bg-slate-900 rounded-2xl text-white relative overflow-hidden"
              >
                <div class="relative z-10">
                  <p
                    class="text-[10px] font-black uppercase tracking-widest text-accent mb-2"
                  >
                    Suporte
                  </p>
                  <p class="text-sm text-slate-300 mb-4">
                    Dúvidas sobre o sistema? Consulte o guia do editor.
                  </p>
                  <NuxtLink
                    :to="localePath('/admin/help')"
                    class="text-xs font-black uppercase tracking-widest hover:text-accent transition-colors"
                    >Acessar Docs →</NuxtLink
                  >
                </div>
                <Telescope
                  class="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 rotate-12"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col justify-center items-center py-32 space-y-4"
    >
      <div class="relative w-16 h-16">
        <div
          class="absolute inset-0 border-4 border-primary/10 rounded-full"
        ></div>
        <div
          class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
      <p
        class="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse"
      >
        Sincronizando Dados...
      </p>
    </div>
  </div>
</template>
