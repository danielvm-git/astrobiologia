import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
	const isAdmin = url.pathname.startsWith('/admin');

	return {
		isAdmin,
		baseUrl: 'https://astrobiologia.com'
	};
};
