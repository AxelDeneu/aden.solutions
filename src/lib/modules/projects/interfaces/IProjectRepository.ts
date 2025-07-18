import type { EnhancedProject, ProjectFilters } from '../types/EnhancedProject';

export interface IProjectRepository {
	getAllProjects(): Promise<EnhancedProject[]>;
	getProjectById(id: string): Promise<EnhancedProject | null>;
	getProjectBySlug(slug: string): Promise<EnhancedProject | null>;
	getFilteredProjects(filters: ProjectFilters): Promise<EnhancedProject[]>;
	getTechnologies(): Promise<string[]>;
	getCategories(): Promise<string[]>;
}
