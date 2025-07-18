import type { PageServerLoad } from './$types';
import { blogService } from '$lib/modules/blog/BlogService';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	// Get locale from params, default to French
	const localeParam = params.locale || 'fr';
	const currentLocale = localeParam === 'en' ? 'en' : 'fr';
	const post = await blogService.getPostBySlug(params.slug, currentLocale);

	if (!post || !post.published) {
		throw error(404, 'Post not found');
	}

	// Get related posts
	const relatedPosts = await blogService.getRelatedPosts(params.slug, 3, currentLocale);

	// Get post translations for language switcher and SEO
	const translations = await blogService.getPostTranslations(params.slug, currentLocale);

	return {
		post,
		relatedPosts,
		translations
	};
};
