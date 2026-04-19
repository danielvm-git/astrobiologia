import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock SvelteKit environment variables
vi.mock('$env/static/public', () => ({
    PUBLIC_APPWRITE_ENDPOINT: 'https://nyc.cloud.appwrite.io/v1',
    PUBLIC_APPWRITE_PROJECT_ID: 'astrobiologia-portal',
    PUBLIC_DATABASE_ID: '69e464fb0006a1b3c4eb',
    PUBLIC_ARTICLES_COLLECTION_ID: 'articles'
}));

vi.mock('$env/dynamic/public', () => ({
    env: {
        PUBLIC_APPWRITE_ENDPOINT: 'https://nyc.cloud.appwrite.io/v1',
        PUBLIC_APPWRITE_PROJECT_ID: 'astrobiologia-portal'
    }
}));

// Mock $app/environment
vi.mock('$app/environment', () => ({
    browser: false,
    dev: true,
    building: false,
    version: 'any'
}));
