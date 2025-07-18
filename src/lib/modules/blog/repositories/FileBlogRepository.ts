import type { IBlogRepository } from '../interfaces/IBlogRepository';
import type {
	BlogPost,
	BlogListItem,
	BlogPaginationParams,
	BlogPaginationResult
} from '../types/BlogPost';
import { resolveSlugForLanguage, findPostByLocalizedSlug } from '../types/BlogPost';
import type { IMarkdownProcessor } from '../interfaces/IMarkdownProcessor';
import { MdxProcessor } from '../processors/MdxProcessor';

export class FileBlogRepository implements IBlogRepository {
	private processor: IMarkdownProcessor;
	private postsCache: Map<string, BlogPost> = new Map();

	constructor(processor?: IMarkdownProcessor) {
		this.processor = processor || new MdxProcessor();
	}

	async getAllPosts(language: string = 'en'): Promise<BlogListItem[]> {
		const posts = await this.loadAllPosts(language);

		return posts
			.filter((post) => post.published)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.map((post) => {
				const resolvedSlug = resolveSlugForLanguage(post.slug, language);
				return {
					metadata: {
						title: post.title,
						description: post.description,
						date: post.date,
						published: post.published,
						categories: post.categories,
						author: post.author,
						coverImage: post.coverImage,
						coverImageAlt: post.coverImageAlt,
						readingTime: post.readingTime,
						slug: post.slug
					},
					slug: resolvedSlug
				};
			});
	}

	async getPostBySlug(slug: string, language: string = 'en'): Promise<BlogPost | null> {
		// Use the translation method to get complete mapping
		const postMap = await this.loadAllPostsForTranslation();
		
		// Find the post group that matches the slug
		for (const [groupKey, languageVersions] of postMap.entries()) {
			// Get the post in the requested language
			const requestedPost = languageVersions[language as 'fr' | 'en'];
			
			if (requestedPost) {
				// Check if the provided slug matches the slug for this language
				const expectedSlug = resolveSlugForLanguage(requestedPost.slug, language);
				
				if (expectedSlug === slug) {
					// Only return the post if the slug matches the expected slug for this language
					return requestedPost;
				}
			}
		}
		
		// No post found with matching slug in the requested language
		return null;
	}

	async getPostsByCategory(category: string, language: string = 'en'): Promise<BlogListItem[]> {
		const allPosts = await this.getAllPosts(language);

		return allPosts.filter((post) => post.metadata.categories.includes(category));
	}

	async getPaginatedPosts(params: BlogPaginationParams): Promise<BlogPaginationResult> {
		const { page = 1, limit = 10, category, language = 'en' } = params;

		let posts = await this.getAllPosts(language);

		// Filter by category if provided
		if (category) {
			posts = posts.filter((post) => post.metadata.categories.includes(category));
		}

		const total = posts.length;
		const totalPages = Math.ceil(total / limit);
		const start = (page - 1) * limit;
		const end = start + limit;

		const paginatedPosts = posts.slice(start, end);

		return {
			posts: paginatedPosts,
			total,
			page,
			totalPages,
			hasNext: page < totalPages,
			hasPrev: page > 1
		};
	}

	async getCategories(language: string = 'en'): Promise<string[]> {
		const posts = await this.getAllPosts(language);
		const categoriesSet = new Set<string>();

		posts.forEach((post) => {
			post.metadata.categories.forEach((category) => {
				categoriesSet.add(category);
			});
		});

		return Array.from(categoriesSet).sort();
	}

	async searchPosts(query: string, language: string = 'en'): Promise<BlogListItem[]> {
		const posts = await this.getAllPosts(language);
		const searchQuery = query.toLowerCase();

		return posts.filter((post) => {
			const metadata = post.metadata;
			return (
				metadata.title.toLowerCase().includes(searchQuery) ||
				metadata.description.toLowerCase().includes(searchQuery) ||
				metadata.categories.some((cat) => cat.toLowerCase().includes(searchQuery))
			);
		});
	}

