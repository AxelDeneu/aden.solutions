import type { LocaleDictionary } from '$lib/types';
import type { ResumeValue } from '$lib/types';

export interface WorkExperienceItem {
	company: string;
	href: string;
	badges: string[];
	location: string | LocaleDictionary | (string | LocaleDictionary)[];
	title: string | LocaleDictionary | (string | LocaleDictionary)[];
	logoUrl: string;
	start: string;
	end: string;
	startDate?: Date;
	endDate?: Date;
	description: string | LocaleDictionary | (string | LocaleDictionary)[];
	technologies?: (string | LocaleDictionary | (string | LocaleDictionary)[])[];
}

export interface WorkExperience extends ResumeValue {
	label: string | LocaleDictionary | (string | LocaleDictionary)[];
	items: WorkExperienceItem[];
}
