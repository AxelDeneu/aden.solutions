// Define BreadcrumbItem type locally since it's not exported
interface BreadcrumbItem {
	'@type': 'ListItem';
	position: number;
	name: string;
	item: string;
}

export interface Breadcrumb {
	name: string;
	url: string;
}

/**
 * Generate breadcrumbs from URL path
 */
export function generateBreadcrumbs(
	pathname: string,
	baseUrl: string,
	translations: Record<string, string>
): Breadcrumb[] {
	const breadcrumbs: Breadcrumb[] = [
		{
			name: translations['home'] || 'Home',
			url: baseUrl
		}
	];

	// Remove leading slash and split path
	const pathSegments = pathname.replace(/^\//, '').split('/').filter(Boolean);
	
	// Skip locale segment if present
	let startIndex = 0;
	if (pathSegments[0] === 'en' || pathSegments[0] === 'fr') {
		startIndex = 1;
		breadcrumbs[0].url = pathSegments[0] === 'en' ? `${baseUrl}/en` : baseUrl;
	}

	let currentPath = pathSegments[0] === 'en' ? '/en' : '';
	
	for (let i = startIndex; i < pathSegments.length; i++) {
		const segment = pathSegments[i];
		currentPath += `/${segment}`;
		
		// Get translated name for the segment
		let name = translations[segment] || segment;
		
		// Special handling for blog posts and project slugs
		if (i === pathSegments.length - 1) {
			// This is the last segment (likely a slug)
			if (pathSegments[i - 1] === 'blog') {
				// For blog posts, we'd need the actual post title
				// This will be handled in the component
				continue;
			} else if (pathSegments[i - 1] === 'projects') {
				// For projects, we'd need the actual project title
				// This will be handled in the component
				continue;
			}
		}
		
		// Capitalize first letter if no translation found
		if (!translations[segment]) {
			name = segment.charAt(0).toUpperCase() + segment.slice(1);
		}
		
		breadcrumbs.push({
			name,
			url: `${baseUrl}${currentPath}`
		});
	}
	
	return breadcrumbs;
}

/**
 * Convert breadcrumbs to structured data format
 */
export function breadcrumbsToStructuredData(
	breadcrumbs: Breadcrumb[]
): BreadcrumbItem[] {
	return breadcrumbs.map((crumb, index) => ({
		'@type': 'ListItem' as const,
		position: index + 1,
		name: crumb.name,
		item: crumb.url
	}));
}