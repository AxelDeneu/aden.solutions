<script lang="ts">
	import type { Education } from '$lib/types.js';

	import { BLUR_FADE_DELAY } from '$lib/static/consts.js';

	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import ResumeCard from '$lib/components/portfolio/ResumeCard.svelte';

	interface Props {
		education: Education;
	}

	let { education }: Props = $props();
</script>

<section id="education">
	<div class="flex min-h-0 flex-col gap-y-3">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<h2 class="text-lg font-bold sm:text-xl">{education.label}</h2>
		</BlurFade>
		{#each education.items as edu, id}
			<BlurFade delay={BLUR_FADE_DELAY * 1.2 + id * 0.05}>
				<ResumeCard
					href={edu.href}
					logoUrl={edu.logoUrl}
					company={edu.school}
					title={edu.degree}
					start={edu.start}
					end={edu.end}
				/>
			</BlurFade>
		{/each}
	</div>
</section>
