<script setup lang="ts">
import { computed } from "vue";
import { Clock } from "lucide-vue-next";
import { getImageUrl, CATEGORIES } from "@/server/utils/appwrite";
import { readingTime, cn } from "@/lib/utils";

const props = defineProps<{
  article: any;
  variant?: "default" | "featured" | "compact";
  class?: string;
}>();

const { variant = "default" } = props;

const { t, locale } = useI18n();
const localePath = useLocalePath();

const title = computed(
  () => props.article.translation?.title || props.article.title
);
const slug = computed(
  () => props.article.translation?.slug || props.article.slug
);
const excerpt = computed(
  () => props.article.translation?.excerpt || props.article.excerpt
);
const content = computed(
  () => props.article.translation?.content || props.article.content || ""
);

const category = computed(() =>
  props.article
    ? CATEGORIES.find((c: any) => c.slug === props.article.category)
    : null
);
const imageUrl = computed(() => {
  if (!props.article?.featuredImage) return null;
  return props.article.featuredImage.startsWith("http")
    ? props.article.featuredImage
    : `${getImageUrl(props.article.featuredImage, 800, 500)}&output=webp&quality=80`;
});

const categoryLabel = (catSlug: string) => {
  const map: Record<string, string> = {
    noticias: t("category_noticias"),
    entrevistas: t("category_entrevistas"),
    analises: t("category_analises"),
    "pesquisas-brasileiras": t("category_pesquisas"),
    exoplanetas: t("category_exoplanetas"),
    extremofilos: t("category_extremofilos"),
  };
  return map[catSlug] ?? catSlug;
};

// Temporary naive date formatter until utils are fully ported
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale.value, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<template>
  <template v-if="article">
    <article
      v-if="variant === 'featured'"
      :class="
        cn(
          'group relative overflow-hidden rounded-xl bg-card shadow-sm transition-shadow hover:shadow-md',
          props.class
        )
      "
    >
      <NuxtLink :to="localePath(`/artigos/${slug}`)" class="block">
        <div class="relative aspect-[16/9] overflow-hidden">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="article.featuredImageAlt || title"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            fetchpriority="high"
          />
          <div
            v-else
            class="flex h-full w-full items-center justify-center bg-muted"
          >
            <span class="text-4xl text-muted-foreground">🔭</span>
          </div>
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
          ></div>
          <div class="absolute bottom-0 left-0 right-0 p-6">
            <div v-if="category" class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground"
              >
                {{ categoryLabel(category.slug) }}
              </span>
            </div>
            <h2
              class="mt-3 text-2xl font-bold leading-tight text-white text-balance md:text-3xl font-serif"
            >
              {{ title }}
            </h2>
            <p class="mt-2 line-clamp-2 text-sm text-white/80">
              {{ excerpt }}
            </p>
            <div class="mt-4 flex items-center gap-4 text-xs text-white/70">
              <span>{{
                formatDate(article.publishedAt || article.$createdAt)
              }}</span>
              <span class="flex items-center gap-1">
                <Clock class="h-3 w-3" />
                <!-- reading time placeholder -->
                5 min
              </span>
            </div>
          </div>
        </div>
      </NuxtLink>
    </article>

    <article
      v-else-if="variant === 'compact'"
      :class="cn('group flex gap-4', props.class)"
    >
      <NuxtLink :to="localePath(`/artigos/${slug}`)" class="shrink-0">
        <div class="relative h-20 w-28 overflow-hidden rounded-lg">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="article.featuredImageAlt || title"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div
            v-else
            class="flex h-full w-full items-center justify-center bg-muted"
          >
            <span class="text-xl text-muted-foreground">🔭</span>
          </div>
        </div>
      </NuxtLink>
      <div class="flex flex-col justify-center">
        <NuxtLink :to="localePath(`/artigos/${slug}`)">
          <h3
            class="font-medium leading-snug text-foreground transition-colors group-hover:text-primary font-serif"
          >
            {{ title }}
          </h3>
        </NuxtLink>
        <div class="mt-1 flex flex-wrap items-center gap-2">
          <p class="text-xs text-muted-foreground">
            {{ formatDate(article.publishedAt || article.$createdAt) }}
          </p>
        </div>
      </div>
    </article>

    <article
      v-else
      :class="
        cn(
          'group overflow-hidden bg-white border border-slate-100 transition-all duration-500 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] hover:border-primary/20 flex flex-col h-full',
          props.class
        )
      "
    >
      <NuxtLink
        :to="localePath(`/artigos/${slug}`)"
        class="block overflow-hidden"
      >
        <div class="relative aspect-[16/10] overflow-hidden bg-slate-50">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="article.featuredImageAlt || title"
            class="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div v-else class="flex h-full w-full items-center justify-center">
            <span class="text-3xl grayscale opacity-30">🔭</span>
          </div>
          <div v-if="article.featured" class="absolute top-4 left-4">
            <span
              class="bg-accent text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 shadow-lg"
            >
              {{ $t("label_featured") }}
            </span>
          </div>
        </div>
      </NuxtLink>
      <div class="p-6 flex flex-col flex-1">
        <div v-if="category" class="mb-4 flex flex-wrap items-center gap-2">
          <NuxtLink
            :to="localePath(`/categorias/${category.slug}`)"
            class="text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:underline"
          >
            {{ categoryLabel(category.slug) }}
          </NuxtLink>
        </div>
        <NuxtLink
          :to="localePath(`/artigos/${slug}`)"
          class="group-hover:text-primary transition-colors duration-300"
        >
          <h3
            class="text-xl md:text-2xl font-bold leading-[1.15] text-slate-900 mb-4 font-serif group-hover:underline decoration-accent/30 decoration-2 underline-offset-4 transition-all"
          >
            {{ title }}
          </h3>
        </NuxtLink>
        <p
          class="text-slate-600 text-base leading-relaxed font-serif line-clamp-3 mb-8 italic"
        >
          {{ excerpt }}
        </p>

        <div
          class="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div
              class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
            >
              {{ formatDate(article.publishedAt || article.$createdAt) }}
            </div>
          </div>
          <div
            class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"
          >
            <Clock class="h-3 w-3" />
            <!-- reading time placeholder -->
            5 min
          </div>
        </div>
      </div>
    </article>
  </template>
</template>
