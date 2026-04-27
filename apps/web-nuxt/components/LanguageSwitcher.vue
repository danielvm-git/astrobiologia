<script setup lang="ts">
import { ref } from "vue";
import { Languages, ChevronDown } from "lucide-vue-next";
import { cn } from "@/lib/utils";

const props = defineProps<{
  variant?: "header" | "footer" | "mobile";
  class?: string;
}>();

const { variant = "header" } = props;

const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const isOpen = ref(false);

const languageNames: Record<string, string> = {
  "pt-br": "Português",
  en: "English",
  nl: "Dutch",
  es: "Español",
  ja: "日本語",
  zh: "中文",
};

function toggleMenu() {
  isOpen.value = !isOpen.value;
}

function closeMenu() {
  isOpen.value = false;
}
</script>

<template>
  <div v-if="variant === 'header'" :class="cn('relative', props.class)">
    <button
      type="button"
      @click="toggleMenu"
      class="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors rounded-md hover:bg-slate-50"
      :aria-expanded="isOpen"
      :aria-label="$t('aria_select_language')"
    >
      <Languages class="h-3.5 w-3.5" />
      {{ locale }}
      <ChevronDown
        :class="
          cn(
            'h-3 w-3 transition-transform duration-200',
            isOpen && 'rotate-180'
          )
        "
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-40 rounded-xl bg-white border border-slate-100 shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-150"
    >
      <NuxtLink
        v-for="l in locales"
        :key="l.code"
        :to="switchLocalePath(l.code)"
        @click="closeMenu"
        :class="
          cn(
            'block px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50',
            locale === l.code ? 'text-primary' : 'text-slate-500'
          )
        "
      >
        {{ languageNames[l.code] || l.code.toUpperCase() }}
      </NuxtLink>
    </div>
    <button
      v-if="isOpen"
      class="fixed inset-0 z-[40] cursor-default bg-transparent w-full h-full border-none"
      @click="closeMenu"
      :aria-label="$t('aria_close_menu')"
    ></button>
  </div>

  <div
    v-else-if="variant === 'mobile'"
    :class="cn('flex flex-col gap-4 py-2', props.class)"
  >
    <span
      class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3"
      >{{ $t("label_language") }}</span
    >
    <div class="flex flex-wrap gap-2 px-3">
      <NuxtLink
        v-for="l in locales"
        :key="l.code"
        :to="switchLocalePath(l.code)"
        :class="
          cn(
            'px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border',
            locale === l.code
              ? 'bg-primary text-white border-primary shadow-md'
              : 'bg-white text-slate-500 border-slate-100 hover:border-primary/20'
          )
        "
      >
        {{ languageNames[l.code] || l.code.toUpperCase() }}
      </NuxtLink>
    </div>
  </div>

  <div
    v-else-if="variant === 'footer'"
    :class="cn('flex flex-wrap items-center gap-x-4 gap-y-2', props.class)"
  >
    <NuxtLink
      v-for="l in locales"
      :key="l.code"
      :to="switchLocalePath(l.code)"
      :class="
        cn(
          'text-[10px] font-black tracking-widest transition-colors',
          locale === l.code
            ? 'text-primary'
            : 'text-slate-400 hover:text-slate-600'
        )
      "
    >
      {{ languageNames[l.code] }}
    </NuxtLink>
  </div>
</template>
