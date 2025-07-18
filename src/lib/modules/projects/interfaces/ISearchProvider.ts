import type { EnhancedProject } from '../types/EnhancedProject';

export interface SearchResult {
	item: EnhancedProject;
	score: number;
}

export interface ISearchProvider {
	search(projects: EnhancedProject[], query: string): SearchResult[];
	configure(options: any): void;
}
