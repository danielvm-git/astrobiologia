import { computed, markRaw } from "vue";
import { storeToRefs } from "pinia";
import { useSiteSettingsStore } from "~/stores/siteSettings";
import type { LayoutType } from "~/types/site-settings";
import GridLayout from "~/components/layouts/GridLayout.vue";
import HeroGridLayout from "~/components/layouts/HeroGridLayout.vue";
import HeroSidebarLayout from "~/components/layouts/HeroSidebarLayout.vue";
import MagazineLayout from "~/components/layouts/MagazineLayout.vue";
import ListLayout from "~/components/layouts/ListLayout.vue";

const map: Record<LayoutType, object> = {
  grid: markRaw(GridLayout),
  "hero-grid": markRaw(HeroGridLayout),
  "hero-sidebar": markRaw(HeroSidebarLayout),
  magazine: markRaw(MagazineLayout),
  list: markRaw(ListLayout),
};

export function useLayoutComponent() {
  const { layout } = storeToRefs(useSiteSettingsStore());
  return computed(() => map[layout.value]);
}
