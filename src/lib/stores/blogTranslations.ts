import { writable } from 'svelte/store';

export interface BlogTranslations {
	[locale: string]: string;
}

/**
 * Store to hold the current blog post's translations.
 * This is used by the locale toggle to properly switch between translated slugs.
 */
function createBlogTranslationsStore() {
	const { subscribe, set, update } = writable<BlogTranslations | null>(null);

	return {
		subscribe,
		set,
		clear: () => set(null),
		isActive: () => {
			let translations: BlogTranslations | null = null;
			subscribe(t => translations = t)();
			return translations !== null;
		}
	};
}

export const blogTranslations = createBlogTranslationsStore();