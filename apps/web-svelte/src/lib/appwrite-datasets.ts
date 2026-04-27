import { Account, Client, Databases, Storage } from 'appwrite';
import { env } from '$env/dynamic/public';

const client = new Client();

const endpoint = env.PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = env.PUBLIC_APPWRITE_PROJECT_ID || '';

client.setEndpoint(endpoint).setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = env.PUBLIC_DATABASE_ID || '';
export const COLLECTIONS = {
	ARTICLES: env.PUBLIC_ARTICLES_COLLECTION_ID || 'articles',
	ARTICLES_TRANSLATIONS:
		env.PUBLIC_ARTICLES_TRANSLATIONS_COLLECTION_ID || 'article_translations',
	CATEGORIES: env.PUBLIC_CATEGORIES_COLLECTION_ID || 'categories'
} as const;

export const STORAGE_BUCKET_ID = env.PUBLIC_STORAGE_BUCKET_ID || 'images';
