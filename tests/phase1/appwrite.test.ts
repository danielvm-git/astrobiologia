import { describe, it, expect, vi } from 'vitest';

// Mock SvelteKit environment variables
vi.mock('$env/static/public', () => ({
    PUBLIC_APPWRITE_ENDPOINT: 'https://localhost/v1',
    PUBLIC_APPWRITE_PROJECT_ID: 'test-project'
}));

import * as appwrite from '../../src/lib/appwrite';

describe('Appwrite Client Initialization', () => {
    it('should export client components', () => {
        expect(appwrite.account).toBeDefined();
        expect(appwrite.databases).toBeDefined();
        expect(appwrite.storage).toBeDefined();
    });

    it('should have Article interface with SEO fields (compile-time check via property presence if possible, but here we check runtime exports if any)', () => {
        // Since Article is an interface, it's not present at runtime.
        // We can at least check if the constants are correct.
        expect(appwrite.DATABASE_ID).toBeDefined();
        expect(appwrite.COLLECTIONS.ARTICLES).toBe('articles');
    });

    it('should have categories defined', () => {
        expect(appwrite.CATEGORIES.length).toBeGreaterThan(0);
        expect(appwrite.CATEGORIES.some(c => c.$id === 'noticias')).toBe(true);
    });
});
