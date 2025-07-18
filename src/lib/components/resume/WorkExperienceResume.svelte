<script lang="ts">
	import type { WorkExperience } from '$lib/types';
	import { Calendar, MapPin } from '@lucide/svelte';
	import { __ } from '$lib/i18n';

	interface Props {
		workExperience: WorkExperience;
	}

	let { workExperience }: Props = $props();

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

<div class="work-experience-resume">
	{#each workExperience.items as job, index}
		<div class="job-entry mb-6 {index < workExperience.items.length - 1 ? 'pb-6 border-b border-border' : ''}">
			<div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
				<div>
					<h4 class="text-lg font-semibold">{__(job.title)}</h4>
					<h5 class="text-base font-medium text-primary">{__(job.company)}</h5>
				</div>
				<div class="flex flex-col sm:items-end text-sm text-muted-foreground mt-2 sm:mt-0">
					<div class="flex items-center gap-1">
						<Calendar class="h-3 w-3" />
						<span>{formatDateRange(job.start, job.end)}</span>
					</div>
					{#if job.location}
						<div class="flex items-center gap-1 mt-1">
							<MapPin class="h-3 w-3" />
							<span>{__(job.location)}</span>
						</div>
					{/if}
				</div>
			</div>
			
			<!-- Job Description -->
			<div class="prose prose-sm prose-neutral dark:prose-invert max-w-none mb-3">
				<p>{__(job.description)}</p>
			</div>
			
			<!-- Technologies/Skills -->
			{#if job.badges && job.badges.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each job.badges as badge}
						<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
							{badge}
						</span>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	@media print {
		.job-entry {
			break-inside: avoid;
			page-break-inside: avoid;
		}
		
		.job-entry {
			border-color: #e5e7eb !important;
		}
		
		.job-entry span {
			background-color: #f3f4f6 !important;
			color: #374151 !important;
		}
	}
</style>