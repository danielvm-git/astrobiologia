import { Client, Account, Databases, Storage } from 'node-appwrite';
import { 
    PUBLIC_APPWRITE_ENDPOINT, 
    PUBLIC_APPWRITE_PROJECT_ID,
    PUBLIC_DATABASE_ID
} from '$env/static/public';
import { APPWRITE_API_KEY } from '$env/static/private';

export const SESSION_COOKIE = 'a_session';

/**
 * Creates an Appwrite client with admin privileges using the API Key.
 * Use this for administrative tasks that don't depend on a user session.
 */
export function createAdminClient() {
    const client = new Client()
        .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
        .setProject(PUBLIC_APPWRITE_PROJECT_ID)
        .setKey(APPWRITE_API_KEY);

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
        .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
        .setProject(PUBLIC_APPWRITE_PROJECT_ID);

    const session = event.cookies.get(SESSION_COOKIE);
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

export const DATABASE_ID = PUBLIC_DATABASE_ID;
