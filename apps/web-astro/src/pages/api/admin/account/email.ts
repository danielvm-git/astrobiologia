import type { APIRoute } from "astro";
import { AppwriteException } from "node-appwrite";
import { createSessionClient } from "../../../../lib/appwrite";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const PATCH: APIRoute = async ({ locals, request }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  let body: { email: string; password: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { email, password } = body;
  if (!email || !password)
    return json({ error: "Campos obrigatórios ausentes." }, 400);

  try {
    const { account } = createSessionClient(request);
    await account.updateEmail(email, password);
    return json({ success: true });
  } catch (err: unknown) {
    if (err instanceof AppwriteException && err.code === 409)
      return json({ error: "Este e-mail já está em uso." }, 409);
    return json({ error: "Erro ao atualizar e-mail." }, 400);
  }
};
