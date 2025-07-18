import type { ResumeValue } from '$lib/types';

interface EducationItem {
	school: string;
	href?: string;
	degree: string;
	logoUrl: string;
	start: string;
	end: string;
}

interface Education extends ResumeValue {
	label: string;
	items: EducationItem[];
}

export type { Education, EducationItem };
