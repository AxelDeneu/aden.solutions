import type { TranslatableValue } from '$lib/types';

/**
 * Interface for content providers following SOLID principles
 * Each provider is responsible for a single content domain
 */
export interface IContentProvider<T extends TranslatableValue> {
	/**
	 * Get the content for this provider
	 */
	getContent(): T;

	/**
	 * Validate that the content meets requirements
	 */
	validate(): boolean;

	/**
	 * Get the content key for translation purposes
	 */
	getContentKey(): string;
}
