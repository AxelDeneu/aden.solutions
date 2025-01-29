<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { locale } from 'svelte-i18n';

	const setLocale = (newLocale: string) => {
		locale.set(newLocale);
	};
</script>

<Button on:click={setLocale($locale === 'fr-FR' ? 'en-US' : 'fr-FR')} variant='ghost' size="icon" class='rounded-full text-lg leading-none'>
	{#if $locale === 'en-US'}
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