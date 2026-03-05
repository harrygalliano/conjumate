import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: 'index.html'
		}),
		prerender: {
			entries: ['/', '/learn', '/practice'],
			handleMissingId: 'ignore'
		}
	}
};

export default config;
