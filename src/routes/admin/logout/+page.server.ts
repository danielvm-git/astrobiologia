import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE } from '$lib/server/appwrite';
import { localizeHref } from '$lib/paraglide/runtime';

export const actions = {
	default: async ({ cookies }) => {
		cookies.delete(SESSION_COOKIE, { path: '/' });
		throw redirect(302, localizeHref('/admin/login'));
	}
};
