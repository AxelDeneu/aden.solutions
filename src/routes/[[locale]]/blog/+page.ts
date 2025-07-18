import type { PageLoad } from './$types';
import { blogService } from '$lib/modules/blog/BlogService';
import { get } from 'svelte/store';
import { locale } from 'svelte-i18n';

export const load: PageLoad = async ({ url, params }) => {
	const page = Number(url.searchParams.get('page')) || 1;
	const category = url.searchParams.get('category') || undefined;
	const search = url.searchParams.get('search') || undefined;

	// Get locale from params, default to French
	const localeParam = params.locale || 'fr';
	const currentLocale = localeParam === 'en' ? 'en' : 'fr';

	let posts;
	let categories;
	let pagination;

	// Get categories for filter
	categories = await blogService.getCategories(currentLocale);

	if (search) {
		// Search posts
		const searchResults = await blogService.searchPosts(search, currentLocale);
		const total = searchResults.length;
		const limit = 10;
		const totalPages = Math.ceil(total / limit);
		const start = (page - 1) * limit;
		const end = start + limit;

		posts = searchResults.slice(start, end);
		pagination = {
			total,
			page,
			totalPages,
			hasNext: page < totalPages,
			hasPrev: page > 1
		};
	} else {
		// Get paginated posts
		const result = await blogService.getPaginatedPosts({
			page,
			limit: 10,
			category,
			language: currentLocale
		});

		posts = result.posts;
		pagination = {
			total: result.total,
			page: result.page,
			totalPages: result.totalPages,
			hasNext: result.hasNext,
			hasPrev: result.hasPrev
		};
	}

	return {
		posts,
		categories,
		pagination,
		currentCategory: category,
		searchQuery: search
	};
};
