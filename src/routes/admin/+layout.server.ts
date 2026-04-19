import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const isLoginPage = url.pathname.includes('/login');
	
	// Check for Appwrite session cookie
	const allCookies = cookies.getAll();
	const hasSession = allCookies.some(c => c.name.startsWith('a_session_'));

	if (hasSession && isLoginPage) {
		throw redirect(302, '/admin/dashboard');
	}

	if (!hasSession && !isLoginPage) {
		throw redirect(302, '/admin/login');
	}

	return {
		hasSession
	};
};
