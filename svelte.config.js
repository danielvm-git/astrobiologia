import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			fallback: 'index.html'
		}),
		alias: {
			$lib: './src/lib',
			$components: './src/lib/components'
		},
		prerender: {
			handleHttpError: 'warn',
			handleMissingId: 'warn',
			entries: ['*'],
			handleUnseenRoutes: 'ignore'
		}
	}
};

export default config;
