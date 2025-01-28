import { init, register, t } from 'svelte-i18n';
import { browser } from '$app/environment'
import { get } from 'svelte/store';

// Register locales
register('en', () => import('./locales/en.json'));
register('fr', () => import('./locales/fr.json'));

const defaultLocale = 'en';

// Initialize i18n with a fallback
init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale,
});

export function __(key: string, options?: Record<string, never>): string {
	return get(t)(key, options); // Retrieve translation directly from the store
}