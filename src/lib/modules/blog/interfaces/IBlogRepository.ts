import type {
	BlogPost,
	BlogListItem,
	BlogPaginationParams,
	BlogPaginationResult
} from '../types/BlogPost';

export interface IBlogRepository {
	getAllPosts(language?: string): Promise<BlogListItem[]>;
	getPostBySlug(slug: string, language?: string): Promise<BlogPost | null>;
	getPostsByCategory(category: string, language?: string): Promise<BlogListItem[]>;
	getPaginatedPosts(params: BlogPaginationParams): Promise<BlogPaginationResult>;
	getCategories(language?: string): Promise<string[]>;
	searchPosts(query: string, language?: string): Promise<BlogListItem[]>;
	getPostTranslations(slug: string, currentLanguage?: string): Promise<{ [locale: string]: string }>;
}
