import type { ICompositeFilter, IFilterStrategy } from '../interfaces/IFilterStrategy';
import type { EnhancedProject } from '../types/EnhancedProject';

export class CompositeFilter implements ICompositeFilter {
	private filters: Map<string, { filter: IFilterStrategy<any>; criteria: any }> = new Map();

	addFilter(key: string, filter: IFilterStrategy<any>, criteria: any): void {
		this.filters.set(key, { filter, criteria });
	}

	removeFilter(key: string): void {
		this.filters.delete(key);
	}

	applyFilters(projects: EnhancedProject[]): EnhancedProject[] {
		let filteredProjects = projects;

		for (const { filter, criteria } of this.filters.values()) {
			filteredProjects = filter.filter(filteredProjects, criteria);
		}

		return filteredProjects;
	}

	clear(): void {
		this.filters.clear();
	}
}
