<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { fade } from "svelte/transition";

	interface Props {
		error?: string | null;
		class?: string;
	}

	let { error = null, class: className }: Props = $props();
</script>

{#if error}
	<p
		class={cn("text-sm text-red-500 mt-1", className)}
		transition:fade={{ duration: 150 }}
	>
		{error}
	</p>
{/if}