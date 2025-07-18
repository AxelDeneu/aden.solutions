import type { ISeoGenerator } from './interfaces/ISeoGenerator';
import type { ISeoValidator } from './interfaces/ISeoValidator';
import { MetaTagGenerator, type MetaTags } from './generators/MetaTagGenerator';
import { StructuredDataGenerator, type StructuredData } from './generators/StructuredDataGenerator';
import { SitemapGenerator } from './generators/SitemapGenerator';

/**
 * Main SEO service following Single Responsibility Principle
 * Orchestrates all SEO-related functionality
 */
export class SeoService {
	private metaTagGenerator: MetaTagGenerator;
	private structuredDataGenerator: StructuredDataGenerator;
	private sitemapGenerator: SitemapGenerator;
	private validator: ISeoValidator | null = null;

	constructor(baseUrl: string) {
		this.metaTagGenerator = new MetaTagGenerator();
		this.structuredDataGenerator = new StructuredDataGenerator();
		this.sitemapGenerator = new SitemapGenerator(baseUrl);
	}

	/**
	 * Set the SEO validator (Dependency Inversion)
	 */
	setValidator(validator: ISeoValidator): void {
		this.validator = validator;
	}

	/**
	 * Configure meta tags
	 */
	configureMetaTags(config: Partial<MetaTags>): void {
		this.metaTagGenerator.updateConfig(config);
	}

	/**
	 * Generate all meta tags
	 */
	generateMetaTags(): MetaTags {
		const tags = this.metaTagGenerator.generate();

		if (!this.metaTagGenerator.validate(tags)) {
			console.warn('SEO: Meta tags validation failed');
		}

		return tags;
	}

	/**
	 * Add structured data schemas
	 */
	addPersonSchema(person: Parameters<StructuredDataGenerator['addPersonSchema']>[0]): void {
		this.structuredDataGenerator.addPersonSchema(person);
	}

	addWebSiteSchema(website: Parameters<StructuredDataGenerator['addWebSiteSchema']>[0]): void {
		this.structuredDataGenerator.addWebSiteSchema(website);
	}

	addBreadcrumbListSchema(items: Parameters<StructuredDataGenerator['addBreadcrumbSchema']>[0]): void {
		this.structuredDataGenerator.addBreadcrumbSchema(items);
	}

	/**
	 * Add Organization schema
	 */
	addOrganizationSchema(organization: any): void {
		this.structuredDataGenerator.addOrganizationSchema(organization);
	}

	/**
	 * Add Service schema
	 */
	addServiceSchema(service: any): void {
		this.structuredDataGenerator.addServiceSchema(service);
	}

	/**
	 * Generate structured data
	 */
	generateStructuredData(): StructuredData[] {
		const data = this.structuredDataGenerator.generate();

		if (!this.structuredDataGenerator.validate(data)) {
			console.warn('SEO: Structured data validation failed');
		}

		return data;
	}

	/**
	 * Generate structured data as JSON-LD script
	 */
	generateJsonLdScript(): string {
		const data = this.generateStructuredData();
		if (data.length === 0) return '';

		const scripts = data.map(
			(schema) => `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`
		);

		return scripts.join('\n');
	}

	/**
	 * Add URL to sitemap
	 */
	addUrlToSitemap(loc: string, options?: Parameters<SitemapGenerator['addUrl']>[1]): void {
		this.sitemapGenerator.addUrl(loc, options);
	}

	/**
	 * Generate sitemap XML
	 */
	generateSitemap(): string {
		const sitemap = this.sitemapGenerator.generate();

		if (!this.sitemapGenerator.validate(sitemap)) {
			console.warn('SEO: Sitemap validation failed');
		}

		return sitemap;
	}

	/**
	 * Get all generators (useful for testing)
	 */
	getGenerators() {
		return {
			metaTags: this.metaTagGenerator,
			structuredData: this.structuredDataGenerator,
			sitemap: this.sitemapGenerator
		};
	}

	/**
	 * Validate all SEO elements
	 */
	validateAll(): boolean {
		if (!this.validator) {
			console.warn('SEO: No validator set');
			return true;
		}

		const metaTags = this.generateMetaTags();
		const structuredData = this.generateStructuredData();

		const metaTagsValid = this.validator.validateMetaTags(
			metaTags as unknown as Record<string, string>
		);
		const structuredDataValid = this.validator.validateStructuredData(structuredData);

		if (!metaTagsValid || !structuredDataValid) {
			const warnings = this.validator.getWarnings();
			warnings.forEach((warning) => console.warn(`SEO Warning: ${warning}`));
			return false;
		}

		return true;
	}
}
