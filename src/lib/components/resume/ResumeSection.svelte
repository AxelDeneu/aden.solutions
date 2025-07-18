<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<section class="resume-section mb-8">
	<h3 class="text-2xl font-semibold mb-4 border-b border-border pb-2">
		{title}
	</h3>
	<div class="resume-section-content">
		{@render children()}
	</div>
</section>

<style>
	@media print {
		.resume-section {
			break-inside: avoid;
			page-break-inside: avoid;
			margin-bottom: 1.5rem;
		}
		
		.resume-section h3 {
			border-color: #e5e7eb !important;
			color: #111827 !important;
		}
	}
</style>