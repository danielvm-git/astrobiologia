import type { APIRoute } from "astro";
import { clearSessionCookie, createSessionClient } from "../../../lib/appwrite";

export const POST: APIRoute = async ({ request }) => {
  const isHttps =
    request.headers.get("x-forwarded-proto") === "https" ||
    new URL(request.url).protocol === "https:";

  try {
    const { account } = createSessionClient(request);
    await account.deleteSession("current");
  } catch {
    // Session already invalid — still clear the cookie
  }

  const headers = new Headers({ "Content-Type": "application/json" });
  clearSessionCookie(headers, isHttps);
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers,
  });
};
