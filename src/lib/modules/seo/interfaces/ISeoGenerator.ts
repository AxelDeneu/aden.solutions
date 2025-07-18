/**
 * Interface for SEO generators following Interface Segregation Principle
 */
export interface ISeoGenerator<T> {
	/**
	 * Generate SEO content
	 */
	generate(): T;

	/**
	 * Validate generated content
	 */
	validate(content: T): boolean;
}
