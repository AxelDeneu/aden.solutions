import type { IContentProvider } from '../interfaces/IContentProvider';
import type { Testimonials } from '$lib/types';

/**
 * Provider for testimonials content
 * Single Responsibility: Manages only testimonial-related content
 */
export class TestimonialContentProvider implements IContentProvider<Testimonials> {
	private content: Testimonials;

	constructor() {
		// Initialize with empty testimonials - to be filled with real data
		this.content = {
			supLabel: 'testimonials.supLabel',
			label: 'testimonials.label',
			description: 'testimonials.description',
			items: []
		};
	}

	getContent(): Testimonials {
		return this.content;
	}

	validate(): boolean {
		// Validate structure
		if (!this.content.supLabel || !this.content.label || !this.content.description) {
			return false;
		}

		// Warn if no testimonials
		if (this.content.items.length === 0) {
			console.warn('TestimonialContentProvider: No testimonials provided');
		}

		// Validate each testimonial has required fields
		for (const item of this.content.items) {
			if (!item.name || !item.role || !item.testimonial) {
				return false;
			}
		}

		return true;
	}

	getContentKey(): string {
		return 'testimonials';
	}

	/**
	 * Add a testimonial
	 */
	addTestimonial(testimonial: {
		name: string;
		role: string;
		company?: string;
		testimonial: string;
		avatar?: string;
	}): void {
		this.content.items.push(testimonial);
	}

	/**
	 * Update all testimonials
	 */
	updateTestimonials(testimonials: Testimonials): void {
		this.content = testimonials;
	}
}
