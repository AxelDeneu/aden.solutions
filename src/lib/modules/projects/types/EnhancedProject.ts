import type { ProjectItem } from '$lib/types/Projects';

export interface EnhancedProject extends ProjectItem {
	id: string;
	slug?: string;
	category?: string;
	stars?: number;
	forks?: number;
	lastUpdate?: string;
	language?: string;
	topics?: string[];
}

export interface ProjectFilters {
	technologies?: string[];
	categories?: string[];
	active?: boolean;
	search?: string;
}

export interface ProjectStats {
	totalProjects: number;
	activeProjects: number;
	totalStars: number;
	totalForks: number;
	technologiesUsed: string[];
}
