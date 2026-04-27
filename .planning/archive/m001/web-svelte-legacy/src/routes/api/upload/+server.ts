import { createSessionClient, DATABASE_ID } from "$lib/server/appwrite";
import { COLLECTIONS, STORAGE_BUCKET_ID } from "$lib/appwrite";
import { ID } from "node-appwrite";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
  try {
    const { storage } = createSessionClient(event);
    const formData = await event.request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return json({ error: "No file provided" }, { status: 400 });
    }

    const response = await storage.createFile(
      STORAGE_BUCKET_ID,
      ID.unique(),
      file
    );

    const imageUrl = storage
      .getFilePreview(STORAGE_BUCKET_ID, response.$id)
      .toString();

    return json({ success: true, fileId: response.$id, url: imageUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    if (error.code === 401) {
      return json(
        { error: "Não autorizado. Por favor, faça login novamente." },
        { status: 401 }
      );
    }
    return json({ error: "Falha ao enviar arquivo" }, { status: 500 });
  }
};
