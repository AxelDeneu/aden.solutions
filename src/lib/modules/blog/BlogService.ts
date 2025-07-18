import type { IBlogRepository } from './interfaces/IBlogRepository';
import type { IFeedGenerator, FeedMetadata } from './interfaces/IFeedGenerator';
import type {
	BlogPost,
	BlogListItem,
	BlogPaginationParams,
	BlogPaginationResult
} from './types/BlogPost';
import { FileBlogRepository } from './repositories/FileBlogRepository';
import { RssFeedGenerator } from './generators/RssFeedGenerator';

export class BlogService {
	private repository: IBlogRepository;
	private feedGenerator: IFeedGenerator;

	constructor(repository?: IBlogRepository, feedGenerator?: IFeedGenerator) {
		this.repository = repository || new FileBlogRepository();
		this.feedGenerator = feedGenerator || new RssFeedGenerator();
	}

	async getAllPosts(language?: string): Promise<BlogListItem[]> {
		return this.repository.getAllPosts(language);
	}

	async getPostBySlug(slug: string, language?: string): Promise<BlogPost | null> {
		return this.repository.getPostBySlug(slug, language);
	}

	async getPostsByCategory(category: string, language?: string): Promise<BlogListItem[]> {
		return this.repository.getPostsByCategory(category, language);
	}

	async getPaginatedPosts(params: BlogPaginationParams): Promise<BlogPaginationResult> {
		return this.repository.getPaginatedPosts(params);
	}

	async getCategories(language?: string): Promise<string[]> {
		return this.repository.getCategories(language);
	}

	async searchPosts(query: string, language?: string): Promise<BlogListItem[]> {
		return this.repository.searchPosts(query, language);
	}

	async generateRssFeed(metadata: FeedMetadata): Promise<string> {
		const posts = await this.getAllPosts(metadata.language);
		return this.feedGenerator.generateRssFeed(posts, metadata);
	}

	async generateAtomFeed(metadata: FeedMetadata): Promise<string> {
		const posts = await this.getAllPosts(metadata.language);
		return this.feedGenerator.generateAtomFeed(posts, metadata);
	}

	async generateJsonFeed(metadata: FeedMetadata): Promise<string> {
		const posts = await this.getAllPosts(metadata.language);
		return this.feedGenerator.generateJsonFeed(posts, metadata);
	}

	async getRelatedPosts(
		slug: string,
		limit: number = 3,
		language?: string
	): Promise<BlogListItem[]> {
		const post = await this.getPostBySlug(slug, language);
		if (!post) return [];

		const allPosts = await this.getAllPosts(language);

		// Filter out current post
		const otherPosts = allPosts.filter((p) => p.slug !== slug);

		// Score posts by category overlap
		const scoredPosts = otherPosts.map((p) => {
			const commonCategories = p.metadata.categories.filter((cat) =>
				post.categories.includes(cat)
			).length;

			return { post: p, score: commonCategories };
		});

		// Sort by score and date
		scoredPosts.sort((a, b) => {
			if (a.score !== b.score) {
				return b.score - a.score;
			}
			return new Date(b.post.metadata.date).getTime() - new Date(a.post.metadata.date).getTime();
		});

		return scoredPosts.slice(0, limit).map((sp) => sp.post);
	}

	async getPostTranslations(slug: string, currentLanguage?: string): Promise<{ [locale: string]: string }> {
		return this.repository.getPostTranslations(slug, currentLanguage);
	}
}

// Singleton instance for convenience
export const blogService = new BlogService();
