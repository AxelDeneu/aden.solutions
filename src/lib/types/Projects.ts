import type { ResumeValue } from '$lib/types/ResumeValue';

interface Link {
	type: string;
	href: string;
	icon: string | any; // string for serializable data, component for runtime
}

interface ProjectItem {
	title: string;
	href?: string;
	dates: string;
	active?: boolean;
	featured?: boolean;
	description: string;
	technologies: string[];
	links?: Link[];
	image?: string;
	video?: string;
	demo?: string;
	github?: string;
}

interface Projects extends ResumeValue {
	supLabel: string;
	label: string;
	description: string;
	items: ProjectItem[];
}

export type { Projects, ProjectItem, Link };
