<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { locale, waitLocale } from 'svelte-i18n';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { getLocalizedPath, getOppositeLocale, type Locale } from '$lib/utils/routes';
	import { blogTranslations } from '$lib/stores/blogTranslations';
	import { get } from 'svelte/store';

	const toggleLocale = async () => {
		const currentLocale = $locale as Locale;
		const targetLocale = getOppositeLocale(currentLocale);

		// Save current scroll position
		const scrollY = window.scrollY;

		// Set locale immediately for instant translation update
		locale.set(targetLocale);
		await waitLocale();

		// Check if we're on a blog post page and have translations
		const pathname = page.url.pathname;
		const blogMatch = pathname.match(/^(?:\/(en|fr))?\/blog\/([^\/]+)$/);
		const translations = get(blogTranslations);
		
		let newPath: string;
		
		if (blogMatch && translations) {
			// We're on a blog post page with translations available
			const currentSlug = blogMatch[2];
			const targetLocaleShort = targetLocale === 'en-US' ? 'en' : 'fr';
			const translatedSlug = translations[targetLocaleShort];
			
			if (translatedSlug && translatedSlug !== currentSlug) {
				// Build the new path with the translated slug
				newPath = targetLocale === 'en-US' 
					? `/en/blog/${translatedSlug}`
					: `/blog/${translatedSlug}`;
			} else {
				// Fallback to default behavior if no translation found
				newPath = getLocalizedPath(pathname, targetLocale, currentLocale);
			}
		} else {
			// Not on a blog post page, use default behavior
			newPath = getLocalizedPath(pathname, targetLocale, currentLocale);
		}

		await goto(newPath, { noScroll: true });

		// Restore scroll position after navigation
		window.scrollTo(0, scrollY);
	};
</script>

<Button
	onclick={toggleLocale}
	variant="ghost"
	size="icon"
	class="rounded-full text-lg leading-none"
>
	{#if $locale === 'en-US'}
		<span class="h-[1.2rem] w-[1.2rem] transition-all">🇫🇷</span>
	{:else}
		<span class="h-[1.2rem] w-[1.2rem] transition-all">🇬🇧</span>
	{/if}
	<span class="sr-only">Change locale</span>
</Button>
