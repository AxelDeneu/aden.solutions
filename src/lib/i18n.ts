import { init, register, t, addMessages } from 'svelte-i18n';
import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { dictionary, locale } from 'svelte-i18n';

// Import locales synchronously for SSR
import enMessages from './locales/en.json';
import frMessages from './locales/fr.json';

// Add messages synchronously
addMessages('en-US', enMessages);
addMessages('fr-FR', frMessages);

// Also register async loaders for client-side
register('en-US', () => import('./locales/en.json'));
register('fr-FR', () => import('./locales/fr.json'));

const defaultLocale = 'fr-FR';

// Initialize i18n without initial locale (will be set dynamically)
init({
	fallbackLocale: defaultLocale
	// initialLocale removed - will be set based on URL
});

export function __(key: string, options?: Record<string, never>): string {
	return get(t)(key, options); // Retrieve translation directly from the store
}

export function getText(key: string) {
	const lang = get(locale) || defaultLocale;
	const translations = get(dictionary)[lang];

	// If translations haven't loaded yet, return empty string
	if (!translations) {
		return '';
	}

	return translations[key] || key;
}
