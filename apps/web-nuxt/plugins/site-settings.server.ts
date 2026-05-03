import { useSiteSettingsStore } from "~/stores/siteSettings";

export default defineNuxtPlugin(async () => {
  const store = useSiteSettingsStore();
  await store.fetchLayout().catch(() => {});
});
