import type { IContentProvider } from '../interfaces/IContentProvider';
import type { Projects } from '$lib/types';

/**
 * Provider for projects content
 * Single Responsibility: Manages only project-related content
 */
export class ProjectContentProvider implements IContentProvider<Projects> {
	private content: Projects;

	constructor() {
		// Initialize with structure - to be filled with real project data
		this.content = {
			supLabel: 'projects.supLabel',
			label: 'projects.label',
			description: 'projects.description',
			items: []
		};
	}

	getContent(): Projects {
		return this.content;
	}

	validate(): boolean {
		// Validate structure
		if (!this.content.supLabel || !this.content.label || !this.content.description) {
			return false;
		}

		// Warn if no projects
		if (this.content.items.length === 0) {
			console.warn('ProjectContentProvider: No projects provided');
		}

		// Validate each project
		for (const project of this.content.items) {
			if (!project.title || !project.description || !project.dates) {
				return false;
			}
			// Ensure at least one link is provided
			if (!project.href && !project.demo && !project.github) {
				console.warn(`Project "${project.title}" has no links`);
			}
		}

		return true;
	}

	getContentKey(): string {
		return 'projects';
	}

	/**
	 * Add a project
	 */
	addProject(project: {
		title: string;
		description: string;
		dates: string;
		technologies: string[];
		href?: string;
		demo?: string;
		github?: string;
		image?: string;
		active?: boolean;
	}): void {
		this.content.items.push(project);
	}

	/**
	 * Update all projects
	 */
	updateProjects(projects: Projects): void {
		this.content = projects;
	}

	/**
	 * Get active projects only
	 */
	getActiveProjects(): Projects {
		return {
			...this.content,
			items: this.content.items.filter((p) => p.active !== false)
		};
	}
}
