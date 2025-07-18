// hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;

	// Handle legacy redirects
	if (pathname.startsWith('/fr-FR')) {
		throw redirect(301, pathname.replace('/fr-FR', ''));
	}
	if (pathname.startsWith('/en-US')) {
		throw redirect(301, pathname.replace('/en-US', '/en'));
	}

	// Extract locale from params or pathname
	const localeParam = event.params.locale || (pathname.startsWith('/en') ? 'en' : 'fr');
	const lang = localeParam === 'en' ? 'en-US' : 'fr-FR';

	// Set locale early in the request
	locale.set(lang);

	// Set locale in event for use in load functions
	event.locals = { ...event.locals, locale: lang };

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%sveltekit.lang%', lang.split('-')[0])
	});
};
