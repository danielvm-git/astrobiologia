import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock SvelteKit environment variables
vi.mock('$env/static/public', () => ({
    PUBLIC_APPWRITE_ENDPOINT: 'https://cloud.appwrite.io/v1',
    PUBLIC_APPWRITE_PROJECT_ID: 'astrobiologia-portal'
}));

vi.mock('$env/dynamic/public', () => ({
    env: {
        PUBLIC_APPWRITE_ENDPOINT: 'https://cloud.appwrite.io/v1',
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
