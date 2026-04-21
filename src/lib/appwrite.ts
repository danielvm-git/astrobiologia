import { Client, Account, Databases, Storage, ID, Query, OAuthProvider } from 'appwrite';
import { env } from '$env/dynamic/public';

// Initialize Appwrite client
const client = new Client();

const endpoint = env.PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = env.PUBLIC_APPWRITE_PROJECT_ID || '';

client
	.setEndpoint(endpoint)
	.setProject(projectId);

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

/** Storage bucket for featured images / uploads (duplicate bucket in Console for E2E-only data if needed). */
export const STORAGE_BUCKET_ID = env.PUBLIC_STORAGE_BUCKET_ID || 'images';

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
    // Fallback fields for legacy support during migration
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
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

function pickTranslationForArticle(
	translations: ArticleTranslation[],
	preferredLanguage: string
): ArticleTranslation | undefined {
	if (translations.length === 0) return undefined;
	return (
		translations.find((t) => t.language === preferredLanguage) ||
		translations.find((t) => t.language === 'pt-br') ||
		translations.find((t) => t.language === 'en') ||
		translations[0]
	);
}

function joinTranslationsByArticle(
	articles: Article[],
	allTranslations: ArticleTranslation[],
	preferredLanguage: string
): Article[] {
	const byArticle = new Map<string, ArticleTranslation[]>();
	for (const t of allTranslations) {
		const list = byArticle.get(t.article_id) ?? [];
		list.push(t);
		byArticle.set(t.article_id, list);
	}
	return articles.map((article) => ({
		...article,
		translation: pickTranslationForArticle(byArticle.get(article.$id) ?? [], preferredLanguage)
	}));
}

/**
 * Fetches published articles. If a translation for the requested language exists, it is joined.
 * Otherwise picks pt-br, then en, then any available translation so cards never render empty titles.
 */
export async function getPublishedArticles(language = 'pt-br', limit = 20, offset = 0): Promise<Article[]> {
	// 1. Get published master articles first (source of truth for existence)
	const articlesResponse = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES, [
		Query.equal('status', 'published'),
		Query.orderDesc('publishedAt'),
		Query.limit(limit),
		Query.offset(offset)
	]);

	if (articlesResponse.total === 0) return [];

	const articles = articlesResponse.documents as unknown as Article[];
	const articleIds = articles.map(a => a.$id);

	const transResponse = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES_TRANSLATIONS, [
		Query.equal('article_id', articleIds)
	]);

	const translations = transResponse.documents as unknown as ArticleTranslation[];

	return joinTranslationsByArticle(articles, translations, language);
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
		Query.equal('article_id', articleIds)
	]);

	const translations = transResponse.documents as unknown as ArticleTranslation[];

	return joinTranslationsByArticle(articles, translations, language);
}

export async function getArticleBySlug(slug: string, language = 'pt-br'): Promise<Article | null> {
	// 1. Try to find translation by slug and language first
	const transResponse = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES_TRANSLATIONS, [
		Query.equal('slug', slug),
		Query.equal('language', language),
		Query.limit(1)
	]);

	if (transResponse.total > 0) {
        const translation = transResponse.documents[0] as unknown as ArticleTranslation;
        try {
            const article = await databases.getDocument(DATABASE_ID, COLLECTIONS.ARTICLES, translation.article_id) as unknown as Article;
            return {
                ...article,
                translation
            };
        } catch (e) {
            console.error('Failed to fetch master article for translation:', e);
        }
    }

    // 2. Fallback: Try to find by master slug (for legacy links or base language)
    const masterResponse = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES, [
        Query.equal('slug', slug),
        Query.limit(1)
    ]);

    if (masterResponse && masterResponse.total > 0) {
        const article = masterResponse.documents[0] as unknown as Article;
        const tResp = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES_TRANSLATIONS, [
            Query.equal('article_id', article.$id),
            Query.limit(100)
        ]);
        const allForArticle = tResp.documents as unknown as ArticleTranslation[];
        const translation = pickTranslationForArticle(allForArticle, language);

        return {
            ...article,
            translation
        };
    }

    return null;
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
		Query.equal('article_id', articleIds)
	]);

	const translations = transResponse.documents as unknown as ArticleTranslation[];

	return joinTranslationsByArticle(articles, translations, language);
}

export async function getAllArticles(): Promise<Article[]> {
	const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES, [
		Query.orderDesc('$createdAt'),
		Query.limit(100)
	]);
	return response.documents as unknown as Article[];
}

export async function searchPublishedArticles(
	searchTerm: string,
	language = 'pt-br',
	limit = 20
): Promise<Article[]> {
	const normalizedTerm = searchTerm.trim();
	if (!normalizedTerm) {
		return getPublishedArticles(language, limit);
	}

	const translationsById = new Map<string, ArticleTranslation>();

	const translationSearchFields: Array<keyof Pick<ArticleTranslation, 'title' | 'excerpt' | 'content'>> = [
		'title',
		'excerpt',
		'content'
	];

	for (const field of translationSearchFields) {
		try {
			const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES_TRANSLATIONS, [
				Query.equal('language', language),
				Query.search(field, normalizedTerm),
				Query.limit(limit)
			]);
			const docs = response.documents as unknown as ArticleTranslation[];
			for (const translation of docs) {
				if (!translationsById.has(translation.article_id)) {
					translationsById.set(translation.article_id, translation);
				}
			}
		} catch (error) {
			console.error(`Translation search failed on field ${field}:`, error);
		}
	}

	if (translationsById.size > 0) {
		const articleIds = Array.from(translationsById.keys());
		const masters = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES, [
			Query.equal('$id', articleIds),
			Query.equal('status', 'published'),
			Query.orderDesc('publishedAt'),
			Query.limit(limit)
		]);
		const masterArticles = masters.documents as unknown as Article[];
		return masterArticles.map((article) => ({
			...article,
			translation: translationsById.get(article.$id)
		}));
	}

	try {
		const fallback = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES, [
			Query.equal('status', 'published'),
			Query.search('title', normalizedTerm),
			Query.orderDesc('publishedAt'),
			Query.limit(limit)
		]);
		return fallback.documents as unknown as Article[];
	} catch (error) {
		console.error('Master article search failed:', error);
		return [];
	}
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
	const formData = new FormData();
	formData.append('file', file);

	const response = await fetch('/api/upload', {
		method: 'POST',
		body: formData
	});

	if (!response.ok) {
		const err = await response.json();
		throw new Error(err.error || 'Upload failed');
	}

	const data = await response.json();
	return data.fileId;
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
