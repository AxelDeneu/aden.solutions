import type { ResumeValue } from '$lib/types/ResumeValue';

interface TestimonialItem {
	name: string;
	role: string;
	company?: string;
	testimonial: string;
	avatar?: string;
}

interface Testimonials extends ResumeValue {
	supLabel: string;
	label: string;
	description: string;
	items: TestimonialItem[];
}

export type { Testimonials, TestimonialItem };
