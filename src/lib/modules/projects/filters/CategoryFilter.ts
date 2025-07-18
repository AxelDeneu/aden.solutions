import type { IFilterStrategy } from '../interfaces/IFilterStrategy';
import type { EnhancedProject } from '../types/EnhancedProject';

export class CategoryFilter implements IFilterStrategy<string[]> {
	filter(projects: EnhancedProject[], categories: string[]): EnhancedProject[] {
		if (!categories || categories.length === 0) {
			return projects;
		}

		return projects.filter((project) => project.category && categories.includes(project.category));
	}
}
