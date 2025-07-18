<script lang="ts">
	interface Props {
		as?: 'span' | 'div' | 'p';
		focusable?: boolean;
		children?: import('svelte').Snippet;
	}

	let { as = 'span', focusable = false, children }: Props = $props();
</script>

{#if as === 'div'}
	<div class="sr-only" class:sr-only-focusable={focusable}>
		{@render children?.()}
	</div>
{:else if as === 'p'}
	<p class="sr-only" class:sr-only-focusable={focusable}>
		{@render children?.()}
	</p>
{:else}
	<span class="sr-only" class:sr-only-focusable={focusable}>
		{@render children?.()}
	</span>
{/if}

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	.sr-only-focusable:focus {
		position: absolute;
		width: auto;
		height: auto;
		padding: 0.5rem;
		margin: 0;
		overflow: visible;
		clip: auto;
		white-space: normal;
		background: var(--background);
		color: var(--foreground);
		border: 2px solid var(--primary);
		border-radius: 0.25rem;
		z-index: 9999;
	}
</style>
