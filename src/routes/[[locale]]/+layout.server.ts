import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params, parent }) => {
	// Get parent data
	const parentData = await parent();

	// Default to French if no locale specified
	const localeParam = params.locale || 'fr';

	// Validate locale
	const validLocales = ['fr', 'en'];
	if (params.locale && !validLocales.includes(params.locale)) {
		throw error(404, 'Invalid locale');
	}

	// Map short locale to full locale format
	const locale = localeParam === 'en' ? 'en-US' : 'fr-FR';

	return {
		...parentData,
		locale
	};
};
