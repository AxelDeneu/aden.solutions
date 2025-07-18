<script lang="ts">
	import type { WorkExperience } from '$lib/types';

	import { BLUR_FADE_DELAY } from '$lib/static/consts';

	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import ResumeCard from '$lib/components/portfolio/ResumeCard.svelte';
	import { __ } from '$lib/i18n';

	interface Props {
		workExperience: WorkExperience;
	}

	let { workExperience }: Props = $props();
</script>

<section id="work">
	<div class="flex min-h-0 flex-col gap-y-3">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<h2 class="text-xl font-bold">{workExperience.label}</h2>
		</BlurFade>
		{#each workExperience.items as work, id}
			<BlurFade delay={BLUR_FADE_DELAY * 1.2 + id * 0.05}>
				<ResumeCard
					logoUrl={work.logoUrl}
					company={work.company}
					title={__(work.title)}
					subtitle={__(work.location)}
					href={work.href}
					badges={work.badges}
					description={__(work.description)}
					start={work.start}
					end={work.end}
				/>
			</BlurFade>
		{/each}
	</div>
</section>
