<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		pauseOnHover?: boolean;
		vertical?: boolean;
		repeat?: number;
		reverse?: boolean;
		class?: any;
		children?: import('svelte').Snippet;
	}

	let {
		pauseOnHover = false,
		vertical = false,
		repeat = 4,
		reverse = false,
		class: className = '',
		children
	}: Props = $props();
	
</script>

<div
	class={cn(
		'group relative flex overflow-hidden p-2 [--duration:2s] [--gap:1rem] [gap:var(--gap)]',
		{
			'flex-row': !vertical,
			'flex-col': vertical
		},
		className
	)}
>
	<!-- Fade effect for both light and dark modes -->
	<div
		class="pointer-events-none absolute left-0 top-0 z-10 h-full w-[calc(100%_/_8)] bg-gradient-to-r from-background to-transparent"
	></div>
	<div
		class="pointer-events-none absolute right-0 top-0 z-10 h-full w-[calc(100%_/_8)] bg-gradient-to-l from-background to-transparent"
	></div>

	{#each { length: repeat } as _, i (i)}
		<div
			class={cn('flex shrink-0 justify-around [gap:var(--gap)]', {
				'animate-marquee flex-row': !vertical,
				'animate-marquee-vertical flex-col': vertical,
				'group-hover:[animation-play-state:paused]': pauseOnHover,
				'[animation-direction:reverse]': reverse
			})}
		>
			{#if children}{@render children()}{:else}Default{/if}
		</div>
	{/each}
</div>
