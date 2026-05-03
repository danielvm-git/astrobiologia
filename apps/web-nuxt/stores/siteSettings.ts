import { defineStore } from "pinia";
import type { LayoutType, SiteSettings } from "~/types/site-settings";

export const useSiteSettingsStore = defineStore("siteSettings", () => {
  const layout = ref<LayoutType>("hero-grid");

  async function fetchLayout() {
    const data = await $fetch<SiteSettings>("/api/site-settings");
    layout.value = data.layout;
  }

  async function setLayout(newLayout: LayoutType) {
    await $fetch("/api/admin/site-settings", {
      method: "POST",
      body: { layout: newLayout },
    });
    layout.value = newLayout;
  }

  return { layout, fetchLayout, setLayout };
});
