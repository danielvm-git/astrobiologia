import type { APIRoute } from "astro";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { createSessionClient, getEnv } from "../../lib/appwrite";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user) return json({ error: "Não autorizado" }, 401);

  const { storage } = createSessionClient(request);
  const BUCKET = getEnv("STORAGE_BUCKET_ID");

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return json({ error: "No file provided" }, 400);
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const input = InputFile.fromBuffer(buffer, file.name || "upload.bin");
    const created = await storage.createFile(BUCKET, ID.unique(), input);
    const url = `${getEnv("APPWRITE_ENDPOINT")}/storage/buckets/${BUCKET}/files/${created.$id}/preview?project=${getEnv("APPWRITE_PROJECT_ID")}`;
    return json({ success: true, fileId: created.$id, url });
  } catch {
    return json({ error: "Falha ao enviar arquivo" }, 500);
  }
};
