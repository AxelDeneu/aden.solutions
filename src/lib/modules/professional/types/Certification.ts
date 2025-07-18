export interface Certification {
	id: string;
	name: string;
	issuer: string;
	issueDate: string;
	expiryDate?: string;
	credentialId?: string;
	credentialUrl?: string;
	logo?: string;
}

export interface SpeakingEngagement {
	id: string;
	title: string;
	event: string;
	date: string;
	location: string;
	description?: string;
	slides?: string;
	video?: string;
	attendees?: number;
}
