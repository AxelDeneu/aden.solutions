import { browser } from '$app/environment';
import '$lib/i18n'; // Import to initialize. Important :)
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';
import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
import { injectAnalytics } from '@vercel/analytics/sveltekit'
import { dev } from '$app/environment';

injectSpeedInsights();
injectAnalytics({ mode: dev ? 'development' : 'production' });

export const prerender = true;
export const load: LayoutLoad = async ({ data, url }) => {
	// Determine locale from URL or data
	let currentLocale = 'fr-FR';
	if (data?.locale) {
		currentLocale = data.locale;
	} else if (url.pathname.startsWith('/en')) {
		currentLocale = 'en-US';
	}

	// Set locale synchronously
	locale.set(currentLocale);

	// Since we're using addMessages, translations are available immediately
	// But still wait for any async operations to complete
	await waitLocale();

	return {
		...data,
		locale: currentLocale,
		translationsReady: true
	};
};
