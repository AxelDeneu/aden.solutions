import type { IFilterStrategy } from '../interfaces/IFilterStrategy';
import type { EnhancedProject } from '../types/EnhancedProject';

export class StatusFilter implements IFilterStrategy<boolean> {
	filter(projects: EnhancedProject[], activeOnly: boolean): EnhancedProject[] {
		if (!activeOnly) {
			return projects;
		}

		return projects.filter((project) => project.active === true);
	}
}
