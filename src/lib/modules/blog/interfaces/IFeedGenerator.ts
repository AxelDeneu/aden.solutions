import type { BlogListItem } from '../types/BlogPost';

export interface FeedMetadata {
	title: string;
	description: string;
	url: string;
	feedUrl: string;
	author: string;
	language: string;
}

export interface IFeedGenerator {
	generateRssFeed(posts: BlogListItem[], metadata: FeedMetadata): string;
	generateAtomFeed(posts: BlogListItem[], metadata: FeedMetadata): string;
	generateJsonFeed(posts: BlogListItem[], metadata: FeedMetadata): string;
}
