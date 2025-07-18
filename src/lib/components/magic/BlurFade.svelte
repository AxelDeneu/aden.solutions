<script lang="ts">
	import { Motion, AnimatePresence } from 'svelte-motion';
	import { inview } from 'svelte-inview';
	import { cn } from '$lib/utils';
	let isInView = $state('hidden');
	interface Props {
		duration?: number;
		delay?: number;
		yOffset?: number;
		inViewMargin?: string;
		blur?: string;
		id?: any;
		once?: boolean;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		duration = 0.4,
		delay = 0,
		yOffset = 8,
		inViewMargin = '-20px',
		blur = '2px',
		id = crypto.randomUUID().slice(0, 6),
		once = true,
		class: _class = '',
		children
	}: Props = $props();

	let defaultVariants = {
		hidden: { opacity: 0, y: yOffset, filter: `blur(${blur})` },
		visible: { opacity: 1, y: 0, filter: `blur(0px)` }
	};
	

	const children_render = $derived(children);
</script>

<AnimatePresence  list={[{ key: id }]}>
	{#snippet children({ item })}
		<Motion
			initial="hidden"
			animate={isInView}
			exit="hidden"
			variants={defaultVariants}
			transition={{
				delay: 0.04 + delay,
				duration,
				ease: 'easeOut'
			}}
			
		>
			{#snippet children({ motion })}
				<div
					use:inview={{ rootMargin: inViewMargin, unobserveOnEnter: once }}
					use:motion
					oninview_change={({ detail }) => {
						isInView = detail.inView ? 'visible' : 'hidden';
					}}
					class={cn(_class)}
				>
					{#if children_render}{@render children_render()}{:else}Default{/if}
				</div>
						{/snippet}
		</Motion>
	{/snippet}
</AnimatePresence>
