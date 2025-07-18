/**
 * Utility functions for canonical URL handling
 */

/**
 * Generate canonical URL from base URL and path
 */
export function generateCanonicalUrl(baseUrl: string, path: string = ''): string {
	// Remove trailing slash from base URL
	const cleanBase = baseUrl.replace(/\/$/, '');

	// Ensure path starts with /
	const cleanPath = path.startsWith('/') ? path : `/${path}`;

	// Remove trailing slash from path unless it's the root
	const finalPath = cleanPath === '/' ? '' : cleanPath.replace(/\/$/, '');

	return `${cleanBase}${finalPath}`;
}

/**
 * Generate alternate language URLs
 */
export function generateAlternateUrls(
	baseUrl: string,
	path: string,
	locales: string[]
): Array<{ lang: string; href: string }> {
	return locales.map((locale) => ({
		lang: locale,
		href: generateCanonicalUrl(baseUrl, `/${locale}${path}`)
	}));
}

/**
 * Extract locale from URL path
 */
export function extractLocaleFromPath(path: string): string | null {
	const match = path.match(/^\/([a-z]{2}(-[A-Z]{2})?)(\/|$)/);
	return match ? match[1] : null;
}

/**
 * Remove locale from URL path
 */
export function removeLocaleFromPath(path: string): string {
	return path.replace(/^\/[a-z]{2}(-[A-Z]{2})?(\/|$)/, '/');
}
