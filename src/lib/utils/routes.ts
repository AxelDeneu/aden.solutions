/**
 * Route utilities for handling localized paths
 */

export type Locale = 'fr-FR' | 'en-US';

/**
 * Check if the given locale is the default locale (French)
 */
export function isDefaultLocale(locale: Locale): boolean {
	return locale === 'fr-FR';
}

/**
 * Extract locale from URL pathname
 */
export function getCurrentLocale(pathname: string): Locale {
	if (pathname.startsWith('/en')) {
		return 'en-US';
	}
	return 'fr-FR';
}

/**
 * Convert a path from one locale to another
 * @param path - The current path
 * @param targetLocale - The target locale
 * @param currentLocale - The current locale (optional, will be extracted from path)
 */
export function getLocalizedPath(
	path: string,
	targetLocale: Locale,
	currentLocale?: Locale
): string {
	const current = currentLocale || getCurrentLocale(path);

	// Remove current locale prefix if it exists
	let basePath = path;
	if (path.startsWith('/en/')) {
		basePath = path.substring(3); // Remove '/en' prefix
	} else if (path.startsWith('/en') && path.length === 3) {
		basePath = '/';
	}

	// Add target locale prefix if needed
	if (targetLocale === 'en-US') {
		return basePath === '/' ? '/en' : `/en${basePath}`;
	} else {
		return basePath;
	}
}

/**
 * Get the opposite locale for toggle functionality
 */
export function getOppositeLocale(locale: Locale): Locale {
	return locale === 'fr-FR' ? 'en-US' : 'fr-FR';
}

/**
 * Create a localized link
 */
export function createLocalizedLink(path: string, locale: Locale): string {
	if (isDefaultLocale(locale)) {
		return path;
	}
	// Handle root path specially
	return path === '/' ? '/en' : `/en${path}`;
}

/**
 * Get localized href for navigation
 */
export function localizedHref(path: string, currentLocale: Locale): string {
	return currentLocale === 'en-US' ? `/en${path}` : path;
}
