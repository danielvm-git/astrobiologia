import { AppwriteException } from "node-appwrite";
import { createAdminClient, getDatabaseId } from "~/server/utils/appwrite";
import { createLogger } from "~/server/utils/logger";
import type { LayoutType, SiteSettings } from "~/types/site-settings";

const logger = createLogger("SITE-SETTINGS-GET");
const VALID_LAYOUTS: LayoutType[] = [
  "grid",
  "hero-grid",
  "hero-sidebar",
  "magazine",
];
const DEFAULT: SiteSettings = { layout: "hero-grid" };

export default defineEventHandler(async (): Promise<SiteSettings> => {
  const config = useRuntimeConfig();
  const { databases } = createAdminClient();
  try {
    const doc = await databases.getDocument(
      getDatabaseId(),
      config.public.siteSettingsCollectionId,
      "global"
    );
    const layout = doc.layout as string;
    return VALID_LAYOUTS.includes(layout as LayoutType)
      ? { layout: layout as LayoutType }
      : DEFAULT;
  } catch (e) {
    if (e instanceof AppwriteException && e.code === 404) {
      return DEFAULT;
    }
    logger.error("Failed to fetch site settings", {
      error: (e as Error).message,
    });
    return DEFAULT;
  }
});
