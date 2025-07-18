import type { TranslatableValue } from '$lib/types/TranslatableValue';

export type LocalizedSlug = string | { [locale: string]: string };

export interface BlogPostMetadata {
	title: string;
	description: string;
	date: string;
	published: boolean;
	categories: string[];
	author?: string;
	coverImage?: string;
	coverImageAlt?: string;
	readingTime?: number;
	slug?: LocalizedSlug;
}

export interface BlogPost extends BlogPostMetadata {
	content: string;
	excerpt?: string;
}

export interface TranslatableBlogPost {
	metadata: BlogPostMetadata & TranslatableValue;
	content: TranslatableValue;
	slug: string;
}

export interface BlogListItem {
	metadata: BlogPostMetadata;
	slug: string;
}

export interface BlogPaginationParams {
	page: number;
	limit: number;
	category?: string;
	language?: string;
}

export interface BlogPaginationResult {
	posts: BlogListItem[];
	total: number;
	page: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

// Utility functions for slug resolution
export function resolveSlugForLanguage(slug: LocalizedSlug | undefined, language: string): string {
	if (!slug) return '';
	
	if (typeof slug === 'string') {
		return slug;
	}
	
	// Try to get the slug for the requested language
	if (slug[language]) {
		return slug[language];
	}
	
	// Fallback to default language (French first, then English)
	if (slug.fr) {
		return slug.fr;
	}
	
	if (slug.en) {
		return slug.en;
	}
	
	// Fallback to first available slug
	const firstSlug = Object.values(slug)[0];
	return firstSlug || '';
}

export function getAvailableLanguagesForSlug(slug: LocalizedSlug | undefined): string[] {
	if (!slug) return [];
	
	if (typeof slug === 'string') {
		return ['en', 'fr']; // Default languages
	}
	
	return Object.keys(slug);
}

export function findPostByLocalizedSlug(posts: BlogPost[], targetSlug: string, language: string): BlogPost | null {
	return posts.find(post => {
		const resolvedSlug = resolveSlugForLanguage(post.slug, language);
		return resolvedSlug === targetSlug;
	}) || null;
}
