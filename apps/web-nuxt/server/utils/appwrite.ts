import { Client, Account, Databases, Storage } from "node-appwrite";
import { createLogger } from "./logger";

const logger = createLogger("APPWRITE-SERVER");

export const SESSION_COOKIE = (projectId: string) => `a_session_${projectId}`;

export const CATEGORIES = [
  {
    $id: "noticias",
    name: "Notícias",
    slug: "noticias",
    description: "Últimas notícias sobre astrobiologia",
    color: "primary",
  },
  {
    $id: "entrevistas",
    name: "Entrevistas",
    slug: "entrevistas",
    description: "Conversas com cientistas e pesquisadores",
    color: "secondary",
  },
  {
    $id: "analises",
    name: "Análises",
    slug: "analises",
    description: "Análises profundas sobre temas científicos",
    color: "accent",
  },
  {
    $id: "pesquisas-brasileiras",
    name: "Pesquisas Brasileiras",
    slug: "pesquisas-brasileiras",
    description: "Destaque para a ciência feita no Brasil",
    color: "primary",
  },
  {
    $id: "exoplanetas",
    name: "Exoplanetas",
    slug: "exoplanetas",
    description: "Mundos além do Sistema Solar",
    color: "secondary",
  },
  {
    $id: "extremofilos",
    name: "Extremófilos",
    slug: "extremofilos",
    description: "Vida em condições extremas",
    color: "accent",
  },
];

export function getImageUrl(fileId: string, width = 800, height = 600): string {
  const config = useRuntimeConfig();
  if (!fileId) return "";
  if (fileId.startsWith("http")) return fileId;
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId);
  const storage = new Storage(client);
  return storage
    .getFilePreview(config.public.storageBucketId, fileId, width, height)
    .toString();
}

/**
 * Creates an Appwrite client with admin privileges using the API Key.
 */
export function createAdminClient() {
  const config = useRuntimeConfig();
  logger.debug("Creating Admin Client");

  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId)
    .setKey(config.appwriteApiKey);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
}

/**
 * Creates an Appwrite client for a specific user session.
 */
export function createSessionClient(event: any) {
  const config = useRuntimeConfig();
  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId);

  const session = getCookie(
    event,
    SESSION_COOKIE(config.public.appwriteProjectId)
  );

  if (session) {
    logger.debug("Creating Session Client with session cookie");
    client.setSession(session);
  } else {
    logger.debug("Creating Session Client without session");
  }

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
}

export const getDatabaseId = () => useRuntimeConfig().public.databaseId;
