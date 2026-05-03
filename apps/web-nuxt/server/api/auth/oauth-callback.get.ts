import { Client, Account } from "node-appwrite";
import { setAppwriteSessionCookie } from "~/server/utils/session-cookie";
import { createAdminClient } from "~/server/utils/appwrite";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = typeof query.userId === "string" ? query.userId : null;
  const secret = typeof query.secret === "string" ? query.secret : null;

  if (!userId || !secret) {
    console.error("[oauth-callback] Missing userId or secret");
    return sendRedirect(event, "/admin/login?error=missing_credentials", 302);
  }

  try {
    // API Call #1: Create session using admin client
    const adminClient = createAdminClient();
    const session = await adminClient.account.createSession(userId, secret);

    console.log("[oauth-callback] Session created:", session.$id);

    // Set the session cookie for the browser
    setAppwriteSessionCookie(event, {
      expire: session.expire,
      secret: session.secret,
    });

    // API Call #2: Verify session by getting account info
    const client = new Client()
      .setEndpoint(useRuntimeConfig().public.appwriteEndpoint)
      .setProject(useRuntimeConfig().public.appwriteProjectId)
      .setSession(session.secret);

    const account = new Account(client);
    const user = await account.get();

    console.log("[oauth-callback] Session verified for user:", user.email);
    console.log("[oauth-callback] Redirecting to /admin/dashboard");
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? encodeURIComponent(err.message) : "unknown";
    console.error("[oauth-callback] createSession failed:", err);
    return sendRedirect(
      event,
      `/admin/login?error=session_creation_failed&detail=${msg}`,
      302
    );
  }

  return sendRedirect(event, "/admin/dashboard", 302);
});
