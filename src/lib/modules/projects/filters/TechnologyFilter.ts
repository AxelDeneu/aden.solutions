import type { IFilterStrategy } from '../interfaces/IFilterStrategy';
import type { EnhancedProject } from '../types/EnhancedProject';

export class TechnologyFilter implements IFilterStrategy<string[]> {
	filter(projects: EnhancedProject[], technologies: string[]): EnhancedProject[] {
		if (!technologies || technologies.length === 0) {
			return projects;
		}

		return projects.filter((project) =>
			project.technologies.some((tech) => technologies.includes(tech.toLowerCase()))
		);
	}
}
