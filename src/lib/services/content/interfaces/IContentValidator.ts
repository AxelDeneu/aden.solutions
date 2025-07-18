/**
 * Interface for content validation following Interface Segregation Principle
 */
export interface IContentValidator {
	/**
	 * Validate content completeness
	 */
	validateCompleteness(content: unknown): boolean;

	/**
	 * Validate content format
	 */
	validateFormat(content: unknown): boolean;

	/**
	 * Get validation errors if any
	 */
	getValidationErrors(): string[];
}
