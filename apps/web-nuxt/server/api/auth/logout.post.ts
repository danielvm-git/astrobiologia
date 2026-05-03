import { createLogger } from "../../utils/logger";
import { SESSION_COOKIE } from "../../utils/appwrite";

const log = createLogger("ADMIN-LOGOUT-API");

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const cookieName = SESSION_COOKIE(config.public.appwriteProjectId);

    // Delete cookie to clear session
    deleteCookie(event, cookieName, { path: "/" });

    // Optional: you could call account.deleteSession('current') here
    // if using createSessionClient, but deleting the cookie is enough to log them out locally
    return { success: true };
  } catch (err: any) {
    log.error("Logout failed", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to logout",
    });
  }
});
