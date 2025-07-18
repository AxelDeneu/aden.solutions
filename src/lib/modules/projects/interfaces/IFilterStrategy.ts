import type { EnhancedProject } from '../types/EnhancedProject';

export interface IFilterStrategy<T> {
	filter(projects: EnhancedProject[], criteria: T): EnhancedProject[];
}

export interface ICompositeFilter {
	addFilter(key: string, filter: IFilterStrategy<any>, criteria: any): void;
	removeFilter(key: string): void;
	applyFilters(projects: EnhancedProject[]): EnhancedProject[];
	clear(): void;
}
