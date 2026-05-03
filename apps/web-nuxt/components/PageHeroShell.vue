<script setup lang="ts">
const props = defineProps<{
  kicker?: string;
  title: string;
  quote?: string;
}>();
</script>

<template>
  <header class="bg-slate-900">
    <div
      class="mx-auto max-w-7xl px-4 pt-4 pb-3 text-center sm:px-6 md:pt-6 md:pb-4 lg:px-8"
    >
      <p
        v-if="props.kicker"
        class="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-accent"
      >
        {{ props.kicker }}
      </p>

      <h1
        class="font-sans text-3xl font-black tracking-tight text-white md:text-5xl md:leading-tight"
      >
        {{ props.title }}<span class="text-accent">.</span>
      </h1>

      <p
        v-if="props.quote"
        class="mx-auto mt-6 max-w-3xl font-serif text-lg italic leading-relaxed text-slate-400 md:text-xl"
      >
        {{ props.quote }}
      </p>
    </div>
  </header>
</template>
