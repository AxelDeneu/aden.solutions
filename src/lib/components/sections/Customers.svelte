<script lang="ts">
	import type { Customers } from '$lib/types';

	import { BLUR_FADE_DELAY } from '$lib/static/consts';

	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import Marquee from '$lib/components/portfolio/Marquee.svelte';
	import CustomerCard from '$lib/components/portfolio/CustomerCard.svelte';

	interface Props {
		customers: Customers;
	}

	let { customers }: Props = $props();
</script>

<section id="customers">
	<div class="flex min-h-0 flex-col gap-y-3">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<h2 class="text-lg font-bold sm:text-xl">{customers.label}</h2>
		</BlurFade>
		<BlurFade delay={BLUR_FADE_DELAY * 1.4}>
			<!--			<Marquee logos={customers.items} />-->
			<Marquee class="[--duration:20s]">
				{#each customers.items as item}
					<CustomerCard customer={item} />
				{/each}
			</Marquee>
		</BlurFade>
	</div>
</section>
