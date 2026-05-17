import { Client, Databases, Storage, Query, ID } from "node-appwrite";
import { getEnv } from "../apps/web-astro/src/lib/appwrite";

const ARTICLE_URLS = [
  "https://revistapesquisa.fapesp.br/fritz-muller-ganha-site-com-exposicao-virtual-e-books-e-artigos/",
  "https://revistapesquisa.fapesp.br/ameaca-imprevista-a-etnobotanica/",
  "https://revistapesquisa.fapesp.br/experimentos-avancam-na-manipulacao-das-interacoes-entre-ondas-acusticas-e-de-luz/",
  "https://revistapesquisa.fapesp.br/costa-ribeiro-descobriu-fontes-inesperadas-de-eletricidade/",
  "https://revistapesquisa.fapesp.br/atomos-gigantes-podem-ser-a-base-de-sensores-quanticos-mais-refinados/",
  "https://revistapesquisa.fapesp.br/cerveja-gelada-por-mais-tempo/",
  "https://revistapesquisa.fapesp.br/fenomeno-misterioso-da-agua-tambem-pode-ser-produzido-em-sistemas-quanticos/",
  "https://revistapesquisa.fapesp.br/o-ceu-visto-das-missoes/",
  "https://revistapesquisa.fapesp.br/as-raizes-da-fome/",
  "https://revistapesquisa.fapesp.br/morre-luiz-pinguelli-rosa-fisico-especialista-em-energia/",
  "https://www.comciencia.br/o-eclipse-de-1919-e-as-disputas-pela-ciencia/",
  "https://www.fcw.org.br/culturacientifica6/danilo-albergaria",
];

const client = new Client()
  .setEndpoint(getEnv("APPWRITE_ENDPOINT"))
  .setProject(getEnv("APPWRITE_PROJECT_ID"))
  .setKey(getEnv("APPWRITE_API_KEY"));

const databases = new Databases(client);
const storage = new Storage(client);
const dbId = getEnv("DATABASE_ID");
const articlesId = getEnv("ARTICLES_COLLECTION_ID");
const translationsId = getEnv("ARTICLE_TRANSLATIONS_COLLECTION_ID");
const bucketId = getEnv("STORAGE_BUCKET_ID");

async function purge() {
  console.log("Starting purge...");

  // 1. Purge Translations
  const trans = await databases.listDocuments(dbId, translationsId, [
    Query.limit(100),
  ]);
  for (const doc of trans.documents) {
    await databases.deleteDocument(dbId, translationsId, doc.$id);
  }

  // 2. Purge Articles
  const articles = await databases.listDocuments(dbId, articlesId, [
    Query.limit(100),
  ]);
  for (const doc of articles.documents) {
    await databases.deleteDocument(dbId, articlesId, doc.$id);
  }

  // 3. Purge Storage
  const files = await storage.listFiles(bucketId, [Query.limit(100)]);
  for (const file of files.files) {
    await storage.deleteFile(bucketId, file.$id);
  }

  console.log("Purge complete.");
}

interface MigrationArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  featured: boolean;
}

const REAL_ARTICLES: MigrationArticle[] = [
  // Sub-agent will populate this using web_fetch
];
