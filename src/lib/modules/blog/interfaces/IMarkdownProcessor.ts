import type { BlogPost, BlogPostMetadata } from '../types/BlogPost';

export interface ProcessedMarkdown {
	metadata: BlogPostMetadata;
	content: string;
	excerpt: string;
	readingTime: number;
}

export interface IMarkdownProcessor {
	process(content: string, slug: string): Promise<ProcessedMarkdown>;
	extractMetadata(content: string): BlogPostMetadata;
	generateExcerpt(content: string, length?: number): string;
	calculateReadingTime(content: string): number;
}
