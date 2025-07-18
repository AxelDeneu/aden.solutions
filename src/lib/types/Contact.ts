import type { ResumeValue } from '$lib/types';

interface SocialLink {
	name: string;
	url: string;
	icon: string;
	navbar: boolean;
	dark_icon: string;
}

interface ContactMethods extends ResumeValue {
	email: string;
	tel: string;
	social: {
		[key: string]: SocialLink;
	};
}

interface Contact extends ResumeValue {
	label: string;
	description: string;
	methods: ContactMethods;
}

export type { Contact, ContactMethods, SocialLink };