	private async loadAllPosts(language: string): Promise<BlogPost[]> {
		// Use the translation method to get properly grouped posts
		const postMap = await this.loadAllPostsForTranslation();
		const posts: BlogPost[] = [];

		// Select ONLY ONE post per group in the requested language
		for (const [groupKey, languageVersions] of postMap.entries()) {
			const requestedPost = languageVersions[language as 'fr' | 'en'];
			
			if (requestedPost) {
				posts.push(requestedPost);
			} else {
				// Only use fallback if requested language doesn't exist
				const fallbackPost = languageVersions.fr || languageVersions.en;
				if (fallbackPost) {
					posts.push(fallbackPost);
				}
			}
		}

		return posts;
	}

	private async loadAllPostsForTranslation(): Promise<Map<string, { fr?: BlogPost; en?: BlogPost }>> {
		// Load ALL blog post files regardless of language
		const blogPosts = import.meta.glob('../../../../content/blog/**/*.md', {
			query: '?raw',
			import: 'default',
			eager: false
		});

		const postMap = new Map<string, { fr?: BlogPost; en?: BlogPost }>();
		const allPosts: Array<{ post: BlogPost; fileLocale: string; filename: string }> = [];

		// First pass: Load all posts and extract locale info
		for (const [path, loader] of Object.entries(blogPosts)) {
			try {
				const pathParts = path.split('/');
				const filename = pathParts[pathParts.length - 1];
				const filenameWithoutExt = filename.replace('.md', '');
				const filenameParts = filenameWithoutExt.split('.');

				// Determine file locale from filename
				let fileLocale: string = 'fr'; // Default to French
				if (filenameParts.length > 1) {
					const lastPart = filenameParts[filenameParts.length - 1];
					if (lastPart === 'en' || lastPart === 'fr') {
						fileLocale = lastPart;
					}
				}

				const content = await loader();
				const processed = await this.processor.process(content as string, filenameWithoutExt);

				const post: BlogPost = {
					title: processed.metadata.title,
					description: processed.metadata.description,
					date: processed.metadata.date,
					published: processed.metadata.published,
					categories: processed.metadata.categories,
					author: processed.metadata.author,
					coverImage: processed.metadata.coverImage,
					coverImageAlt: processed.metadata.coverImageAlt,
					readingTime: processed.metadata.readingTime,
					content: processed.content,
					excerpt: processed.excerpt,
					slug: processed.metadata.slug || filenameWithoutExt
				};

				allPosts.push({ post, fileLocale, filename });

			} catch (error) {
				console.error(`Error processing blog post ${path}:`, error);
			}
		}

		// Second pass: Group posts by their slug content
		for (const { post, fileLocale, filename } of allPosts) {
			// Create a unique key based on the slug content
			let groupKey: string;
			
			if (post.slug && typeof post.slug === 'object' && !Array.isArray(post.slug)) {
				// Use a normalized key based on slug values
				const slugValues = Object.values(post.slug as Record<string, string>).sort();
				groupKey = slugValues.join('|');
			} else {
				// Use the string slug as the key
				groupKey = String(post.slug);
			}

			// Group posts with the same slug content
			if (!postMap.has(groupKey)) {
				postMap.set(groupKey, {});
			}
			postMap.get(groupKey)![fileLocale as 'fr' | 'en'] = post;
		}

		return postMap;
	}

	async getPostTranslations(slug: string, currentLanguage: string = 'en'): Promise<{ [locale: string]: string }> {
		// Use the dedicated translation method to get all language versions
		const postMap = await this.loadAllPostsForTranslation();
		const translations: { [locale: string]: string } = {};

		// Find the post group that matches the current slug
		let matchingGroupKey: string | null = null;
		
		for (const [groupKey, languageVersions] of postMap.entries()) {
			for (const [locale, post] of Object.entries(languageVersions)) {
				if (post) {
					const resolvedSlug = resolveSlugForLanguage(post.slug, locale);
					if (resolvedSlug === slug) {
						matchingGroupKey = groupKey;
						break;
					}
				}
			}
			if (matchingGroupKey) break;
		}

		if (!matchingGroupKey) {
			return {};
		}

		// Get all available translations for this post group
		const languageVersions = postMap.get(matchingGroupKey);
		if (languageVersions) {
			for (const [locale, post] of Object.entries(languageVersions)) {
				if (post) {
					const resolvedSlug = resolveSlugForLanguage(post.slug, locale);
					translations[locale] = resolvedSlug;
				}
			}
		}

		return translations;
	}
}
