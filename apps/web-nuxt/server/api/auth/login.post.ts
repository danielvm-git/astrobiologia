import { createLogger } from "../../utils/logger";
import { createAdminClient } from "../../utils/appwrite";
import { setAppwriteSessionCookie } from "../../utils/session-cookie";

const log = createLogger("ADMIN-LOGIN-API");

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required.",
    });
  }

  try {
    const { account } = createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    // Save session in cookie
    setAppwriteSessionCookie(event, {
      expire: session.expire,
      secret: session.secret,
    });

    return { success: true };
  } catch (err: any) {
    log.error("Email login createEmailPasswordSession failed", err);
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }
});
