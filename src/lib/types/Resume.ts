import type {
	Contact,
	Customers,
	Education,
	Projects,
	Testimonials,
	WorkExperience
} from '$lib/types';

type Resume = {
	seo: {
		title: string;
		description: string;
		keywords?: string;
		author?: string;
		image?: string;
		imageAlt?: string;
		twitterCreator?: string;
		locale?: string;
	};
	social?: {
		github?: string;
		linkedin?: string;
		twitter?: string;
		email?: string;
		malt?: string;
	};
	customers: Customers;
	workExperience: WorkExperience;
	education: Education;
	skills: Array<string>;
	projects: Projects;
	contact: Contact;
	testimonials: Testimonials;
} & Record<string, string>;

export type { Resume };
