import { createAdminClient, SESSION_COOKIE } from '$lib/server/appwrite';
import { redirect, fail } from '@sveltejs/kit';
import { localizeHref } from '$lib/paraglide/runtime';
import { createLogger } from '$lib/server/logger';
import { isPublicHttps } from '$lib/server/public-origin';

const log = createLogger('ADMIN-LOGIN');

export const actions = {
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
				secure: isPublicHttps(url, request),
				httpOnly: true
			});

			throw redirect(302, localizeHref('/admin/dashboard'));
		} catch (err: any) {
			if (err.status === 302) throw err;
			log.error('Email login createEmailPasswordSession failed', err instanceof Error ? err : { err });
			return fail(401, { message: 'Login falhou. Verifique suas credenciais.' });
		}
	}
};
