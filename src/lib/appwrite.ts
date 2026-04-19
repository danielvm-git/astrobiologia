import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';

// Initialize Appwrite client
const client = new Client();

client
	.setEndpoint(PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
	.setProject(PUBLIC_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and collection IDs
export const DATABASE_ID = 'astrobiologia';
export const COLLECTIONS = {
	ARTICLES: 'articles',
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

export interface Article {
	$id: string;
	$createdAt: string;
	$updatedAt: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	category: string;
	tags: string[];
	featuredImage?: string;
	featuredImageAlt?: string;
	status: 'draft' | 'published';
	featured: boolean;
	authorId: string;
	authorName: string;
	publishedAt?: string;
	metaTitle?: string;
	metaDescription?: string;
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
export async function getPublishedArticles(limit = 20, offset = 0): Promise<Article[]> {
	const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES, [
		Query.equal('status', 'published'),
		Query.orderDesc('publishedAt'),
		Query.limit(limit),
		Query.offset(offset)
	]);
	return response.documents as unknown as Article[];
}

export async function getFeaturedArticles(limit = 5): Promise<Article[]> {
	const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES, [
		Query.equal('status', 'published'),
		Query.equal('featured', true),
		Query.orderDesc('publishedAt'),
		Query.limit(limit)
	]);
	return response.documents as unknown as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
	const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES, [
		Query.equal('slug', slug),
		Query.limit(1)
	]);
	return response.documents[0] as unknown as Article || null;
}

export async function getArticlesByCategory(category: string, limit = 20): Promise<Article[]> {
	const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES, [
		Query.equal('status', 'published'),
		Query.equal('category', category),
		Query.orderDesc('publishedAt'),
		Query.limit(limit)
	]);
	return response.documents as unknown as Article[];
}

export async function getAllArticles(): Promise<Article[]> {
	const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES, [
		Query.orderDesc('$createdAt'),
		Query.limit(100)
	]);
	return response.documents as unknown as Article[];
}

export async function createArticle(data: Omit<Article, '$id' | '$createdAt' | '$updatedAt'>): Promise<Article> {
	const response = await databases.createDocument(
		DATABASE_ID,
		COLLECTIONS.ARTICLES,
		ID.unique(),
		data
	);
	return response as unknown as Article;
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<Article> {
	const response = await databases.updateDocument(
		DATABASE_ID,
		COLLECTIONS.ARTICLES,
		id,
		data
	);
	return response as unknown as Article;
}

export async function deleteArticle(id: string): Promise<void> {
	await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ARTICLES, id);
}

// Image helpers
export function getImageUrl(fileId: string, width = 800, height = 600): string {
	if (!fileId) return '';
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
	{ $id: '1', name: 'Exoplanetas', slug: 'exoplanetas', description: 'Mundos além do Sistema Solar', color: 'primary' },
	{ $id: '2', name: 'Extremófilos', slug: 'extremofilos', description: 'Vida em condições extremas', color: 'secondary' },
	{ $id: '3', name: 'Origem da Vida', slug: 'origem-da-vida', description: 'Como a vida surgiu na Terra', color: 'accent' },
	{ $id: '4', name: 'Missões Espaciais', slug: 'missoes-espaciais', description: 'Explorando o cosmos', color: 'primary' },
	{ $id: '5', name: 'SETI', slug: 'seti', description: 'Busca por inteligência extraterrestre', color: 'secondary' },
	{ $id: '6', name: 'Biossinaturas', slug: 'biossinaturas', description: 'Sinais de vida no universo', color: 'accent' }
];

export { ID, Query };
