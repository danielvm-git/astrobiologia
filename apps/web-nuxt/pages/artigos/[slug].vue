<script setup lang="ts">
import { Calendar, Clock, Share2 } from "lucide-vue-next";
import { getImageUrl } from "~/server/utils/appwrite";
import { shouldShowTranslationFallbackBadge } from "~/server/utils/locale";
import { readingTime } from "~/lib/utils";

const { locale, t } = useI18n();
const route = useRoute();
type ArticleDetailsResponse = { article: any; relatedArticles: any[] };

const { data, error } = await useAsyncData<ArticleDetailsResponse>(
  `article-${route.params.slug}-${locale.value}`,
  () =>
    fetch(
      `/api/articles/${route.params.slug}?locale=${encodeURIComponent(locale.value)}`
    ).then((response) => response.json())
);

if (error.value || !data.value?.article) {
  throw createError({ statusCode: 404, statusMessage: "Article not found" });
}

const article = computed(() => data.value?.article as any);
const relatedArticles = computed(() => data.value?.relatedArticles ?? []);
const translation = computed(() => article.value.translation);
const title = computed(
  () => translation.value?.title || article.value.title || ""
);
const excerpt = computed(
  () => translation.value?.excerpt || article.value.excerpt || ""
);
const content = computed(
  () => translation.value?.content || article.value.content || ""
);
const slug = computed(
  () => translation.value?.slug || article.value.slug || route.params.slug
);
const imageUrl = computed(() => {
  if (!article.value.featuredImage) return null;
  return article.value.featuredImage.startsWith("http")
    ? article.value.featuredImage
    : `${getImageUrl(article.value.featuredImage, 1200, 630)}&output=webp&quality=85`;
});
const showFallbackBadge = computed(() =>
  shouldShowTranslationFallbackBadge(locale.value, translation.value)
);

const formattedDate = computed(() =>
  new Date(
    article.value.publishedAt || article.value.$createdAt
  ).toLocaleDateString(locale.value)
);

const siteBase = "https://astrobiologia.com.br";
const localeRouteCodes = ["pt-br", "en", "es", "ja", "nl", "zh"] as const;
const hreflangForCode = (code: string) => {
  if (code === "pt-br") return "pt-BR";
  if (code === "zh") return "zh-Hans";
  return code;
};

const hreflangLinks = computed(() =>
  localeRouteCodes.map((code) => ({
    rel: "alternate" as const,
    href: `${siteBase}${code === "pt-br" ? "" : `/${code}`}/artigos/${slug.value}`,
    hreflang: hreflangForCode(code),
  }))
);

useHead({ link: hreflangLinks });

useSeoMeta({
  title,
  description: excerpt,
  ogTitle: title,
  ogDescription: excerpt,
  ogType: "article",
});

async function shareArticle() {
  if (navigator.share) {
    await navigator.share({
      title: title.value,
      text: excerpt.value,
      url: window.location.href,
    });
  }
}
</script>

<template>
  <main class="min-h-screen bg-background">
    <div
      class="relative overflow-hidden border-b border-slate-100 bg-white pb-16 pt-24 md:pb-24 md:pt-32"
    >
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <span
          v-if="showFallbackBadge"
          class="mb-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700"
          >{{ t("article_missing_locale_badge") }}</span
        >
        <h1
          class="mb-6 text-4xl font-black leading-tight text-slate-900 md:text-6xl"
        >
          {{ title }}
        </h1>
        <p class="mb-10 text-xl italic text-slate-600">{{ excerpt }}</p>
        <div
          class="flex flex-wrap items-center gap-6 text-xs uppercase tracking-widest text-slate-500"
        >
          <span class="flex items-center gap-2"
            ><Calendar class="h-3.5 w-3.5" />{{ formattedDate }}</span
          >
          <span class="flex items-center gap-2"
            ><Clock class="h-3.5 w-3.5" />{{
              t("reading_time", { minutes: readingTime(content) })
            }}</span
          >
        </div>
      </div>
    </div>

    <div v-if="imageUrl" class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <img
        :src="imageUrl"
        :alt="article.featuredImageAlt || title"
        class="w-full object-cover"
      />
    </div>

    <article
      class="prose prose-astro mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8"
      v-html="content"
    ></article>

    <section
      v-if="relatedArticles.length"
      class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <h2 class="mb-6 text-xl font-bold">{{ t("continue_exploring") }}</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ArticleCard
          v-for="item in relatedArticles"
          :key="item.$id"
          :article="item"
          variant="compact"
        />
      </div>
    </section>

    <div class="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
      <button
        @click="shareArticle"
        class="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary"
      >
        <Share2 class="h-4 w-4" />{{ t("share") }}
      </button>
    </div>
  </main>
</template>
