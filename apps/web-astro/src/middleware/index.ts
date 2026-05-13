import { defineMiddleware } from "astro:middleware";
import { createSessionClient } from "../lib/appwrite";

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.user = null;
  try {
    const { account, hasSession } = createSessionClient(context.request);
    if (hasSession) {
      context.locals.user = await account.get();
    }
  } catch {
    // Session invalid — user stays null
  }
  return next();
});
