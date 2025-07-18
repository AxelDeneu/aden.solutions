import type { RequestHandler } from './$types';
import { SeoService } from '$lib/modules/seo';
import { blogService } from '$lib/modules/blog/BlogService';

export const GET: RequestHandler = async () => {
	const baseUrl = 'https://aden.solutions';
	const seoService = new SeoService(baseUrl);

	// Add static pages
	const staticPages = [
		{ loc: '/', priority: 1.0, changefreq: 'weekly' as const },
		{ loc: '/en', priority: 0.9, changefreq: 'weekly' as const },
		{ loc: '/blog', priority: 0.8, changefreq: 'daily' as const },
		{ loc: '/en/blog', priority: 0.8, changefreq: 'daily' as const },
		{ loc: '/projects', priority: 0.8, changefreq: 'weekly' as const },
		{ loc: '/en/projects', priority: 0.8, changefreq: 'weekly' as const }
	];

	// Add pages with alternates
	staticPages.forEach((page) => {
		if (page.loc === '/') {
			// Homepage with language alternates
			seoService.addUrlToSitemap(page.loc, {
				priority: page.priority,
				changefreq: page.changefreq,
				alternates: [
					{ lang: 'en', href: '/en' },
					{ lang: 'fr', href: '/' }
				]
			});
		} else {
			// Language-specific pages
			seoService.addUrlToSitemap(page.loc, {
				priority: page.priority,
				changefreq: page.changefreq
			});
		}
	});

	// Add blog posts for both languages
	try {
		// French blog posts
		const frenchPosts = await blogService.getAllPosts('fr');
		for (const post of frenchPosts) {
			const translations = await blogService.getPostTranslations(post.slug, 'fr');
			const alternates = [];
			
			if (translations.en) {
				alternates.push({ lang: 'en', href: `/en/blog/${translations.en}` });
			}
			if (translations.fr) {
				alternates.push({ lang: 'fr', href: `/blog/${translations.fr}` });
			}
			
			seoService.addUrlToSitemap(`/blog/${post.slug}`, {
				priority: 0.7,
				changefreq: 'monthly',
				lastmod: new Date(post.metadata.date).toISOString(),
				alternates: alternates.length > 0 ? alternates : undefined
			});
		}
		
		// English blog posts
		const englishPosts = await blogService.getAllPosts('en');
		for (const post of englishPosts) {
			const translations = await blogService.getPostTranslations(post.slug, 'en');
			const alternates = [];
			
			if (translations.en) {
				alternates.push({ lang: 'en', href: `/en/blog/${translations.en}` });
			}
			if (translations.fr) {
				alternates.push({ lang: 'fr', href: `/blog/${translations.fr}` });
			}
			
			seoService.addUrlToSitemap(`/en/blog/${post.slug}`, {
				priority: 0.7,
				changefreq: 'monthly',
				lastmod: new Date(post.metadata.date).toISOString(),
				alternates: alternates.length > 0 ? alternates : undefined
			});
		}
	} catch (error) {
		console.error('Error loading blog posts for sitemap:', error);
	}

	// Generate sitemap XML
	const sitemap = seoService.generateSitemap();

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600' // Cache for 1 hour
		}
	});
};
