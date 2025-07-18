<script lang="ts">
	import type { PageData } from './$types';
	import { _, locale } from 'svelte-i18n';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { CalendarDays, Clock, User, ArrowLeft, Share2, Languages } from '@lucide/svelte';
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { blogTranslations } from '$lib/stores/blogTranslations';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Get current locale for SEO
	const currentLocale = $locale || 'fr';
	
	// Build canonical URL and alternate URLs for SEO
	const baseUrl = $page.url.origin;
	const canonicalUrl = `${baseUrl}/${currentLocale}/blog/${data.translations[currentLocale] || data.post.slug}`;
	const alternateUrls = Object.entries(data.translations).map(([locale, slug]) => ({
		locale,
		url: `${baseUrl}/${locale}/blog/${slug}`
	}));

	let articleElement: HTMLElement = $state();

	// Set blog translations in store for locale toggle
	$effect(() => {
		if (data.translations && Object.keys(data.translations).length > 0) {
			blogTranslations.set(data.translations);
		}
		
		return () => {
			// Clear translations when leaving the page
			blogTranslations.clear();
		};
	});

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat($locale || 'en', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(date);
	}

	async function sharePost() {
		if (navigator.share) {
			try {
				await navigator.share({
					title: data.post.title,
					text: data.post.description,
					url: $page.url.href
				});
			} catch (err) {
				console.error('Error sharing:', err);
			}
		} else {
			// Fallback: copy to clipboard
			await navigator.clipboard.writeText($page.url.href);
			// You could show a toast notification here
		}
	}

	function switchLanguage(targetLocale: string) {
		const targetSlug = data.translations[targetLocale];
		if (targetSlug) {
			const newUrl = `/${targetLocale}/blog/${targetSlug}`;
			goto(newUrl);
		}
	}

	onMount(() => {
		// Add copy button to code blocks
		const codeBlocks = articleElement.querySelectorAll('pre');
		codeBlocks.forEach((block) => {
			const button = document.createElement('button');
			button.className = 'copy-code-button';
			button.textContent = 'Copy';
			button.addEventListener('click', async () => {
				const code = block.querySelector('code')?.textContent || '';
				await navigator.clipboard.writeText(code);
				button.textContent = 'Copied!';
				setTimeout(() => {
					button.textContent = 'Copy';
				}, 2000);
			});
			block.appendChild(button);
		});
	});
</script>

