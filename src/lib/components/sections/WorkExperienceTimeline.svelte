<script lang="ts">
	import type { WorkExperience } from '$lib/types';
	import TimelineRenderer from '$lib/modules/professional/renderers/TimelineRenderer.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import { BLUR_FADE_DELAY } from '$lib/static/consts';
	import { _ } from 'svelte-i18n';

	interface Props {
		workExperience: WorkExperience;
	}

	let { workExperience }: Props = $props();

	function getTranslation(value: any): string {
		if (typeof value === 'string') return value;
		if (value && typeof value === 'object') {
			return value['en'] || Object.values(value)[0] || '';
		}
		return '';
	}

	function calculateTotalExperience(): string {
		const experiences = workExperience.items;
		if (experiences.length === 0) return `0 ${$_('workExperience.years')}`;

		let totalMonths = 0;

		experiences.forEach((exp) => {
			// Use the raw Date objects if available, otherwise fall back to parsing
			const startDate = exp.startDate || new Date(getTranslation(exp.start));
			const endDateStr = getTranslation(exp.end);
			const isPresent = endDateStr === 'Present' || 
				endDateStr.toLowerCase().includes('present') || 
				endDateStr.toLowerCase().includes("aujourd'hui");
			const endDate = exp.endDate || (isPresent ? new Date() : new Date(endDateStr));

			const monthsDiff =
				(endDate.getFullYear() - startDate.getFullYear()) * 12 +
				(endDate.getMonth() - startDate.getMonth());

			totalMonths += monthsDiff;
		});

		const years = Math.floor(totalMonths / 12);
		const months = totalMonths % 12;

		if (years === 0) {
			return `${months} ${months === 1 ? $_('workExperience.month') : $_('workExperience.months')}`;
		}
		if (months === 0) {
			return `${years} ${years === 1 ? $_('workExperience.year') : $_('workExperience.years')}`;
		}
		return `${years} ${years === 1 ? $_('workExperience.year') : $_('workExperience.years')} ${months} ${months === 1 ? $_('workExperience.month') : $_('workExperience.months')}`;
	}

	function getAllTechnologies(): string[] {
		const techSet = new Set<string>();
		workExperience.items.forEach((exp) => {
			if (exp.technologies) {
				exp.technologies.forEach((tech) => techSet.add(getTranslation(tech)));
			}
		});
		return Array.from(techSet);
	}
</script>

<section id="work-experience-timeline" class="py-8 sm:py-12 md:py-16">
	<div>
		<BlurFade delay={BLUR_FADE_DELAY}>
			<div class="mb-12 text-center">
				<h2 class="mb-4 heading-1">
					{workExperience.label}
				</h2>
				<div class="mx-auto mb-8 max-w-2xl space-y-2">
					<p class="body-text text-muted-foreground">
						{$_('workExperience.journey')}
					</p>
					<p class="caption-text text-muted-foreground">
						<span class="font-medium">{calculateTotalExperience()}</span> {$_('workExperience.ofProfessionalExperience')}
					</p>
				</div>
			</div>
		</BlurFade>

		<!-- Experience Timeline -->
		<TimelineRenderer {workExperience} />
	</div>
</section>
