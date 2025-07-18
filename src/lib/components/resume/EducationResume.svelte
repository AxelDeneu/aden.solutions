<script lang="ts">
	import type { Education } from '$lib/types';
	import { Calendar, GraduationCap, MapPin } from '@lucide/svelte';
	import { __ } from '$lib/i18n';

	interface Props {
		education: Education;
	}

	let { education }: Props = $props();

	function formatDateRange(start: string, end?: string): string {
		const startDate = new Date(start);
		const endDate = end ? new Date(end) : null;
		
		const formatter = new Intl.DateTimeFormat('en', { 
			month: 'short', 
			year: 'numeric' 
		});
		
		if (endDate) {
			return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
		} else {
			return `${formatter.format(startDate)} - Present`;
		}
	}
</script>

<div class="education-resume">
	{#each education.items as edu, index}
		<div class="education-entry mb-6 {index < education.items.length - 1 ? 'pb-6 border-b border-border' : ''}">
			<div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
				<div>
					<h4 class="text-lg font-semibold flex items-center gap-2">
						<GraduationCap class="h-5 w-5 text-primary" />
						{__(edu.degree)}
					</h4>
					<h5 class="text-base font-medium text-primary ml-7">{__(edu.school)}</h5>
				</div>
				<div class="flex flex-col sm:items-end text-sm text-muted-foreground mt-2 sm:mt-0">
					<div class="flex items-center gap-1">
						<Calendar class="h-3 w-3" />
						<span>{formatDateRange(edu.start, edu.end)}</span>
					</div>
					{#if edu.location}
						<div class="flex items-center gap-1 mt-1">
							<MapPin class="h-3 w-3" />
							<span>{__(edu.location)}</span>
						</div>
					{/if}
				</div>
			</div>
			
			<!-- Education Description -->
			{#if edu.description}
				<div class="prose prose-sm prose-neutral dark:prose-invert max-w-none mb-3 ml-7">
					<p>{__(edu.description)}</p>
				</div>
			{/if}
			
			<!-- Specializations/Skills -->
			{#if edu.skills && edu.skills.length > 0}
				<div class="flex flex-wrap gap-2 ml-7">
					{#each edu.skills as skill}
						<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
							{skill}
						</span>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	@media print {
		.education-entry {
			break-inside: avoid;
			page-break-inside: avoid;
		}
		
		.education-entry {
			border-color: #e5e7eb !important;
		}
		
		.education-entry span {
			background-color: #f3f4f6 !important;
			color: #374151 !important;
		}
	}
</style>