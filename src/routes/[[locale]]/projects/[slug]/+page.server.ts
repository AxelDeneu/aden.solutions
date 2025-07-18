import type { PageServerLoad } from './$types';
import { projectService } from '$lib/modules/projects/ProjectService';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const project = await projectService.getProjectBySlug(params.slug);

	if (!project) {
		throw error(404, 'Project not found');
	}

	// Get similar projects (same category or overlapping technologies)
	const allProjects = await projectService.getAllProjects();
	const similarProjects = allProjects
		.filter((p) => p.slug !== project.slug)
		.filter(
			(p) =>
				p.category === project.category ||
				p.technologies.some((tech) => project.technologies.includes(tech))
		)
		.slice(0, 3);

	return {
		project,
		similarProjects
	};
};
