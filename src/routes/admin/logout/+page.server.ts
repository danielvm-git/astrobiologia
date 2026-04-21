import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE, createSessionClient } from '$lib/server/appwrite';
import { localizeHref } from '$lib/paraglide/runtime';

export const actions = {
	default: async ({ cookies }) => {
		try {
			const { account } = createSessionClient({ cookies });
			await account.deleteSession('current');
		} catch {
			// Invalidate cookie regardless if Appwrite session delete fails
		}
		cookies.delete(SESSION_COOKIE, { path: '/' });
		throw redirect(302, localizeHref('/'));
	}
};
