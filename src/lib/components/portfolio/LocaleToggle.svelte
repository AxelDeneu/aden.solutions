<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { locale } from 'svelte-i18n';

	const setLocale = (newLocale: string) => {
		console.log(newLocale)
		locale.set(newLocale);
	};

	$: if($locale) {
		console.log($locale)
	}
</script>

<Button on:click={setLocale($locale === 'fr-FR' ? 'en-EN' : 'fr-FR')} variant='ghost' size="icon" class='rounded-full text-lg leading-none'>
	{#if $locale === 'en-EN'}
  <span
		class="h-[1.2rem] w-[1.2rem] transition-all"
	>🇫🇷</span>
	{:else}
  <span
		class="h-[1.2rem] w-[1.2rem] transition-all"
	>🇬🇧</span>
	{/if}
	<span class="sr-only">Change locale</span>
</Button>