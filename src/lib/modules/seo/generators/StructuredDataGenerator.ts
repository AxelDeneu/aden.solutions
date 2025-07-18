import type { ISeoGenerator } from '../interfaces/ISeoGenerator';

interface PersonSchema {
	'@context': string;
	'@type': 'Person';
	name: string;
	url?: string;
	image?: string;
	jobTitle?: string;
	worksFor?: {
		'@type': 'Organization';
		name: string;
	};
	sameAs?: string[];
	address?: {
		'@type': 'PostalAddress';
		addressLocality?: string;
		addressCountry?: string;
	};
	email?: string;
	telephone?: string;
}

interface WebSiteSchema {
	'@context': string;
	'@type': 'WebSite';
	name: string;
	url: string;
	author?: PersonSchema;
	description?: string;
	inLanguage?: string;
	potentialAction?: any;
}

interface BreadcrumbSchema {
	'@context': string;
	'@type': 'BreadcrumbList';
	itemListElement: Array<{
		'@type': 'ListItem';
		position: number;
		name: string;
		item?: string;
	}>;
}

interface OrganizationSchema {
	'@context': string;
	'@type': 'Organization';
	name: string;
	url?: string;
	logo?: string;
	description?: string;
	email?: string;
	telephone?: string;
	address?: any;
	sameAs?: string[];
	founder?: any;
}

interface ServiceSchema {
	'@context': string;
	'@type': 'Service';
	name: string;
	description?: string;
	provider?: any;
	serviceType?: string;
	areaServed?: any;
}

export type StructuredData = PersonSchema | WebSiteSchema | BreadcrumbSchema | OrganizationSchema | ServiceSchema;

/**
 * Generator for JSON-LD structured data
 */
export class StructuredDataGenerator implements ISeoGenerator<StructuredData[]> {
	private schemas: StructuredData[] = [];

	generate(): StructuredData[] {
		return this.schemas;
	}

	validate(data: StructuredData[]): boolean {
		if (data.length === 0) {
			console.warn('SEO: No structured data schemas defined');
			return false;
		}

		for (const schema of data) {
			if (!schema['@context'] || !schema['@type']) {
				console.error('SEO: Invalid schema - missing @context or @type');
				return false;
			}
		}

		return true;
	}

	/**
	 * Add Person schema
	 */
	addPersonSchema(person: Omit<PersonSchema, '@context' | '@type'>): void {
		this.schemas.push({
			'@context': 'https://schema.org',
			'@type': 'Person',
			...person
		});
	}

	/**
	 * Add WebSite schema
	 */
	addWebSiteSchema(website: Omit<WebSiteSchema, '@context' | '@type'>): void {
		this.schemas.push({
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			...website
		});
	}

	/**
	 * Add Breadcrumb schema
	 */
	addBreadcrumbSchema(items: Array<{ name: string; url?: string }>): void {
		if (!Array.isArray(items)) {
			console.warn('addBreadcrumbSchema expects an array of items');
			return;
		}

		const breadcrumb: BreadcrumbSchema = {
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: items.map((item, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				name: item.name,
				item: item.url
			}))
		};

		this.schemas.push(breadcrumb);
	}

	/**
	 * Add Organization schema
	 */
	addOrganizationSchema(organization: Omit<OrganizationSchema, '@context' | '@type'>): void {
		this.schemas.push({
			'@context': 'https://schema.org',
			'@type': 'Organization',
			...organization
		});
	}

	/**
	 * Add Service schema
	 */
	addServiceSchema(service: Omit<ServiceSchema, '@context' | '@type'>): void {
		this.schemas.push({
			'@context': 'https://schema.org',
			'@type': 'Service',
			...service
		});
	}

	/**
	 * Clear all schemas
	 */
	clearSchemas(): void {
		this.schemas = [];
	}

	/**
	 * Get schema by type
	 */
	getSchemaByType(type: string): StructuredData | undefined {
		return this.schemas.find((schema) => schema['@type'] === type);
	}
}
