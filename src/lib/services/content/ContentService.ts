import type { IContentProvider } from './interfaces/IContentProvider';
import type { IContentValidator } from './interfaces/IContentValidator';
import type { TranslatableValue, Resume } from '$lib/types';

/**
 * Main content service following Single Responsibility Principle
 * Manages all content providers and ensures content validity
 */
export class ContentService {
	private providers: Map<string, IContentProvider<TranslatableValue>>;
	private validator: IContentValidator | null = null;

	constructor() {
		this.providers = new Map();
	}

	/**
	 * Register a content provider (Open/Closed Principle)
	 */
	registerProvider(key: string, provider: IContentProvider<TranslatableValue>): void {
		this.providers.set(key, provider);
	}

	/**
	 * Set the content validator (Dependency Inversion)
	 */
	setValidator(validator: IContentValidator): void {
		this.validator = validator;
	}

	/**
	 * Get content from a specific provider
	 */
	getContent(key: string): TranslatableValue | null {
		const provider = this.providers.get(key);
		if (!provider) {
			console.warn(`No provider registered for key: ${key}`);
			return null;
		}

		if (!provider.validate()) {
			console.error(`Content validation failed for provider: ${key}`);
			return null;
		}

		return provider.getContent();
	}

	/**
	 * Get all content aggregated
	 */
	getAllContent(): Record<string, TranslatableValue> {
		const content: Record<string, TranslatableValue> = {};

		for (const [key, provider] of this.providers) {
			const providerContent = this.getContent(key);
			if (providerContent) {
				content[key] = providerContent;
			}
		}

		return content;
	}

	/**
	 * Validate all registered content
	 */
	validateAllContent(): boolean {
		if (!this.validator) {
			console.warn('No validator set for ContentService');
			return true;
		}

		let isValid = true;
		for (const [key, provider] of this.providers) {
			const content = provider.getContent();
			if (
				!this.validator.validateCompleteness(content) ||
				!this.validator.validateFormat(content)
			) {
				console.error(
					`Validation failed for content: ${key}`,
					this.validator.getValidationErrors()
				);
				isValid = false;
			}
		}

		return isValid;
	}
}
