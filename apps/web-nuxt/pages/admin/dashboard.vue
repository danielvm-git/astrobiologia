<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

useHead({
  title: "Painel Administrativo - Astrobiologia",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const localePath = useLocalePath();

const { data, error, status, refresh } = await useAsyncData(
  "admin-me",
  async () => {
    return (await fetch("/api/me").then((response) => response.json())) as {
      user?: { name?: string; email?: string };
    };
  }
);

const userName = computed(() => data.value?.user?.name || "Admin");
const userEmail = computed(() => data.value?.user?.email || "");
</script>

<template>
  <div class="space-y-8">
    <header class="space-y-3">
      <p
        class="text-[10px] font-black uppercase tracking-widest text-slate-400"
      >
        Área administrativa
      </p>
      <h1 class="text-4xl font-black tracking-tighter text-slate-900 uppercase">
        Painel de controle
      </h1>
      <p class="text-sm text-slate-600 font-medium">
        Sessão autenticada para <strong>{{ userName }}</strong>
        <span v-if="userEmail">({{ userEmail }})</span>
      </p>
    </header>

    <section
      v-if="error"
      class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700"
    >
      <p class="font-black uppercase tracking-widest text-xs">
        Erro de conexão
      </p>
      <p class="mt-2 text-sm">
        Não foi possível carregar os dados do painel. Verifique sua sessão e
        tente novamente.
      </p>
      <button
        type="button"
        class="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-red-700"
        @click="refresh()"
      >
        tentar novamente
      </button>
    </section>

    <section v-else class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <article
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <p
          class="text-[10px] font-black uppercase tracking-widest text-slate-400"
        >
          Status
        </p>
        <p class="mt-2 text-2xl font-black text-slate-900">Online</p>
        <p class="mt-2 text-xs text-slate-500">
          Middleware autenticando via cookie Appwrite.
        </p>
      </article>

      <article
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <p
          class="text-[10px] font-black uppercase tracking-widest text-slate-400"
        >
          Sessão
        </p>
        <p class="mt-2 text-2xl font-black text-slate-900">{{ status }}</p>
        <p class="mt-2 text-xs text-slate-500">
          Carregamento do endpoint protegido `/api/me`.
        </p>
      </article>

      <article
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <p
          class="text-[10px] font-black uppercase tracking-widest text-slate-400"
        >
          Próximo passo
        </p>
        <NuxtLink
          :to="localePath('/admin/artigos')"
          class="mt-2 inline-block text-sm font-black uppercase tracking-widest text-primary hover:underline"
        >
          abrir gestão de artigos
        </NuxtLink>
      </article>
    </section>
  </div>
</template>
