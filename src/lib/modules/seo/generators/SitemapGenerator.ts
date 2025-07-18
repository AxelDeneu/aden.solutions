import type { ISeoGenerator } from '../interfaces/ISeoGenerator';

interface SitemapEntry {
	loc: string;
	lastmod?: string;
	changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
	priority?: number;
	alternates?: Array<{ lang: string; href: string }>;
}

/**
 * Generator for sitemap.xml
 */
export class SitemapGenerator implements ISeoGenerator<string> {
	private entries: SitemapEntry[] = [];
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
	}

	generate(): string {
		const xml = ['<?xml version="1.0" encoding="UTF-8"?>'];
		xml.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
		xml.push('        xmlns:xhtml="http://www.w3.org/1999/xhtml">');

		for (const entry of this.entries) {
			xml.push('  <url>');
			xml.push(`    <loc>${this.baseUrl}${entry.loc}</loc>`);

			if (entry.lastmod) {
				xml.push(`    <lastmod>${entry.lastmod}</lastmod>`);
			}

			if (entry.changefreq) {
				xml.push(`    <changefreq>${entry.changefreq}</changefreq>`);
			}

			if (entry.priority !== undefined) {
				xml.push(`    <priority>${entry.priority}</priority>`);
			}

			// Add alternate language versions
			if (entry.alternates && entry.alternates.length > 0) {
				for (const alt of entry.alternates) {
					xml.push(
						`    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${this.baseUrl}${alt.href}"/>`
					);
				}
			}

			xml.push('  </url>');
		}

		xml.push('</urlset>');
		return xml.join('\n');
	}

	validate(sitemap: string): boolean {
		if (this.entries.length === 0) {
			console.warn('SEO: Sitemap has no entries');
			return false;
		}

		// Basic XML validation
		if (!sitemap.includes('<?xml') || !sitemap.includes('<urlset')) {
			console.error('SEO: Invalid sitemap XML structure');
			return false;
		}

		return true;
	}

	/**
	 * Add URL to sitemap
	 */
	addUrl(loc: string, options: Omit<SitemapEntry, 'loc'> = {}): void {
		// Ensure URL starts with /
		const normalizedLoc = loc.startsWith('/') ? loc : `/${loc}`;

		this.entries.push({
			loc: normalizedLoc,
			lastmod: options.lastmod || new Date().toISOString().split('T')[0],
			changefreq: options.changefreq || 'weekly',
			priority: options.priority ?? 0.5,
			alternates: options.alternates
		});
	}

	/**
	 * Add multiple URLs at once
	 */
	addUrls(urls: SitemapEntry[]): void {
		urls.forEach((url) => this.addUrl(url.loc, url));
	}

	/**
	 * Get all entries
	 */
	getEntries(): SitemapEntry[] {
		return [...this.entries];
	}

	/**
	 * Clear all entries
	 */
	clearEntries(): void {
		this.entries = [];
	}
}
