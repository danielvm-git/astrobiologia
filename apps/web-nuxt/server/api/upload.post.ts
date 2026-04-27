import { ID } from "node-appwrite";
import { createSessionClient } from "~/server/utils/appwrite";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, statusMessage: "Não autorizado" });
  }

  const formData = await readFormData(event);
  const file = formData.get("file") as File | null;

  if (!file) {
    throw createError({ statusCode: 400, statusMessage: "No file provided" });
  }

  const config = useRuntimeConfig();
  const { storage } = createSessionClient(event);
  const response = await storage.createFile(
    config.public.storageBucketId,
    ID.unique(),
    file
  );
  const imageUrl = storage
    .getFilePreview(config.public.storageBucketId, response.$id)
    .toString();

  return { success: true, fileId: response.$id, url: imageUrl };
});
