<script setup lang="ts">
import { Menu, Telescope, X } from "lucide-vue-next";

const isMobileOpen = ref(false);
const localePath = useLocalePath();
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900">
    <header
      class="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur"
    >
      <div
        class="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <NuxtLink :to="localePath('/')" class="flex items-center gap-2">
          <Telescope class="h-6 w-6 text-primary" />
          <span class="text-sm font-black uppercase tracking-widest"
            >Astrobiologia</span
          >
        </NuxtLink>
        <nav class="hidden items-center gap-6 md:flex">
          <NuxtLink
            :to="localePath('/')"
            class="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary"
            >{{ $t("nav_home") }}</NuxtLink
          >
          <NuxtLink
            :to="localePath('/artigos')"
            class="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary"
            >{{ $t("nav_articles") }}</NuxtLink
          >
          <NuxtLink
            :to="localePath('/sobre')"
            class="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary"
            >{{ $t("nav_about") }}</NuxtLink
          >
          <NuxtLink
            :to="localePath('/admin/dashboard')"
            class="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary"
            >Admin</NuxtLink
          >
          <LanguageSwitcher variant="header" />
        </nav>
        <button
          class="md:hidden"
          @click="isMobileOpen = !isMobileOpen"
          :aria-label="$t('aria_close_menu')"
        >
          <Menu v-if="!isMobileOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </button>
      </div>
      <div
        v-if="isMobileOpen"
        class="border-t border-slate-100 px-4 py-4 md:hidden"
      >
        <div class="flex flex-col gap-3">
          <NuxtLink
            :to="localePath('/')"
            class="text-xs font-black uppercase tracking-widest text-slate-600"
            @click="isMobileOpen = false"
            >{{ $t("nav_home") }}</NuxtLink
          >
          <NuxtLink
            :to="localePath('/artigos')"
            class="text-xs font-black uppercase tracking-widest text-slate-600"
            @click="isMobileOpen = false"
            >{{ $t("nav_articles") }}</NuxtLink
          >
          <NuxtLink
            :to="localePath('/sobre')"
            class="text-xs font-black uppercase tracking-widest text-slate-600"
            @click="isMobileOpen = false"
            >{{ $t("nav_about") }}</NuxtLink
          >
          <NuxtLink
            :to="localePath('/admin/dashboard')"
            class="text-xs font-black uppercase tracking-widest text-slate-600"
            @click="isMobileOpen = false"
            >Admin</NuxtLink
          >
          <LanguageSwitcher variant="mobile" />
        </div>
      </div>
    </header>

    <slot />

    <footer class="border-t border-slate-100 py-10">
      <div class="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 lg:px-8">
        <p class="text-sm text-slate-500">{{ $t("footer_tagline") }}</p>
        <LanguageSwitcher variant="footer" />
        <div
          class="flex flex-wrap gap-4 text-xs font-black uppercase tracking-widest text-slate-500"
        >
          <NuxtLink :to="localePath('/contato')">{{
            $t("footer_contact_link")
          }}</NuxtLink>
          <NuxtLink :to="localePath('/privacidade')">{{
            $t("footer_privacy_link")
          }}</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
