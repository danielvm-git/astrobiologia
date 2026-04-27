import { createAdminClient } from "~/server/utils/appwrite";
import { setAppwriteSessionCookie } from "~/server/utils/session-cookie";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = typeof query.userId === "string" ? query.userId : null;
  const secret = typeof query.secret === "string" ? query.secret : null;

  if (!userId || !secret) {
    return sendRedirect(event, "/admin/login?error=missing_credentials", 302);
  }

  try {
    const { account } = createAdminClient();
    const session = await account.createSession({ userId, secret });
    setAppwriteSessionCookie(event, {
      expire: session.expire,
      secret: session.secret,
    });
  } catch {
    return sendRedirect(
      event,
      "/admin/login?error=session_creation_failed",
      302
    );
  }

  return sendRedirect(event, "/admin/dashboard", 302);
});
