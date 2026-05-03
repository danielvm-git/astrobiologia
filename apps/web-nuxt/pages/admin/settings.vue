<script setup lang="ts">
import { useSiteSettingsStore } from "~/stores/siteSettings";
import type { LayoutType } from "~/types/site-settings";

definePageMeta({ layout: "admin", middleware: ["admin"] });

const { t } = useI18n();

useHead({
  title: () => t("admin_settings_document_title"),
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const store = useSiteSettingsStore();
const pendingLayout = ref<LayoutType>(store.layout);
const saving = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

async function save() {
  saving.value = true;
  error.value = null;
  success.value = false;
  try {
    await store.setLayout(pendingLayout.value);
    success.value = true;
  } catch {
    error.value = "Não foi possível salvar. Tente novamente.";
  } finally {
    saving.value = false;
  }
}

type LayoutOption = { id: LayoutType; name: string; description: string };

const layouts: LayoutOption[] = [
  {
    id: "grid",
    name: "Grade Uniforme",
    description: "Grade de cards idênticos em 3 colunas.",
  },
  {
    id: "hero-grid",
    name: "Herói + Grade",
    description: "Destaque à esquerda, dois compactos à direita, grade abaixo.",
  },
  {
    id: "hero-sidebar",
    name: "Herói + Sidebar",
    description: "Destaque à esquerda, lista lateral de últimas notícias.",
  },
  {
    id: "magazine",
    name: "Revista",
    description: "Banner em destaque no topo, grade editorial em 3 colunas.",
  },
  {
    id: "list",
    name: "Lista",
    description:
      "Feed vertical de artigos compactos, ideal para leitura rápida.",
  },
];
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
    <h1 class="text-2xl font-black uppercase tracking-tighter text-slate-900">
      Configurações
    </h1>

    <section class="mt-10">
      <h2
        class="text-base font-black uppercase tracking-[0.15em] text-slate-500"
      >
        Aparência
      </h2>
      <p class="mt-1 text-sm text-slate-600">
        Escolha como os artigos são apresentados ao público.
      </p>

      <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <button
          v-for="option in layouts"
          :key="option.id"
          type="button"
          :aria-pressed="pendingLayout === option.id"
          :class="[
            'relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
            pendingLayout === option.id
              ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2'
              : 'border-slate-200 hover:border-slate-400',
          ]"
          @click="pendingLayout = option.id"
        >
          <svg
            v-if="option.id === 'grid'"
            viewBox="0 0 160 100"
            class="w-full rounded"
            aria-hidden="true"
          >
            <rect width="160" height="100" fill="#f8fafc" rx="4" />
            <rect x="4" y="4" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="57" y="4" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="110" y="4" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="4" y="38" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="57" y="38" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="110" y="38" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="4" y="72" width="46" height="24" rx="2" fill="#e2e8f0" />
            <rect x="57" y="72" width="46" height="24" rx="2" fill="#e2e8f0" />
            <rect x="110" y="72" width="46" height="24" rx="2" fill="#e2e8f0" />
          </svg>

          <svg
            v-else-if="option.id === 'hero-grid'"
            viewBox="0 0 160 100"
            class="w-full rounded"
            aria-hidden="true"
          >
            <rect width="160" height="100" fill="#f8fafc" rx="4" />
            <rect x="4" y="4" width="90" height="44" rx="2" fill="#cbd5e1" />
            <rect x="100" y="4" width="56" height="20" rx="2" fill="#e2e8f0" />
            <rect x="100" y="28" width="56" height="20" rx="2" fill="#e2e8f0" />
            <rect x="4" y="54" width="46" height="22" rx="2" fill="#e2e8f0" />
            <rect x="57" y="54" width="46" height="22" rx="2" fill="#e2e8f0" />
            <rect x="110" y="54" width="46" height="22" rx="2" fill="#e2e8f0" />
            <rect x="4" y="80" width="46" height="16" rx="2" fill="#e2e8f0" />
            <rect x="57" y="80" width="46" height="16" rx="2" fill="#e2e8f0" />
            <rect x="110" y="80" width="46" height="16" rx="2" fill="#e2e8f0" />
          </svg>

          <svg
            v-else-if="option.id === 'hero-sidebar'"
            viewBox="0 0 160 100"
            class="w-full rounded"
            aria-hidden="true"
          >
            <rect width="160" height="100" fill="#f8fafc" rx="4" />
            <rect x="4" y="4" width="88" height="44" rx="2" fill="#cbd5e1" />
            <rect x="98" y="4" width="58" height="8" rx="1" fill="#e2e8f0" />
            <rect x="98" y="15" width="58" height="8" rx="1" fill="#e2e8f0" />
            <rect x="98" y="26" width="58" height="8" rx="1" fill="#e2e8f0" />
            <rect x="98" y="37" width="58" height="8" rx="1" fill="#e2e8f0" />
            <rect x="4" y="54" width="46" height="22" rx="2" fill="#e2e8f0" />
            <rect x="57" y="54" width="46" height="22" rx="2" fill="#e2e8f0" />
            <rect x="110" y="54" width="46" height="22" rx="2" fill="#e2e8f0" />
            <rect x="4" y="80" width="46" height="16" rx="2" fill="#e2e8f0" />
            <rect x="57" y="80" width="46" height="16" rx="2" fill="#e2e8f0" />
            <rect x="110" y="80" width="46" height="16" rx="2" fill="#e2e8f0" />
          </svg>

          <svg
            v-else-if="option.id === 'magazine'"
            viewBox="0 0 160 100"
            class="w-full rounded"
            aria-hidden="true"
          >
            <rect width="160" height="100" fill="#f8fafc" rx="4" />
            <rect x="4" y="4" width="152" height="30" rx="2" fill="#cbd5e1" />
            <rect x="4" y="40" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="57" y="40" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="110" y="40" width="46" height="28" rx="2" fill="#e2e8f0" />
            <rect x="4" y="72" width="46" height="24" rx="2" fill="#e2e8f0" />
            <rect x="57" y="72" width="46" height="24" rx="2" fill="#e2e8f0" />
            <rect x="110" y="72" width="46" height="24" rx="2" fill="#e2e8f0" />
          </svg>

          <svg
            v-else-if="option.id === 'list'"
            viewBox="0 0 160 100"
            class="w-full rounded"
            aria-hidden="true"
          >
            <rect width="160" height="100" fill="#f8fafc" rx="4" />
            <rect x="4" y="4" width="28" height="20" rx="2" fill="#cbd5e1" />
            <rect x="38" y="4" width="118" height="8" rx="1" fill="#e2e8f0" />
            <rect x="38" y="16" width="80" height="5" rx="1" fill="#e2e8f0" />
            <rect x="4" y="30" width="28" height="20" rx="2" fill="#cbd5e1" />
            <rect x="38" y="30" width="118" height="8" rx="1" fill="#e2e8f0" />
            <rect x="38" y="42" width="80" height="5" rx="1" fill="#e2e8f0" />
            <rect x="4" y="56" width="28" height="20" rx="2" fill="#cbd5e1" />
            <rect x="38" y="56" width="118" height="8" rx="1" fill="#e2e8f0" />
            <rect x="38" y="68" width="80" height="5" rx="1" fill="#e2e8f0" />
            <rect x="4" y="82" width="28" height="14" rx="2" fill="#cbd5e1" />
            <rect x="38" y="82" width="118" height="6" rx="1" fill="#e2e8f0" />
            <rect x="38" y="91" width="60" height="4" rx="1" fill="#e2e8f0" />
          </svg>

          <span
            v-if="pendingLayout === option.id"
            class="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white"
            aria-hidden="true"
          >
            <svg viewBox="0 0 12 12" class="h-3 w-3">
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                stroke-width="1.5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>

          <span class="text-xs font-bold text-slate-700">{{
            option.name
          }}</span>
          <span class="text-center text-[10px] leading-tight text-slate-500">
            {{ option.description }}
          </span>
        </button>
      </div>

      <div class="mt-6 flex items-center gap-4">
        <button
          type="button"
          :disabled="saving"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
          @click="save"
        >
          <svg
            v-if="saving"
            class="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          {{ saving ? "Salvando…" : "Salvar layout" }}
        </button>

        <p v-if="success" class="text-sm font-medium text-green-600">
          Layout salvo com sucesso.
        </p>
        <p v-if="error" class="text-sm font-medium text-red-600">
          {{ error }}
        </p>
      </div>
    </section>
  </div>
</template>
