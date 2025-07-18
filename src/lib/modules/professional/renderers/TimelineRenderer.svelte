<script lang="ts">
	import type { WorkExperience } from '$lib/types';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Building, MapPin, Calendar } from '@lucide/svelte';
	import { _ } from 'svelte-i18n';
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import { BLUR_FADE_DELAY } from '$lib/static/consts';

	interface Props {
		workExperience: WorkExperience;
		title?: string;
	}

	let { workExperience, title }: Props = $props();
	
	const translatedTitle = $derived(title || $_('workExperience.careerTimeline'));

	function getTranslation(value: any): string {
		if (typeof value === 'string') return value;
		if (value && typeof value === 'object') {
			return value['en'] || Object.values(value)[0] || '';
		}
		return '';
	}

	function calculateDuration(work: any): string {
		// Use raw dates if available
		const startDate = work.startDate || new Date(getTranslation(work.start));
		const endDate = work.endDate || (isOngoing(getTranslation(work.end)) ? new Date() : new Date(getTranslation(work.end)));

		const monthsDiff =
			(endDate.getFullYear() - startDate.getFullYear()) * 12 +
			(endDate.getMonth() - startDate.getMonth());

		const years = Math.floor(monthsDiff / 12);
		const months = monthsDiff % 12;

		if (years === 0) return `${months} ${months === 1 ? $_('workExperience.month') : $_('workExperience.months')}`;
		if (months === 0) return `${years} ${years === 1 ? $_('workExperience.year') : $_('workExperience.years')}`;
		return `${years} ${years === 1 ? $_('workExperience.year') : $_('workExperience.years')} ${months} ${months === 1 ? $_('workExperience.month') : $_('workExperience.months')}`;
	}

	function isOngoing(end: string): boolean {
		return (
			end === 'Present' ||
			end.toLowerCase().includes('present') ||
			end.toLowerCase().includes("aujourd'hui")
		);
	}
</script>

<div class="timeline-container">
	<div class="relative grid gap-y-4 overflow-hidden">
		<!-- Timeline line -->
		<div class="absolute bottom-0 left-5 sm:left-6 top-0 w-0.5 bg-gradient-to-b from-primary to-muted"></div>

		{#each workExperience.items as work, index}
			<BlurFade delay={BLUR_FADE_DELAY * 0.3 + index * 0.1}>
				<div class="relative mb-8 flex items-start last:mb-0">
				<!-- Timeline dot -->
				<div class="relative z-10 flex-shrink-0">
					<div
						class="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-4 border-background {isOngoing(
							getTranslation(work.end)
						)
							? 'bg-primary'
							: 'bg-muted'} flex items-center justify-center shadow-lg"
					>
						<Building
							class="h-4 w-4 sm:h-5 sm:w-5 {isOngoing(getTranslation(work.end))
								? 'text-primary-foreground'
								: 'text-muted-foreground'}"
						/>
					</div>
					{#if isOngoing(getTranslation(work.end))}
						<div
							class="absolute -right-1 -top-1 h-3 w-3 sm:h-4 sm:w-4 animate-pulse rounded-full border-2 border-background bg-green-500"
						></div>
					{/if}
				</div>

				<!-- Content -->
				<div class="ml-4 sm:ml-6 flex-1">
					<Card class="transition-shadow hover:shadow-md">
						<CardContent class="p-4 sm:p-6">
							<div class="space-y-3">
								<!-- Header -->
								<div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
									<div>
										<h3 class="text-lg sm:text-xl font-semibold text-foreground">
											{getTranslation(work.title)}
										</h3>
										<div class="flex items-center gap-2 text-base sm:text-lg text-muted-foreground">
											<Building class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
											{work.company}
										</div>
									</div>

									<div class="flex flex-col gap-1 sm:items-end">
										<div class="flex items-center gap-1 text-xs sm:text-sm font-medium">
											<Calendar class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
											{getTranslation(work.start)} - {getTranslation(work.end)}
										</div>
										<span class="text-[10px] sm:text-xs text-muted-foreground">
											{calculateDuration(work)}
										</span>
									</div>
								</div>

								<!-- Location -->
								<div class="flex items-center gap-1 text-sm text-muted-foreground">
									<MapPin class="h-4 w-4" />
									{getTranslation(work.location)}
								</div>

								<!-- Description -->
								<p class="leading-relaxed text-muted-foreground">
									{getTranslation(work.description)}
								</p>

								<!-- Technologies/Skills -->
								{#if work.technologies && work.technologies.length > 0}
									<div class="space-y-2">
										<p class="text-sm font-medium">Technologies:</p>
										<div class="flex flex-wrap gap-1">
											{#each work.technologies as tech}
												<Badge variant="secondary" class="text-xs">
													{getTranslation(tech)}
												</Badge>
											{/each}
										</div>
									</div>
								{/if}

								<!-- Badges -->
								{#if work.badges && work.badges.length > 0}
									<div class="flex flex-wrap gap-1">
										{#each work.badges as badge}
											<Badge variant="outline" class="text-xs">
												{badge}
											</Badge>
										{/each}
									</div>
								{/if}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
			</BlurFade>
		{/each}
	</div>
</div>

<style>
	.timeline-container {
		max-width: 100%;
		overflow-x: hidden;
	}

	@media (max-width: 640px) {
		.timeline-container {
			/* Adjust timeline for mobile */
		}

		.timeline-container :global(.absolute.left-6) {
			left: 1.5rem;
		}

		.timeline-container :global(.ml-6) {
			margin-left: 1.5rem;
		}
	}
</style>
