<script lang="ts">
	import { __ } from '$lib/i18n';

	interface Props {
		skills: string[];
	}

	let { skills }: Props = $props();

	// Group skills by category for better organization
	const skillCategories = $derived(() => {
		// Define skill categories
		const categories: Record<string, string[]> = {
			'Backend': [],
			'Frontend': [],
			'Database': [],
			'DevOps': [],
			'Other': []
		};
		
		// Categorize skills
		skills.forEach(skill => {
			if (['PHP', 'Laravel', 'Symfony', 'Node.js', 'REST API', 'GraphQL'].includes(skill)) {
				categories['Backend'].push(skill);
			} else if (['TypeScript', 'Svelte', 'SvelteKit', 'Vue.js', 'React', 'Inertia.js', 'TailwindCSS', 'SASS', 'LESS'].includes(skill)) {
				categories['Frontend'].push(skill);
			} else if (['PostgreSQL', 'MySQL', 'Redis'].includes(skill)) {
				categories['Database'].push(skill);
			} else if (['Docker', 'Git', 'Nginx', 'Linux'].includes(skill)) {
				categories['DevOps'].push(skill);
			} else {
				categories['Other'].push(skill);
			}
		});
		
		// Remove empty categories
		return Object.fromEntries(
			Object.entries(categories).filter(([_, skills]) => skills.length > 0)
		);
	});
</script>

<div class="skills-resume">
	{#each Object.entries(skillCategories) as [category, skillList]}
		<div class="skill-category mb-6">
			<h4 class="text-lg font-semibold mb-3 text-primary">{__(category)}</h4>
			<div class="flex flex-wrap gap-2">
				{#each skillList as skill}
					<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
						{skill}
					</span>
				{/each}
			</div>
		</div>
	{/each}
	
	<!-- Fallback: if no categories, show all skills -->
	{#if Object.keys(skillCategories).length === 0}
		<div class="flex flex-wrap gap-2">
			{#each skills as skill}
				<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
					{skill}
				</span>
			{/each}
		</div>
	{/if}
</div>

<style>
	@media print {
		.skill-category {
			break-inside: avoid;
			page-break-inside: avoid;
		}
		
		.skill-category span {
			background-color: #f3f4f6 !important;
			color: #374151 !important;
			border-color: #d1d5db !important;
		}
		
		.skill-category h4 {
			color: #111827 !important;
		}
	}
</style>