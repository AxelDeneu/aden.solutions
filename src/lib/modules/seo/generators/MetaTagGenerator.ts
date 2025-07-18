import type { ISeoGenerator } from '../interfaces/ISeoGenerator';

export interface MetaTags {
	title: string;
	description: string;
	keywords?: string;
	author?: string;
	robots?: string;
	canonical?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	ogImageAlt?: string;
	ogImageWidth?: string;
	ogImageHeight?: string;
	ogUrl?: string;
	ogType?: string;
	ogSiteName?: string;
	ogLocale?: string;
	twitterCard?: string;
	twitterSite?: string;
	twitterCreator?: string;
	twitterTitle?: string;
	twitterDescription?: string;
	twitterImage?: string;
	alternateLanguages?: Array<{ lang: string; href: string }>;
}

/**
 * Generator for meta tags following Single Responsibility Principle
 */
export class MetaTagGenerator implements ISeoGenerator<MetaTags> {
	private config: Partial<MetaTags>;

	constructor(config: Partial<MetaTags> = {}) {
		this.config = config;
	}

	generate(): MetaTags {
		const {
			title = '',
			description = '',
			ogTitle,
			ogDescription,
			twitterTitle,
			twitterDescription,
			...rest
		} = this.config;

		return {
			title,
			description,
			robots: 'index, follow',
			ogTitle: ogTitle || title,
			ogDescription: ogDescription || description,
			ogType: 'website',
			twitterCard: 'summary_large_image',
			twitterTitle: twitterTitle || title,
			twitterDescription: twitterDescription || description,
			...rest
		};
	}

	validate(tags: MetaTags): boolean {
		// Title validation
		if (!tags.title || tags.title.length > 60) {
			console.warn('SEO: Title is missing or too long (max 60 chars)');
			return false;
		}

		// Description validation
		if (!tags.description || tags.description.length > 160) {
			console.warn('SEO: Description is missing or too long (max 160 chars)');
			return false;
		}

		// OG Image validation
		if (tags.ogImage && !tags.ogImageAlt) {
			console.warn('SEO: OG image alt text is missing');
		}

		return true;
	}

	/**
	 * Update configuration
	 */
	updateConfig(config: Partial<MetaTags>): void {
		this.config = { ...this.config, ...config };
	}

	/**
	 * Add alternate language
	 */
	addAlternateLanguage(lang: string, href: string): void {
		if (!this.config.alternateLanguages) {
			this.config.alternateLanguages = [];
		}
		this.config.alternateLanguages.push({ lang, href });
	}
}
