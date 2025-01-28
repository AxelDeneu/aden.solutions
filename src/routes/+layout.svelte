<script>
	import Navbar from '$lib/components/portfolio/Navbar.svelte';
	import '../app.css';
	import { ModeWatcher, setMode } from 'mode-watcher';
	import { resumeStore } from '$lib/stores/resume';
	import { waitLocale } from 'svelte-i18n';

	let visible = false;

	setMode('dark');
	waitLocale().then(() => {
		visible = true;
	});

</script>

<ModeWatcher />
<div class="relative mx-auto min-h-screen max-w-2xl bg-background px-6 py-12 font-sans antialiased sm:py-24">
	{#if visible}
		<slot></slot>
		<Navbar />
	{/if}
</div>