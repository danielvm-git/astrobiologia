import { Client, Account, Databases, Storage, ID, Query, OAuthProvider } from 'appwrite';
import {
	PUBLIC_APPWRITE_ENDPOINT,
	PUBLIC_APPWRITE_PROJECT_ID,
	PUBLIC_DATABASE_ID,
	PUBLIC_ARTICLES_COLLECTION_ID
} from '$env/static/public';

// Initialize Appwrite client
const client = new Client();

client
	.setEndpoint(PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
	.setProject(PUBLIC_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and collection IDs
export const DATABASE_ID = PUBLIC_DATABASE_ID || '69e464fb0006a1b3c4eb';
export const COLLECTIONS = {
	ARTICLES: PUBLIC_ARTICLES_COLLECTION_ID || 'articles',
	ARTICLES_TRANSLATIONS: 'article_translations',
	CATEGORIES: 'categories'
} as const;

export const STORAGE_BUCKET_ID = 'images';

// Types
export interface User {
	$id: string;
	email: string;
	name: string;
	labels?: string[];
}

export interface ArticleTranslation {
	$id: string;
	article_id: string;
	language: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	metaTitle?: string;
	metaDescription?: string;
}

export interface Article {
	$id: string;
	$createdAt: string;
	$updatedAt: string;
	category: string;
	tags: string[];
	featuredImage?: string;
	featuredImageAlt?: string;
	status: 'draft' | 'published';
	featured: boolean;
	authorId: string;
	authorName: string;
	publishedAt?: string;
	ogImage?: string;
	language?: string; // Legacy fallback
	// Joined translation data
	translation?: ArticleTranslation;
}

export interface Category {
	$id: string;
	name: string;
	slug: string;
	description: string;
	color: string;
}

// Auth helpers
export async function getCurrentUser(): Promise<User | null> {
	try {
		const user = await account.get();
		return user as User;
	} catch {
		return null;
	}
}

export async function login(email: string, password: string): Promise<User> {
	await account.createEmailPasswordSession(email, password);
	return await account.get() as User;
}

export async function logout(): Promise<void> {
	await account.deleteSession('current');
}

// Article helpers

/**
 * Fetches published articles with translations for a specific language.
 */
export async function getPublishedArticles(language = 'pt-br', limit = 20, offset = 0): Promise<Article[]> {
	// 1. Get translations for the language
	const transResponse = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES_TRANSLATIONS, [
		Query.equal('language', language),
		Query.limit(limit),
		Query.offset(offset)
	]);

	if (transResponse.total === 0) return [];

	const translations = transResponse.documents as unknown as ArticleTranslation[];
	const articleIds = translations.map(t => t.article_id);

	// 2. Get master articles for these translations
	const articlesResponse = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES, [
		Query.equal('$id', articleIds),
		Query.equal('status', 'published'),
		Query.orderDesc('publishedAt')
	]);

	const articles = articlesResponse.documents as unknown as Article[];

	// 3. Join
	return articles.map(article => ({
		...article,
		translation: translations.find(t => t.article_id === article.$id)
	})).filter(a => a.translation);
}

export async function getFeaturedArticles(language = 'pt-br', limit = 5): Promise<Article[]> {
	const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES, [
		Query.equal('status', 'published'),
		Query.equal('featured', true),
		Query.orderDesc('publishedAt'),
		Query.limit(limit)
	]);

	const articles = response.documents as unknown as Article[];
	if (articles.length === 0) return [];

	const articleIds = articles.map(a => a.$id);
	const transResponse = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES_TRANSLATIONS, [
		Query.equal('article_id', articleIds),
		Query.equal('language', language)
	]);

	const translations = transResponse.documents as unknown as ArticleTranslation[];

	return articles.map(article => ({
		...article,
		translation: translations.find(t => t.article_id === article.$id)
	})).filter(a => a.translation);
}

export async function getArticleBySlug(slug: string, language = 'pt-br'): Promise<Article | null> {
	// 1. Find translation by slug and language
	const transResponse = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES_TRANSLATIONS, [
		Query.equal('slug', slug),
		Query.equal('language', language),
		Query.limit(1)
	]);

	if (transResponse.total === 0) return null;

	const translation = transResponse.documents[0] as unknown as ArticleTranslation;

	// 2. Get master article
	try {
		const article = await databases.getDocument(DATABASE_ID, COLLECTIONS.ARTICLES, translation.article_id) as unknown as Article;
		return {
			...article,
			translation
		};
	} catch (e) {
		console.error('Failed to fetch master article:', e);
		return null;
	}
}

