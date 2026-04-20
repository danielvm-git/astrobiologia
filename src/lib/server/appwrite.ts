import { Client, Account, Databases, Storage } from 'node-appwrite';
import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';

export const SESSION_COOKIE = `a_session_${publicEnv.PUBLIC_APPWRITE_PROJECT_ID || 'default'}`;

/**
 * Creates an Appwrite client with admin privileges using the API Key.
 * Use this for administrative tasks that don't depend on a user session.
 */
export function createAdminClient() {
    const client = new Client()
        .setEndpoint(publicEnv.PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
        .setProject(publicEnv.PUBLIC_APPWRITE_PROJECT_ID || '')
        .setKey(privateEnv.APPWRITE_API_KEY || '');

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get storage() {
            return new Storage(client);
        }
    };
}

/**
 * Creates an Appwrite client for a specific user session.
 * Automatically attaches the session from the 'a_session' cookie if it exists.
 */
export function createSessionClient(event: { cookies: { get: (name: string) => string | undefined } }) {
    const client = new Client()
        .setEndpoint(publicEnv.PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
        .setProject(publicEnv.PUBLIC_APPWRITE_PROJECT_ID || '');

    let session = event.cookies.get(SESSION_COOKIE);
    
    // Fallback: If project-specific cookie is missing, try to find any cookie starting with a_session_
    if (!session && 'getAll' in event.cookies) {
        const allCookies = (event.cookies as any).getAll();
        const fallbackCookie = allCookies.find((c: any) => c.name.startsWith('a_session_'));
        if (fallbackCookie) {
            session = fallbackCookie.value;
        }
    }

    if (session) {
        client.setSession(session);
    }

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        }
    };
}

export const DATABASE_ID = publicEnv.PUBLIC_DATABASE_ID || '';
