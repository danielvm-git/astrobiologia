import { AppwriteException } from "node-appwrite";
import { createAdminClient, getDatabaseId } from "~/server/utils/appwrite";
import type { LayoutType, SiteSettings } from "~/types/site-settings";

const VALID_LAYOUTS: LayoutType[] = [
  "grid",
  "hero-grid",
  "hero-sidebar",
  "magazine",
];

export default defineEventHandler(async (event): Promise<SiteSettings> => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const body = await readBody<Record<string, unknown>>(event);
  const layout = body?.layout as string;

  if (!VALID_LAYOUTS.includes(layout as LayoutType)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid layout value",
    });
  }

  const config = useRuntimeConfig();
  const { databases } = createAdminClient();
  const databaseId = getDatabaseId();
  const collectionId = config.public.siteSettingsCollectionId;

  try {
    await databases.createDocument(databaseId, collectionId, "global", {
      layout,
    });
  } catch (e) {
    if (e instanceof AppwriteException && e.code === 409) {
      await databases.updateDocument(databaseId, collectionId, "global", {
        layout,
      });
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to save layout",
      });
    }
  }

  return { layout: layout as LayoutType };
});
