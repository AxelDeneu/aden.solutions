import type { TranslatableValue, TranslatedValue } from '$lib/types';

import { derived, get, writable } from 'svelte/store';
import { getText } from '../i18n';
import { locale, isLoading } from 'svelte-i18n';

import contact from '$lib/static/contact';
import projects from '$lib/static/projects';
import education from '$lib/static/education';
import workExperience from '$lib/static/workExperience';
import navbar from '$lib/static/navbar';
import staticContent from '$lib/static/content';
import customers from '$lib/static/customers';
import testimonials from '$lib/static/testimonials';

/**
 * A derived store that retrieves localized text based on the current locale.
 */
const getLocalizedText = derived([locale, isLoading], ([$locale, $isLoading]) => {
	// Don't provide translation function until translations are loaded
	if ($isLoading) {
		return (key: string) => '';
	}
	return (key: string) => getText(key);
});

/**
 * Factory function that creates and returns a custom store for managing resume data.
 * The store automatically updates with translated content whenever the locale changes.
 */
const createResumeStore = () => {
	const { subscribe, set } = writable({});

	/**
	 * A derived store containing the translated resume data.
	 * Automatically updates when the locale or static content changes.
	 */
	const translatedStore = derived([getLocalizedText, isLoading], ([$getText, $isLoading]) => {
		// Return empty object while translations are loading
		if ($isLoading) {
			return {};
		}

		/**
		 * Utility function to recursively translate all strings in an object.
		 * @param obj - The object to translate. Can be a string, array, or nested object.
		 * @returns A new object with all strings translated.
		 */
		const translateObject = <T extends TranslatableValue>(obj: T): TranslatedValue<T> => {
			if (typeof obj === 'string') {
				return $getText(obj) as TranslatedValue<T>;
			}
			if (Array.isArray(obj)) {
				return obj.map((item) => translateObject(item)) as TranslatedValue<T>;
			}
			if (obj && typeof obj === 'object') {
				return Object.entries(obj).reduce(
					(acc, [key, value]) => ({
						...acc,
						[key]: translateObject(value as TranslatableValue)
					}),
					{}
				) as TranslatedValue<T>;
			}
			return obj as TranslatedValue<T>;
		};

		return {
			...translateObject(staticContent),
			navbar: translateObject(navbar),
			workExperience: get(workExperience),
			education: translateObject(education),
			projects: get(projects),
			contact: translateObject(contact),
			customers: translateObject(customers),
			testimonials: translateObject(testimonials),
			skills: staticContent.skills || []
		};
	});

	// Automatically set the translated data to the store when it updates
	translatedStore.subscribe(set);

	return {
		subscribe,
		/**
		 * Triggers a manual update of the resume store by resetting the current locale.
		 * Useful for forcing updates without changing the locale.
		 */
		updateResume: () => {
			const currentLocale = get(locale);
			locale.set(currentLocale);
		}
	};
};

/**
 * The custom store instance for managing and accessing resume-related data.
 */
export const resumeStore = createResumeStore();
