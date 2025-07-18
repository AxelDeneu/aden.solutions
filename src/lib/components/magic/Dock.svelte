<script lang="ts">
	import { Motion } from 'svelte-motion';
	import { cva, type VariantProps } from 'class-variance-authority';
	import { cn } from '$lib/utils';

	interface DockProps extends VariantProps<typeof dockVariants> {
		className?: string;
		magnification?: number;
		distance?: number;
		direction?: 'top' | 'middle' | 'bottom';
	}

	
	interface Props {
		class?: DockProps['className'];
		magnification?: DockProps['magnification'];
		distance?: DockProps['distance'];
		direction?: DockProps['direction'];
		children?: import('svelte').Snippet<[any]>;
	}

	let {
		class: className = undefined,
		magnification = 60,
		distance = 140,
		direction = 'middle',
		children
	}: Props = $props();

	const dockVariants = cva(
		'mx-auto w-max mt-8 h-[50px] sm:h-[58px] p-1.5 sm:p-2 flex gap-1.5 sm:gap-2 rounded-2xl border supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 backdrop-blur-md'
	);

	let dockElement: HTMLDivElement = $state();
	let mouseX = $state(Infinity);
	function handleMouseMove(e: MouseEvent) {
		mouseX = e.pageX;
	}

	function handleMouseLeave() {
		mouseX = Infinity;
	}

	let dockClass = cn(dockVariants({ className }), {
		'items-start': direction === 'top',
		'items-center': direction === 'middle',
		'items-end': direction === 'bottom'
	});

	const children_render = $derived(children);
</script>

<Motion >
	{#snippet children({ motion })}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			use:motion
			bind:this={dockElement}
			onmousemove={(e) => handleMouseMove(e)}
			onmouseleave={handleMouseLeave}
			class={dockClass}
		>
			{#if children_render}{@render children_render({ mouseX, magnification, distance, })}{:else}
				<!-- Your Content -->
				Default
			{/if}
		</div>
	{/snippet}
</Motion>
