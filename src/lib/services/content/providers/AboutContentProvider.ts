import type { IContentProvider } from '../interfaces/IContentProvider';
import type { TranslatableValue } from '$lib/types';

interface AboutContent extends Record<string, unknown> {
	greetings: string;
	description: string;
	summary: string;
	bio?: string;
}

/**
 * Provider for About section content
 * Single Responsibility: Manages only about-related content
 */
export class AboutContentProvider implements IContentProvider<AboutContent> {
	private content: AboutContent;

	constructor() {
		// Default content - will be replaced with actual content
		this.content = {
			greetings: 'about.greetings',
			description: 'about.description',
			summary: 'about.summary',
			bio: 'about.bio'
		};
	}

	getContent(): AboutContent {
		return this.content;
	}

	validate(): boolean {
		// Ensure all required fields are present and not placeholder
		const required = ['greetings', 'description', 'summary'];
		for (const field of required) {
			if (!this.content[field as keyof AboutContent]) {
				return false;
			}
			// Check if still using placeholder keys
			if (this.content[field as keyof AboutContent] === field) {
				console.warn(`AboutContentProvider: ${field} is still using placeholder content`);
			}
		}
		return true;
	}

	getContentKey(): string {
		return 'about';
	}

	/**
	 * Update content (useful for dynamic updates)
	 */
	updateContent(content: Partial<AboutContent>): void {
		this.content = { ...this.content, ...content };
	}
}
