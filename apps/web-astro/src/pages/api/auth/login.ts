import type { APIRoute } from "astro";
import { createAdminClient, setSessionCookie } from "../../../lib/appwrite";

export const POST: APIRoute = async ({ request }) => {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { email, password } = body;
  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { account } = createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    const isHttps =
      request.headers.get("x-forwarded-proto") === "https" ||
      new URL(request.url).protocol === "https:";
    const headers = new Headers({ "Content-Type": "application/json" });
    setSessionCookie(headers, session.secret, session.expire, isHttps);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers,
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
};
