import type { RequestHandler } from './$types';
import { blogService } from '$lib/modules/blog/BlogService';

export const GET: RequestHandler = async ({ url }) => {
	const language = url.searchParams.get('lang') || 'en';

	const feedMetadata = {
		title: 'Axel Deneu - Blog',
		description: 'Thoughts on software development, technology, and innovation',
		url: url.origin,
		feedUrl: `${url.origin}/rss.xml`,
		author: 'Axel Deneu',
		language
	};

	const rss = await blogService.generateRssFeed(feedMetadata);

	return new Response(rss, {
		headers: {
			'Content-Type': 'application/rss+xml',
			'Cache-Control': 'max-age=3600' // Cache for 1 hour
		}
	});
};
