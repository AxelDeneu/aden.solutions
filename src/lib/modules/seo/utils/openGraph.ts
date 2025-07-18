/**
 * Open Graph utilities
 */

interface OpenGraphImage {
	url: string;
	alt?: string;
	width?: number;
	height?: number;
	type?: string;
}

/**
 * Generate Open Graph image meta tags
 */
export function generateOgImageTags(image: OpenGraphImage): Record<string, string> {
	const tags: Record<string, string> = {
		'og:image': image.url
	};

	if (image.alt) {
		tags['og:image:alt'] = image.alt;
	}

	if (image.width) {
		tags['og:image:width'] = String(image.width);
	}

	if (image.height) {
		tags['og:image:height'] = String(image.height);
	}

	if (image.type) {
		tags['og:image:type'] = image.type;
	}

	return tags;
}

/**
 * Validate Open Graph image dimensions
 */
export function validateOgImageDimensions(width?: number, height?: number): boolean {
	if (!width || !height) {
		return false;
	}

	// Facebook recommends 1200x630 for best display
	const recommendedWidth = 1200;
	const recommendedHeight = 630;
	const aspectRatio = recommendedWidth / recommendedHeight;

	const imageAspectRatio = width / height;
	const tolerance = 0.1; // 10% tolerance

	return Math.abs(imageAspectRatio - aspectRatio) <= tolerance;
}

/**
 * Get optimal OG image dimensions
 */
export function getOptimalOgImageDimensions(): { width: number; height: number } {
	return {
		width: 1200,
		height: 630
	};
}
