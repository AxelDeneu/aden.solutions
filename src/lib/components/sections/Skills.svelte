<script lang="ts">
	import { BLUR_FADE_DELAY } from '$lib/static/consts.js';
	import { __ } from '$lib/i18n.js';
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import Badge from '../ui/badge/badge.svelte';

	interface Props {
		skills?: Array<string>;
	}

	let { skills = [] }: Props = $props();
</script>

<section id="skills">
	<div class="flex min-h-0 flex-col gap-y-3">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<h2 class="text-lg font-bold sm:text-xl">{__('Skills')}</h2>
		</BlurFade>
		<div class="flex flex-wrap gap-1">
			{#each skills as skill, id}
				<BlurFade delay={BLUR_FADE_DELAY * id + 0.002}>
					<Badge>{skill}</Badge>
				</BlurFade>
			{/each}
		</div>
	</div>
</section>
