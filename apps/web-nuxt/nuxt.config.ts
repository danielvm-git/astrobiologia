// https://nuxt.com/docs/api/configuration/nuxt-config
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  modules: ["@nuxtjs/i18n", "@pinia/nuxt"],
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  },
  i18n: {
    vueI18n: "./i18n.config.ts",
    locales: [
      {
        code: "pt-br",
        language: "pt-BR",
        file: "pt-br.json",
        name: "Português",
      },
      { code: "en", language: "en-US", file: "en.json", name: "English" },
      { code: "es", language: "es-ES", file: "es.json", name: "Español" },
      { code: "ja", language: "ja-JP", file: "ja.json", name: "日本語" },
      { code: "nl", language: "nl-NL", file: "nl.json", name: "Nederlands" },
      { code: "zh", language: "zh-CN", file: "zh.json", name: "中文" },
    ],
    defaultLocale: "pt-br",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },
  runtimeConfig: {
    appwriteApiKey: "", // Default empty, set via APPWRITE_API_KEY env
    public: {
      appwriteEndpoint: "https://cloud.appwrite.io/v1",
      appwriteProjectId: "",
      databaseId: "",
      articlesCollectionId: "",
      articleTranslationsCollectionId: "",
      categoriesCollectionId: "",
      storageBucketId: "",
      siteSettingsCollectionId: "", // env: NUXT_PUBLIC_SITE_SETTINGS_COLLECTION_ID
    },
  },
  vite: {
    build: {
      sourcemap: true,
    },
    plugins: [
      {
        name: "stub-fs-root-node-modules-vue",
        enforce: "pre",
        resolveId(id) {
          if (id.startsWith("/node_modules/") && id.endsWith(".vue")) {
            return `\0stub-root-vue:${id}`;
          }
          return undefined;
        },
        load(id) {
          if (id.startsWith("\0stub-root-vue:")) {
            return '<template><span /></template>\n<script setup lang="ts"></script>\n';
          }
          return undefined;
        },
      },
      {
        name: "suppress-tailwind-css-warnings",
        apply: "serve",
        configResolved(config) {
          const originalWarn = config.logger.warn;
          config.logger.warn = (msg, options) => {
            if (
              typeof msg === "string" &&
              msg.includes("[vite:css][postcss]") &&
              msg.includes("Parse error") &&
              msg.includes("--value(")
            ) {
              return;
            }
            originalWarn(msg, options);
          };
        },
      },
    ],
    resolve: {
      alias: {
        "#app-manifest": resolve(configDir, "lib/empty-app-manifest.mjs"),
      },
    },
  },
});
