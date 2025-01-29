<script lang="ts">
	import { onMount } from "svelte";
	import { mode } from 'mode-watcher';

	export let logos: string[] = [];

	let track;
	let duplicatedLogos = [];
	let isDarkMode = false;

	onMount(() => {
		mode.subscribe((newMode) => {
			isDarkMode = newMode === 'dark';
		});

		const handleTrackWidth = () => {
			if (track) {
				const trackWidth = track.scrollWidth > 0 ? track.scrollWidth : 100;
				const containerWidth = track.parentElement.clientWidth;

				let repeatCount = Math.ceil(containerWidth / trackWidth) + 1;
				duplicatedLogos = [...Array(repeatCount)].flatMap(() => logos);
			}
		};

		handleTrackWidth();

		window.addEventListener('resize', handleTrackWidth);
		return () => {
			window.removeEventListener('resize', handleTrackWidth);
		};
	});
</script>

<div class="relative overflow-hidden w-full">
	<!-- Fade effect for both light and dark modes -->
	<div class="absolute left-0 top-0 w-1/6 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
	<div class="absolute right-0 top-0 w-1/6 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

	<!-- Marquee track with logo images -->
	<div class="flex items-center whitespace-nowrap animate-marquee w-max pointer-events-none" bind:this={track}>
		{#each duplicatedLogos as logo}
			<img src={logo} alt="Client Logo" class="h-14 md:h-16 max-w-28 md:max-w-32 object-contain object-center mx-4 md:mx-6 grayscale invert dark:invert-0 py-2 select-none opacity-60"/>
		{/each}
	</div>
</div>

<style>
    @keyframes marquee {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(-50%);
        }
    }

    .animate-marquee {
        animation: marquee 50s linear infinite;
    }
</style>