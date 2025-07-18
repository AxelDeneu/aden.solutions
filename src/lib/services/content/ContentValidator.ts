import type { IContentValidator } from './interfaces/IContentValidator';

/**
 * Default content validator implementation
 */
export class ContentValidator implements IContentValidator {
	private errors: string[] = [];

	validateCompleteness(content: unknown): boolean {
		this.errors = [];

		if (!content) {
			this.errors.push('Content is null or undefined');
			return false;
		}

		if (typeof content === 'object') {
			return this.validateObject(content as Record<string, unknown>);
		}

		return true;
	}

	validateFormat(content: unknown): boolean {
		// Check for common format issues
		if (typeof content === 'string') {
			// Check for placeholder text
			if (
				content.includes('Lorem ipsum') ||
				content === 'Description' ||
				content === 'Summary' ||
				content === 'Greetings'
			) {
				this.errors.push(`Found placeholder text: "${content}"`);
				return false;
			}
		}

		return true;
	}

	getValidationErrors(): string[] {
		return [...this.errors];
	}

	private validateObject(obj: Record<string, unknown>): boolean {
		let isValid = true;

		for (const [key, value] of Object.entries(obj)) {
			if (value === null || value === undefined) {
				this.errors.push(`Field "${key}" is null or undefined`);
				isValid = false;
			}

			// Recursively validate nested objects
			if (typeof value === 'object' && value !== null) {
				if (Array.isArray(value)) {
					if (value.length === 0) {
						this.errors.push(`Array "${key}" is empty`);
					}
					value.forEach((item, index) => {
						if (typeof item === 'object') {
							this.validateObject(item as Record<string, unknown>);
						}
					});
				} else {
					this.validateObject(value as Record<string, unknown>);
				}
			}

			// Check for placeholder strings
			if (typeof value === 'string' && !this.validateFormat(value)) {
				isValid = false;
			}
		}

		return isValid;
	}
}
