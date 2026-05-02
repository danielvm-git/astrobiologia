import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { createSessionClient } from "~/server/utils/appwrite";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Não autorizado. Por favor, faça login novamente.",
    });
  }

  const config = useRuntimeConfig();
  const { storage } = createSessionClient(event);

  const formData = await readMultipartFormData(event);
  const filePart = formData?.find((part) => part.name === "file");
  if (!filePart?.data?.length) {
    throw createError({ statusCode: 400, statusMessage: "No file provided" });
  }

  try {
    const input = InputFile.fromBuffer(
      filePart.data,
      filePart.filename || "upload.bin"
    );

    const created = await storage.createFile(
      config.public.storageBucketId,
      ID.unique(),
      input
    );

    const url = storage
      .getFilePreview(config.public.storageBucketId, created.$id)
      .toString();

    return { success: true, fileId: created.$id, url };
  } catch {
    throw createError({ statusCode: 500, statusMessage: "Falha ao enviar arquivo" });
  }
});
