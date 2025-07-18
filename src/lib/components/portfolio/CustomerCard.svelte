<script lang="ts">
	interface Props {
		customer: string;
	}

	let { customer }: Props = $props();
</script>

<div class="rounded-lg border bg-card text-card-foreground">
	<img
		src={customer}
		alt="Client Logo"
		class="mx-4 h-14 max-w-28 select-none object-contain object-center py-2 opacity-60 grayscale invert dark:invert-0 md:mx-6 md:h-16 md:max-w-32"
	/>
</div>
