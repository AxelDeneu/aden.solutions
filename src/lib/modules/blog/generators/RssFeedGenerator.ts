import type { IFeedGenerator, FeedMetadata } from '../interfaces/IFeedGenerator';
import type { BlogListItem } from '../types/BlogPost';

export class RssFeedGenerator implements IFeedGenerator {
	generateRssFeed(posts: BlogListItem[], metadata: FeedMetadata): string {
		const { title, description, url, feedUrl, author, language } = metadata;

		const items = posts.map((post) => this.generateRssItem(post, url, author)).join('\n');

		return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
	<channel>
		<title>${this.escapeXml(title)}</title>
		<link>${url}</link>
		<description>${this.escapeXml(description)}</description>
		<language>${language}</language>
		<atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		${items}
	</channel>
</rss>`;
	}

	generateAtomFeed(posts: BlogListItem[], metadata: FeedMetadata): string {
		const { title, description, url, feedUrl, author, language } = metadata;

		const items = posts.map((post) => this.generateAtomEntry(post, url, author)).join('\n');

		return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${language}">
	<title>${this.escapeXml(title)}</title>
	<subtitle>${this.escapeXml(description)}</subtitle>
	<link href="${url}" />
	<link href="${feedUrl}" rel="self" type="application/atom+xml" />
	<id>${url}</id>
	<updated>${new Date().toISOString()}</updated>
	<author>
		<name>${this.escapeXml(author)}</name>
	</author>
	${items}
</feed>`;
	}

	generateJsonFeed(posts: BlogListItem[], metadata: FeedMetadata): string {
		const { title, description, url, feedUrl, author, language } = metadata;

		const feed = {
			version: 'https://jsonfeed.org/version/1.1',
			title,
			description,
			home_page_url: url,
			feed_url: feedUrl,
			language,
			authors: [{ name: author }],
			items: posts.map((post) => ({
				id: `${url}/blog/${post.slug}`,
				url: `${url}/blog/${post.slug}`,
				title: post.metadata.title,
				summary: post.metadata.description,
				date_published: new Date(post.metadata.date).toISOString(),
				authors: [{ name: post.metadata.author || author }],
				tags: post.metadata.categories
			}))
		};

		return JSON.stringify(feed, null, 2);
	}

	private generateRssItem(post: BlogListItem, baseUrl: string, defaultAuthor: string): string {
		const { metadata, slug } = post;
		const postUrl = `${baseUrl}/blog/${slug}`;
		const pubDate = new Date(metadata.date).toUTCString();

		return `		<item>
			<title>${this.escapeXml(metadata.title)}</title>
			<link>${postUrl}</link>
			<guid isPermaLink="true">${postUrl}</guid>
			<description>${this.escapeXml(metadata.description)}</description>
			<dc:creator>${this.escapeXml(metadata.author || defaultAuthor)}</dc:creator>
			<pubDate>${pubDate}</pubDate>
			${metadata.categories.map((cat) => `<category>${this.escapeXml(cat)}</category>`).join('\n			')}
		</item>`;
	}

	private generateAtomEntry(post: BlogListItem, baseUrl: string, defaultAuthor: string): string {
		const { metadata, slug } = post;
		const postUrl = `${baseUrl}/blog/${slug}`;
		const updated = new Date(metadata.date).toISOString();

		return `	<entry>
		<title>${this.escapeXml(metadata.title)}</title>
		<link href="${postUrl}" />
		<id>${postUrl}</id>
		<updated>${updated}</updated>
		<summary>${this.escapeXml(metadata.description)}</summary>
		<author>
			<name>${this.escapeXml(metadata.author || defaultAuthor)}</name>
		</author>
		${metadata.categories.map((cat) => `<category term="${this.escapeXml(cat)}" />`).join('\n		')}
	</entry>`;
	}

	private escapeXml(unsafe: string): string {
		return unsafe
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
	}
}
