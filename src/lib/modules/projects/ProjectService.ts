import type { IProjectRepository } from './interfaces/IProjectRepository';
import type { ISearchProvider } from './interfaces/ISearchProvider';
import type { IStatsProvider } from './interfaces/IStatsProvider';
import type { EnhancedProject, ProjectFilters, ProjectStats } from './types/EnhancedProject';
import { StaticProjectRepository } from './repositories/StaticProjectRepository';
import { FuseSearchProvider } from './providers/FuseSearchProvider';
import { GitHubStatsProvider } from './providers/GitHubStatsProvider';

export class ProjectService {
	private repository: IProjectRepository;
	private searchProvider: ISearchProvider;
	private statsProvider: IStatsProvider;

	constructor(
		repository?: IProjectRepository,
		searchProvider?: ISearchProvider,
		statsProvider?: IStatsProvider
	) {
		this.repository = repository || new StaticProjectRepository();
		this.searchProvider = searchProvider || new FuseSearchProvider();
		this.statsProvider = statsProvider || new GitHubStatsProvider();
	}

	async getAllProjects(): Promise<EnhancedProject[]> {
		return this.repository.getAllProjects();
	}

	async getProjectBySlug(slug: string): Promise<EnhancedProject | null> {
		const project = await this.repository.getProjectBySlug(slug);

		if (project && project.github) {
			// Enhance with GitHub stats
			const stats = await this.statsProvider.getStats(project.github);
			if (stats) {
				project.stars = stats.stars;
				project.forks = stats.forks;
				project.lastUpdate = stats.lastUpdate;
				project.language = stats.language;
				project.topics = stats.topics;
			}
		}

		return project;
	}

	async getFilteredProjects(filters: ProjectFilters): Promise<EnhancedProject[]> {
		let projects = await this.repository.getFilteredProjects(filters);

		// Apply search if provided
		if (filters.search) {
			const searchResults = this.searchProvider.search(projects, filters.search);
			projects = searchResults
				.filter((result) => result.score < 0.6) // Lower score = better match in Fuse.js
				.map((result) => result.item);
		}

		return projects;
	}

	async searchProjects(query: string): Promise<EnhancedProject[]> {
		const allProjects = await this.getAllProjects();
		const results = this.searchProvider.search(allProjects, query);

		return results.filter((result) => result.score < 0.6).map((result) => result.item);
	}

	async getTechnologies(): Promise<string[]> {
		return this.repository.getTechnologies();
	}

	async getCategories(): Promise<string[]> {
		return this.repository.getCategories();
	}

	async getProjectStats(): Promise<ProjectStats> {
		const projects = await this.getAllProjects();
		const technologies = new Set<string>();
		let totalStars = 0;
		let totalForks = 0;

		projects.forEach((project) => {
			project.technologies.forEach((tech) => technologies.add(tech));
			totalStars += project.stars || 0;
			totalForks += project.forks || 0;
		});

		return {
			totalProjects: projects.length,
			activeProjects: projects.filter((p) => p.active).length,
			totalStars,
			totalForks,
			technologiesUsed: Array.from(technologies)
		};
	}

	async enhanceProjectsWithStats(projects: EnhancedProject[]): Promise<EnhancedProject[]> {
		const githubUrls = projects.filter((p) => p.github).map((p) => p.github!);

		if (githubUrls.length === 0) return projects;

		const statsMap = await this.statsProvider.getBulkStats(githubUrls);

		return projects.map((project) => {
			if (project.github && statsMap.has(project.github)) {
				const stats = statsMap.get(project.github)!;
				return {
					...project,
					stars: stats.stars,
					forks: stats.forks,
					lastUpdate: stats.lastUpdate,
					language: stats.language,
					topics: stats.topics
				};
			}
			return project;
		});
	}
}

// Singleton instance
export const projectService = new ProjectService();
