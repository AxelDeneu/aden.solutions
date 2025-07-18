import type { PageLoad } from './$types';
import { projectService } from '$lib/modules/projects/ProjectService';

export const load: PageLoad = async ({ url }) => {
	// Get query parameters
	const technologies = url.searchParams.get('tech')?.split(',').filter(Boolean) || [];
	const categories = url.searchParams.get('category')?.split(',').filter(Boolean) || [];
	const activeOnly = url.searchParams.get('active') === 'true';
	const search = url.searchParams.get('search') || undefined;

	// Get filtered projects
	const projects = await projectService.getFilteredProjects({
		technologies,
		categories,
		active: activeOnly,
		search
	});

	// Enhance with GitHub stats
	const enhancedProjects = await projectService.enhanceProjectsWithStats(projects);

	// Get available filters
	const allTechnologies = await projectService.getTechnologies();
	const allCategories = await projectService.getCategories();
	const stats = await projectService.getProjectStats();

	return {
		projects: enhancedProjects,
		filters: {
			technologies: allTechnologies,
			categories: allCategories
		},
		activeFilters: {
			technologies,
			categories,
			activeOnly,
			search
		},
		stats
	};
};
