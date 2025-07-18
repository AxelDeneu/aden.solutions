import type { IProjectRepository } from '../interfaces/IProjectRepository';
import type { EnhancedProject, ProjectFilters } from '../types/EnhancedProject';
import type { Projects, ProjectItem } from '$lib/types/Projects';
import type { Unsubscriber } from 'svelte/store';
import projects from '$lib/static/projects';
import { get } from 'svelte/store';
import { CompositeFilter } from '../filters/CompositeFilter';
import { TechnologyFilter } from '../filters/TechnologyFilter';
import { CategoryFilter } from '../filters/CategoryFilter';
import { StatusFilter } from '../filters/StatusFilter';

export class StaticProjectRepository implements IProjectRepository {
	private projects: EnhancedProject[] = [];
	private compositeFilter = new CompositeFilter();
	private unsubscribe: Unsubscriber | null = null;

	constructor() {
		this.subscribeToProjects();
	}

	private subscribeToProjects(): void {
		// Subscribe to the projects store to get updates when locale changes
		this.unsubscribe = projects.subscribe((projectData) => {
			this.initializeProjects(projectData);
		});
	}

	private initializeProjects(projectData: Projects): void {
		this.projects = projectData.items.map((project, index) => ({
			...project,
			id: `project-${index}`,
			category: this.extractCategory(project),
			slug: this.generateSlug(project.title)
		}));
	}

	private extractCategory(project: any): string {
		// Extract category from technologies or default
		if (project.technologies.includes('SvelteKit')) return 'Frontend';
		if (project.technologies.includes('Laravel')) return 'Backend';
		if (project.technologies.includes('PHP')) return 'Backend';
		return 'Fullstack';
	}

	private generateSlug(title: string): string {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}

	async getAllProjects(): Promise<EnhancedProject[]> {
		return [...this.projects];
	}

	async getProjectById(id: string): Promise<EnhancedProject | null> {
		return this.projects.find((p) => p.id === id) || null;
	}

	async getProjectBySlug(slug: string): Promise<EnhancedProject | null> {
		return this.projects.find((p) => p.slug === slug) || null;
	}

	async getFilteredProjects(filters: ProjectFilters): Promise<EnhancedProject[]> {
		this.compositeFilter.clear();

		if (filters.technologies && filters.technologies.length > 0) {
			this.compositeFilter.addFilter('technology', new TechnologyFilter(), filters.technologies);
		}

		if (filters.categories && filters.categories.length > 0) {
			this.compositeFilter.addFilter('category', new CategoryFilter(), filters.categories);
		}

		if (filters.active !== undefined) {
			this.compositeFilter.addFilter('status', new StatusFilter(), filters.active);
		}

		return this.compositeFilter.applyFilters(this.projects);
	}

	async getTechnologies(): Promise<string[]> {
		const techSet = new Set<string>();

		this.projects.forEach((project) => {
			project.technologies.forEach((tech) => techSet.add(tech));
		});

		return Array.from(techSet).sort();
	}

	async getCategories(): Promise<string[]> {
		const categorySet = new Set<string>();

		this.projects.forEach((project) => {
			if (project.category) {
				categorySet.add(project.category);
			}
		});

		return Array.from(categorySet).sort();
	}

	/**
	 * Clean up subscriptions
	 */
	destroy(): void {
		if (this.unsubscribe) {
			this.unsubscribe();
			this.unsubscribe = null;
		}
	}
}
