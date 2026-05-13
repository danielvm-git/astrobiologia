import type { APIRoute } from "astro";
import { createSessionClient } from "../../../../lib/appwrite";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const PATCH: APIRoute = async ({ locals, request }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  let body: { password: string; oldPassword: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { password, oldPassword } = body;
  if (!password || !oldPassword)
    return json({ error: "Campos obrigatórios ausentes." }, 400);

  try {
    const { account } = createSessionClient(request);
    await account.updatePassword(password, oldPassword);
    return json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao atualizar senha.";
    return json({ error: msg }, 400);
  }
};
