export type LayoutType =
  | "grid"
  | "hero-grid"
  | "hero-sidebar"
  | "magazine"
  | "list";

export interface SiteSettings {
  layout: LayoutType;
}
