<script lang="ts">
	import { _ } from 'svelte-i18n';

	interface SkipLink {
		targetId: string;
		label: string;
	}

	interface Props {
		links?: SkipLink[];
	}

	let { links = [
		{ targetId: 'main-content', label: 'Skip to main content' },
		{ targetId: 'navigation', label: 'Skip to navigation' }
	] }: Props = $props();

	function handleSkipClick(e: MouseEvent, targetId: string) {
		e.preventDefault();
		const target = document.getElementById(targetId);
		if (target) {
			target.tabIndex = -1;
			target.focus();
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
</script>

<nav class="skip-links" aria-label="Skip links">
	{#each links as link}
		<a
			href="#{link.targetId}"
			class="skip-link"
			onclick={(e) => handleSkipClick(e, link.targetId)}
		>
			{$_(link.label)}
		</a>
	{/each}
</nav>

<style>
	.skip-links {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 9999;
	}

	.skip-link {
		position: absolute;
		left: -10000px;
		top: auto;
		width: 1px;
		height: 1px;
		overflow: hidden;
		background: var(--background);
		color: var(--foreground);
		padding: 0.5rem 1rem;
		text-decoration: none;
		border-radius: 0.25rem;
		border: 2px solid var(--primary);
	}

	.skip-link:focus {
		position: absolute;
		left: 0.5rem;
		top: 0.5rem;
		width: auto;
		height: auto;
		overflow: visible;
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}
</style>
