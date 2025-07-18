<script lang="ts">
	import type { HTMLLabelAttributes } from "svelte/elements";
	import type { WithElementRef } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type Props = WithElementRef<HTMLLabelAttributes> & {
		required?: boolean;
	};

	let {
		ref = $bindable(null),
		class: className,
		children,
		required = false,
		...restProps
	}: Props = $props();
</script>

<label
	bind:this={ref}
	class={cn(
		"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	{#if required}
		<span class="text-red-500 ml-1">*</span>
	{/if}
</label>