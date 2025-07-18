import type { SkillVisualizationData, SkillCategory, SkillMetric } from './types/SkillMetrics';
import type { Resume } from '$lib/types';

export class SkillVisualizationService {
	generateSkillData(resume: Resume): SkillVisualizationData {
		const categories: SkillCategory[] = [];
		let totalSkills = 0;
		let totalLevel = 0;

		// Convert resume skills to visualization format
		const categoryName = 'Technical Skills';
		const skillMetrics: SkillMetric[] = resume.skills.map((skillName, index) => {
			// Generate mock proficiency data - in real app this would come from data
			const level = this.generateSkillLevel(skillName, categoryName);
			const yearsExp = this.generateYearsExperience(skillName);
			const lastUsed = this.generateLastUsed(skillName);
			const projectCount = this.generateProjectCount(skillName);

			totalLevel += level;
			totalSkills++;

			return {
				name: skillName,
				level,
				category: categoryName,
				yearsOfExperience: yearsExp,
				lastUsed,
				projects: projectCount
			};
		});

		categories.push({
			name: categoryName,
			skills: skillMetrics.sort((a, b) => b.level - a.level), // Sort by level desc
			color: this.getCategoryColor(categoryName)
		});

		return {
			categories,
			totalSkills,
			averageLevel: totalSkills > 0 ? Math.round(totalLevel / totalSkills) : 0
		};
	}

	private generateSkillLevel(skillName: string, category: string): number {
		// Generate consistent but realistic skill levels based on skill name
		const hash = this.hashString(skillName + category);

		// Define skill tiers based on common technologies
		const expertSkills = ['PHP', 'Laravel', 'JavaScript', 'TypeScript', 'HTML', 'CSS'];
		const advancedSkills = ['Vue.js', 'Svelte', 'SvelteKit', 'MySQL', 'Git', 'Docker'];
		const intermediateSkills = ['React', 'Node.js', 'Python', 'PostgreSQL', 'AWS'];

		if (expertSkills.some((expert) => skillName.toLowerCase().includes(expert.toLowerCase()))) {
			return 85 + (hash % 15); // 85-99%
		} else if (
			advancedSkills.some((advanced) => skillName.toLowerCase().includes(advanced.toLowerCase()))
		) {
			return 70 + (hash % 20); // 70-89%
		} else if (
			intermediateSkills.some((intermediate) =>
				skillName.toLowerCase().includes(intermediate.toLowerCase())
			)
		) {
			return 55 + (hash % 25); // 55-79%
		} else {
			return 40 + (hash % 35); // 40-74%
		}
	}

	private generateYearsExperience(skillName: string): number {
		const hash = this.hashString(skillName);
		// Generate 1-8 years of experience
		return 1 + (hash % 8);
	}

	private generateLastUsed(skillName: string): string {
		const hash = this.hashString(skillName + 'lastused');
		const options = ['2024', '2023', '2022', '2021', 'Currently using'];
		return options[hash % options.length];
	}

	private generateProjectCount(skillName: string): number {
		const hash = this.hashString(skillName + 'projects');
		// Generate 1-20 projects
		return 1 + (hash % 20);
	}

	private getCategoryColor(categoryName: string): string {
		const colors = {
			Languages: '#3B82F6', // blue
			Frameworks: '#10B981', // green
			Databases: '#F59E0B', // yellow
			Tools: '#EF4444', // red
			Cloud: '#8B5CF6', // purple
			Frontend: '#06B6D4', // cyan
			Backend: '#84CC16', // lime
			DevOps: '#F97316' // orange
		};

		return colors[categoryName as keyof typeof colors] || '#6B7280'; // gray as default
	}

	private hashString(str: string): number {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32-bit integer
		}
		return Math.abs(hash);
	}

	getTopSkills(data: SkillVisualizationData, limit: number = 5): SkillMetric[] {
		const allSkills = data.categories.flatMap((category) => category.skills);
		return allSkills.sort((a, b) => b.level - a.level).slice(0, limit);
	}

	getSkillsByCategory(data: SkillVisualizationData, categoryName: string): SkillMetric[] {
		const category = data.categories.find((cat) => cat.name === categoryName);
		return category ? category.skills : [];
	}

	calculateCategoryAverage(category: SkillCategory): number {
		if (category.skills.length === 0) return 0;
		const total = category.skills.reduce((sum, skill) => sum + skill.level, 0);
		return Math.round(total / category.skills.length);
	}
}

// Singleton instance
export const skillVisualizationService = new SkillVisualizationService();