<svelte:head>
	<title>{data.post.title} - {$_('site.title')}</title>
	<meta name="description" content={data.post.description} />
	
	<!-- Canonical URL -->
	<link rel="canonical" href={canonicalUrl} />
	
	<!-- Language alternates -->
	{#each alternateUrls as alternate}
		<link rel="alternate" hreflang={alternate.locale} href={alternate.url} />
	{/each}
	
	<!-- Open Graph -->
	<meta property="og:title" content={data.post.title} />
	<meta property="og:description" content={data.post.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:locale" content={currentLocale} />
	{#each alternateUrls.filter(alt => alt.locale !== currentLocale) as alternate}
		<meta property="og:locale:alternate" content={alternate.locale} />
	{/each}
	{#if data.post.coverImage}
		<meta property="og:image" content={data.post.coverImage} />
	{/if}
	<meta property="article:published_time" content={new Date(data.post.date).toISOString()} />
	<meta property="article:author" content={data.post.author || $_('site.author')} />
	{#each data.post.categories as category}
		<meta property="article:tag" content={category} />
	{/each}
	
	<!-- JSON-LD structured data -->
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "BlogPosting",
			"headline": data.post.title,
			"alternativeHeadline": data.post.description,
			"description": data.post.description,
			"author": {
				"@type": "Person",
				"name": data.post.author || $_('site.author'),
				"url": "https://aden.solutions"
			},
			"publisher": {
				"@type": "Organization",
				"name": "ADEN Solutions",
				"logo": {
					"@type": "ImageObject",
					"url": "https://aden.solutions/avatar.png"
				}
			},
			"datePublished": new Date(data.post.date).toISOString(),
			"dateModified": new Date(data.post.date).toISOString(),
			"url": canonicalUrl,
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": canonicalUrl
			},
			"keywords": data.post.categories.join(", "),
			"articleSection": data.post.categories[0],
			"inLanguage": currentLocale,
			"wordCount": data.post.content.split(/\s+/).length,
			"timeRequired": `PT${data.post.readingTime}M`,
			...(data.post.coverImage && {
				"image": {
					"@type": "ImageObject",
					"url": data.post.coverImage,
					"caption": data.post.coverImageAlt || data.post.title
				}
			}),
			"articleBody": data.post.content.replace(/<[^>]*>/g, '').substring(0, 500) + '...'
		})}
	</script>
</svelte:head>

<article class="py-8" bind:this={articleElement}>
	<!-- Back button -->
	<div class="mb-8">
		<Button href="/blog" variant="ghost" size="sm">
			<ArrowLeft class="mr-2 h-4 w-4" />
			{$_('blog.backToBlog')}
		</Button>
	</div>

	<!-- Article Header -->
	<header class="mb-8">
		{#if data.post.coverImage}
			<div class="mb-8 aspect-video overflow-hidden rounded-lg">
				<img
					src={data.post.coverImage}
					alt={data.post.coverImageAlt || data.post.title}
					class="h-full w-full object-cover"
				/>
			</div>
		{/if}

		<h1 class="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
			{data.post.title}
		</h1>

		<p class="mb-6 text-xl text-muted-foreground">
			{data.post.description}
		</p>

		<div class="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
			{#if data.post.author}
				<span class="flex items-center gap-1">
					<User class="h-4 w-4" />
					{data.post.author}
				</span>
			{/if}
			<span class="flex items-center gap-1">
				<CalendarDays class="h-4 w-4" />
				{formatDate(data.post.date)}
			</span>
			{#if data.post.readingTime}
				<span class="flex items-center gap-1">
					<Clock class="h-4 w-4" />
					{data.post.readingTime}
					{$_('blog.minRead')}
				</span>
			{/if}
			<div class="ml-auto flex items-center gap-2">
				<!-- Language switcher -->
				{#if Object.keys(data.translations).length > 1}
					<div class="flex items-center gap-1">
						<Languages class="h-4 w-4" />
						{#each Object.entries(data.translations) as [locale, slug]}
							{#if locale !== currentLocale}
								<button
									onclick={() => switchLanguage(locale)}
									class="text-sm transition-colors hover:text-foreground uppercase"
									title={$_(`languages.${locale}`)}
								>
									{locale}
								</button>
							{/if}
						{/each}
					</div>
				{/if}
				
				<!-- Share button -->
				<button
					onclick={sharePost}
					class="flex items-center gap-1 transition-colors hover:text-foreground"
				>
					<Share2 class="h-4 w-4" />
					{$_('blog.share')}
				</button>
			</div>
		</div>

		<div class="flex flex-wrap gap-2">
			{#each data.post.categories as category}
				<Badge variant="secondary">
					{category}
				</Badge>
			{/each}
		</div>
	</header>

	<Separator class="mb-8" />

	<!-- Article Content -->
	<div class="prose prose-neutral mb-12 max-w-none dark:prose-invert">
		{@html data.post.content}
	</div>

	<Separator class="mb-8" />

	<!-- Author Bio (if available) -->
	{#if data.post.author}
		<div class="mb-12 rounded-lg bg-muted/50 p-6">
			<h3 class="mb-2 text-lg font-semibold">{$_('blog.aboutAuthor')}</h3>
			<p class="text-muted-foreground">
				{$_('blog.authorBio', { values: { author: data.post.author } })}
			</p>
		</div>
	{/if}

	<!-- Related Posts -->
	{#if data.relatedPosts.length > 0}
		<section>
			<h2 class="mb-6 text-2xl font-bold">{$_('blog.relatedPosts')}</h2>
			<div class="grid gap-6 md:grid-cols-3">
				{#each data.relatedPosts as post}
					<Card class="transition-shadow hover:shadow-lg">
						<a href="/blog/{post.slug}" class="block">
							<CardHeader>
								<CardTitle class="line-clamp-2 text-lg">{post.metadata.title}</CardTitle>
								<CardDescription class="text-sm">
									{formatDate(post.metadata.date)}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p class="line-clamp-2 text-sm text-muted-foreground">
									{post.metadata.description}
								</p>
							</CardContent>
						</a>
					</Card>
				{/each}
			</div>
		</section>
	{/if}
</article>

<style>
	:global(.prose pre) {
		position: relative;
		padding-right: 3rem;
	}

	:global(.copy-code-button) {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		background-color: hsl(var(--muted));
		color: hsl(var(--muted-foreground));
		border: 1px solid hsl(var(--border));
		border-radius: 0.25rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	:global(.copy-code-button:hover) {
		background-color: hsl(var(--accent));
		color: hsl(var(--accent-foreground));
	}
</style>
