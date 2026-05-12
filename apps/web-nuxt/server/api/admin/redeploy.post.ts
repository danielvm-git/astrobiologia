import { Client, Sites, VCSReferenceType } from "node-appwrite";
import { createLogger } from "~/server/utils/logger";

const logger = createLogger("REDEPLOY-API");

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const config = useRuntimeConfig();

  if (!config.appwriteSiteId) {
    throw createError({
      statusCode: 500,
      statusMessage: "NUXT_APPWRITE_SITE_ID is not configured",
    });
  }

  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId)
    .setKey(config.appwriteApiKey);

  const sites = new Sites(client);

  try {
    const deployment = await sites.createVcsDeployment(
      config.appwriteSiteId,
      VCSReferenceType.Branch,
      "main",
      true
    );
    logger.info("Redeploy triggered", { deploymentId: deployment.$id });
    return { deploymentId: deployment.$id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error("Redeploy failed", { error: msg });
    throw createError({ statusCode: 500, statusMessage: msg });
  }
});