export async function getArticlesByCategory(category: string, language = 'pt-br', limit = 20): Promise<Article[]> {
	const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES, [
		Query.equal('status', 'published'),
		Query.equal('category', category),
		Query.orderDesc('publishedAt'),
		Query.limit(limit)
	]);

	const articles = response.documents as unknown as Article[];
	if (articles.length === 0) return [];

	const articleIds = articles.map(a => a.$id);
	const transResponse = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES_TRANSLATIONS, [
		Query.equal('article_id', articleIds),
		Query.equal('language', language)
	]);

	const translations = transResponse.documents as unknown as ArticleTranslation[];

	return articles.map(article => ({
		...article,
		translation: translations.find(t => t.article_id === article.$id)
	})).filter(a => a.translation);
}

export async function getAllArticles(): Promise<Article[]> {
	const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES, [
		Query.orderDesc('$createdAt'),
		Query.limit(100)
	]);
	return response.documents as unknown as Article[];
}

/**
 * Fetches all translations for a specific article.
 */
export async function getArticleTranslations(articleId: string): Promise<ArticleTranslation[]> {
	const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES_TRANSLATIONS, [
		Query.equal('article_id', articleId)
	]);
	return response.documents as unknown as ArticleTranslation[];
}

export async function createArticle(data: Omit<Article, '$id' | '$createdAt' | '$updatedAt' | 'translation'>): Promise<Article> {
	const response = await databases.createDocument(
		DATABASE_ID,
		COLLECTIONS.ARTICLES,
		ID.unique(),
		data
	);
	return response as unknown as Article;
}

export async function createTranslation(data: Omit<ArticleTranslation, '$id'>): Promise<ArticleTranslation> {
	const response = await databases.createDocument(
		DATABASE_ID,
		COLLECTIONS.ARTICLES_TRANSLATIONS,
		ID.unique(),
		data
	);
	return response as unknown as ArticleTranslation;
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<Article> {
	const { translation, ...masterData } = data;
	const response = await databases.updateDocument(
		DATABASE_ID,
		COLLECTIONS.ARTICLES,
		id,
		masterData
	);
	return response as unknown as Article;
}

export async function updateTranslation(id: string, data: Partial<ArticleTranslation>): Promise<ArticleTranslation> {
	const response = await databases.updateDocument(
		DATABASE_ID,
		COLLECTIONS.ARTICLES_TRANSLATIONS,
		id,
		data
	);
	return response as unknown as ArticleTranslation;
}

export async function deleteArticle(id: string): Promise<void> {
	// 1. Delete all translations
	const trans = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES_TRANSLATIONS, [
		Query.equal('article_id', id)
	]);
	for (const t of trans.documents) {
		await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ARTICLES_TRANSLATIONS, t.$id);
	}
	// 2. Delete master
	await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ARTICLES, id);
}

// Image helpers
export function getImageUrl(fileId: string, width = 800, height = 600): string {
	if (!fileId) return '';
	if (fileId.startsWith('http')) return fileId;
	return storage.getFilePreview(STORAGE_BUCKET_ID, fileId, width, height).toString();
}

export async function uploadImage(file: File): Promise<string> {
	const response = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), file);
	return response.$id;
}

export async function deleteImage(fileId: string): Promise<void> {
	await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
}

// Categories (static for now, can be moved to DB later)
export const CATEGORIES: Category[] = [
	{ $id: 'noticias', name: 'Notícias', slug: 'noticias', description: 'Últimas notícias sobre astrobiologia', color: 'primary' },
	{ $id: 'entrevistas', name: 'Entrevistas', slug: 'entrevistas', description: 'Conversas com cientistas e pesquisadores', color: 'secondary' },
	{ $id: 'analises', name: 'Análises', slug: 'analises', description: 'Análises profundas sobre temas científicos', color: 'accent' },
	{ $id: 'pesquisas-brasileiras', name: 'Pesquisas Brasileiras', slug: 'pesquisas-brasileiras', description: 'Destaque para a ciência feita no Brasil', color: 'primary' },
	{ $id: 'exoplanetas', name: 'Exoplanetas', slug: 'exoplanetas', description: 'Mundos além do Sistema Solar', color: 'secondary' },
	{ $id: 'extremofilos', name: 'Extremófilos', slug: 'extremofilos', description: 'Vida em condições extremas', color: 'accent' }
];

export { ID, Query, OAuthProvider };
