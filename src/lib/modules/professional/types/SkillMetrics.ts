export interface SkillMetric {
	name: string;
	level: number; // 0-100
	category: string;
	yearsOfExperience?: number;
	lastUsed?: string;
	projects?: number;
}

export interface SkillCategory {
	name: string;
	skills: SkillMetric[];
	color?: string;
}

export interface SkillVisualizationData {
	categories: SkillCategory[];
	totalSkills: number;
	averageLevel: number;
}
