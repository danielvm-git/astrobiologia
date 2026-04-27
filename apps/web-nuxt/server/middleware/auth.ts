const logger = createLogger("AUTH-MIDDLEWARE");

export default defineEventHandler(async (event) => {
  // Skip internal Nuxt requests and static assets
  if (event.path.startsWith("/_nuxt/") || event.path.includes(".")) {
    return;
  }

  const { account } = createSessionClient(event);

  try {
    const user = await account.get();
    event.context.user = user;
    logger.debug("Session verified", { email: user.email, path: event.path });
  } catch (e: any) {
    // Only log if there was an attempt (cookie present)
    const config = useRuntimeConfig();
    const sessionCookie = getCookie(
      event,
      SESSION_COOKIE(config.public.appwriteProjectId)
    );

    if (sessionCookie) {
      logger.warn("Session verification failed", {
        message: e.message,
        path: event.path,
      });
    }
    event.context.user = null;
  }
});
