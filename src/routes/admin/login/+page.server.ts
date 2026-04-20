import { createAdminClient, SESSION_COOKIE } from '$lib/server/appwrite';
import { redirect, fail } from '@sveltejs/kit';
import { localizeHref } from '$lib/paraglide/runtime';
import { OAuthProvider } from 'node-appwrite';

export const actions = {
    google: async ({ url }) => {
        const { account } = createAdminClient();
        
        try {
            const redirectUrl = await account.createOAuth2Token({
                provider: OAuthProvider.Google,
                success: `${url.origin}/oauth`,
                failure: `${url.origin}/admin/login?error=google_failed`
            });
            
            throw redirect(302, redirectUrl);
        } catch (err: any) {
            if (err.status === 302) throw err; // Handle redirect
            console.error('Google OAuth error:', err);
            return fail(500, { message: 'Failed to initialize Google login.' });
        }
    },
    
	login: async ({ request, cookies, url }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        
        if (!email || !password) {
            return fail(400, { message: 'Email and password are required.' });
        }
        
        try {
            const { account } = createAdminClient();
            const session = await account.createEmailPasswordSession({ email, password });
            
            cookies.set(SESSION_COOKIE, session.secret, {
                path: '/',
                expires: new Date(session.expire),
                sameSite: 'lax',
                secure: url.protocol === 'https:',
                httpOnly: true
            });
            
            throw redirect(302, localizeHref('/admin/dashboard'));
        } catch (err: any) {
            if (err.status === 302) throw err;
            console.error('Login error:', err);
            return fail(401, { message: 'Login falhou. Verifique suas credenciais.' });
        }
    }
};
