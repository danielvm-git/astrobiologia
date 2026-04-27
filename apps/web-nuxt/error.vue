<script setup lang="ts">
defineProps<{
  error: { statusCode?: number; statusMessage?: string; message?: string };
}>();
const localePath = useLocalePath();
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
    <p class="text-xs font-black uppercase tracking-widest text-primary">
      {{ error?.statusCode || 500 }}
    </p>
    <h1 class="mt-3 text-4xl font-black text-slate-900">
      {{ error?.statusCode || 500 }}
    </h1>
    <p class="mt-4 text-slate-600">
      {{
        error?.statusCode === 404
          ? "Not Found"
          : error?.statusMessage ||
            error?.message ||
            $t("error_default_message")
      }}
    </p>
    <NuxtLink
      :to="localePath('/')"
      class="mt-8 inline-flex rounded bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-white"
      >{{ $t("error_back_home") }}</NuxtLink
    >
  </main>
</template>
