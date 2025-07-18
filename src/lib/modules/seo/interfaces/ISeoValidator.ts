/**
 * Interface for SEO validation
 */
export interface ISeoValidator {
	/**
	 * Validate meta tags
	 */
	validateMetaTags(tags: Record<string, string>): boolean;

	/**
	 * Validate structured data
	 */
	validateStructuredData(data: unknown): boolean;

	/**
	 * Get validation warnings
	 */
	getWarnings(): string[];
}
