<script lang="ts">
	import type { Projects } from '$lib/types';
	import { ExternalLink, Github, Calendar } from '@lucide/svelte';
	import { __ } from '$lib/i18n';

	interface Props {
		projects: Projects;
	}

	let { projects }: Props = $props();

	// Show only featured projects for resume (limit to top 3-4)
	const featuredProjects = $derived(() => {
		return projects.items.slice(0, 4);
	});

	function formatDate(dateString: string): string {
		try {
			const date = new Date(dateString);
			return new Intl.DateTimeFormat('en', { 
				month: 'short', 
				year: 'numeric' 
			}).format(date);
		} catch {
			return dateString;
		}
	}
</script>

<div class="projects-resume">
	{#each featuredProjects as project, index}
		<div class="project-entry mb-6 {index < featuredProjects.length - 1 ? 'pb-6 border-b border-border' : ''}">
			<div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
				<div class="flex-1">
					<h4 class="text-lg font-semibold">{__(project.title)}</h4>
					{#if project.dates}
						<div class="flex items-center gap-1 text-sm text-muted-foreground mt-1">
							<Calendar class="h-3 w-3" />
							<span>{formatDate(project.dates)}</span>
						</div>
					{/if}
				</div>
				
				<!-- Project Links -->
				{#if project.links && project.links.length > 0}
					<div class="flex items-center gap-2 mt-2 sm:mt-0">
						{#each project.links as link}
							<a 
								href={link.href} 
								class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
								target="_blank"
								rel="noopener noreferrer"
							>
								{#if link.type === 'github'}
									<Github class="h-4 w-4" />
								{:else}
									<ExternalLink class="h-4 w-4" />
								{/if}
								<span class="hidden sm:inline">{link.type === 'github' ? 'Code' : 'Demo'}</span>
							</a>
						{/each}
					</div>
				{/if}
			</div>
			
			<!-- Project Description -->
			<div class="prose prose-sm prose-neutral dark:prose-invert max-w-none mb-3">
				<p>{__(project.description)}</p>
			</div>
			
			<!-- Technologies -->
			{#if project.techStack && project.techStack.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each project.techStack as tech}
						<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
							{tech}
						</span>
					{/each}
				</div>
			{/if}
			
			<!-- Project Metrics (if available) -->
			{#if project.metrics}
				<div class="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
					{#if project.metrics.stars}
						<span class="flex items-center gap-1">
							⭐ {project.metrics.stars} stars
						</span>
					{/if}
					{#if project.metrics.forks}
						<span class="flex items-center gap-1">
							🍴 {project.metrics.forks} forks
						</span>
					{/if}
					{#if project.metrics.users}
						<span class="flex items-center gap-1">
							👥 {project.metrics.users} users
						</span>
					{/if}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	@media print {
		.project-entry {
			break-inside: avoid;
			page-break-inside: avoid;
		}
		
		.project-entry {
			border-color: #e5e7eb !important;
		}
		
		.project-entry span {
			background-color: #f3f4f6 !important;
			color: #374151 !important;
		}
		
		.project-entry a {
			color: #374151 !important;
			text-decoration: none !important;
		}
	}
</style>