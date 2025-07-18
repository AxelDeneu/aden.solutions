<script lang="ts">
	import type { Resume } from '$lib/types';

	import { BLUR_FADE_DELAY } from '$lib/static/consts';
	import { marked } from 'marked';

	import BlurFade from '$lib/components/magic/BlurFade.svelte';

	interface Props {
		resume: Resume;
	}

	let { resume }: Props = $props();
</script>

<section id="about">
	<BlurFade delay={BLUR_FADE_DELAY}>
		<h2 class="text-lg font-bold sm:text-xl">{resume.about}</h2>
	</BlurFade>
	<BlurFade delay={BLUR_FADE_DELAY * 1.4}>
		<div
			class="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert"
		>
			{@html marked(resume.summary)}
		</div>
	</BlurFade>
</section>
