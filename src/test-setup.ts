import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Mock SvelteKit environment variables
vi.mock('$env/static/public', () => ({
	PUBLIC_APPWRITE_ENDPOINT: 'https://nyc.cloud.appwrite.io/v1',
	PUBLIC_APPWRITE_PROJECT_ID: 'astrobiologia-portal',
	PUBLIC_DATABASE_ID: '69e464fb0006a1b3c4eb',
	PUBLIC_ARTICLES_COLLECTION_ID: 'articles',
	PUBLIC_ARTICLES_TRANSLATIONS_COLLECTION_ID: 'article_translations',
	PUBLIC_CATEGORIES_COLLECTION_ID: 'categories',
	PUBLIC_STORAGE_BUCKET_ID: 'images'
}));

vi.mock('$env/dynamic/public', () => ({
	env: {
		PUBLIC_APPWRITE_ENDPOINT: 'https://nyc.cloud.appwrite.io/v1',
		PUBLIC_APPWRITE_PROJECT_ID: 'astrobiologia-portal',
		PUBLIC_DATABASE_ID: '69e464fb0006a1b3c4eb',
		PUBLIC_ARTICLES_COLLECTION_ID: 'articles',
		PUBLIC_ARTICLES_TRANSLATIONS_COLLECTION_ID: 'article_translations',
		PUBLIC_CATEGORIES_COLLECTION_ID: 'categories',
		PUBLIC_STORAGE_BUCKET_ID: 'images'
	}
}));

// Mock $app/environment
vi.mock('$app/environment', () => ({
    browser: false,
    dev: true,
    building: false,
    version: 'any'
}));

import { appwriteMockImplementation } from '../tests/mocks/appwrite';

// Global Appwrite mock
vi.mock('appwrite', () => appwriteMockImplementation);
vi.mock('node-appwrite', () => appwriteMockImplementation);

// Standardize mock clearing
beforeEach(() => {
    vi.clearAllMocks();
});
