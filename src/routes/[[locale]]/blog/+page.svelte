<script lang="ts">
	import { run } from 'svelte/legacy';

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
	import { CalendarDays, Clock, Search, X } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getCurrentLocale } from '$lib/utils/routes';
	import { blogService } from '$lib/modules/blog/BlogService';
	import type { BlogListItem } from '$lib/modules/blog/types/BlogPost';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let searchInput = $state(data.searchQuery || '');
	let posts: BlogListItem[] = $state(data.posts);
	let categories: string[] = $state(data.categories);
	let currentLocale = $derived(getCurrentLocale($page.url.pathname));
	let localeCode = $derived(currentLocale === 'en-US' ? 'en' : 'fr');



	async function refreshPosts() {
		// Re-fetch posts with current locale
		if (data.searchQuery) {
			posts = await blogService.searchPosts(data.searchQuery, localeCode);
		} else {
			const result = await blogService.getPaginatedPosts({
				page: data.pagination.page,
				limit: 10,
				category: data.currentCategory,
				language: localeCode
			});
			posts = result.posts;
		}

		// Update categories
		categories = await blogService.getCategories(localeCode);
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat($locale || 'en', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(date);
	}

	function handleSearch() {
		const params = new URLSearchParams($page.url.searchParams);
		const localePath = currentLocale === 'en-US' ? '/en' : '';
		if (searchInput) {
			params.set('search', searchInput);
			params.delete('page'); // Reset to page 1
		} else {
			params.delete('search');
		}
		goto(`${localePath}/blog?${params.toString()}`);
	}

	function handleCategoryFilter(category: string | null) {
		const params = new URLSearchParams($page.url.searchParams);
		const localePath = currentLocale === 'en-US' ? '/en' : '';
		if (category) {
			params.set('category', category);
		} else {
			params.delete('category');
		}
		params.delete('page'); // Reset to page 1
		goto(`${localePath}/blog?${params.toString()}`);
	}

	function handlePageChange(newPage: number) {
		const params = new URLSearchParams($page.url.searchParams);
		const localePath = currentLocale === 'en-US' ? '/en' : '';
		params.set('page', newPage.toString());
		goto(`${localePath}/blog?${params.toString()}`);
	}
	// Re-fetch posts when locale changes
	run(() => {
		if ($locale) {
			refreshPosts();
		}
	});
</script>

<svelte:head>
	<title>{$_('blog.title')} - {$_('site.title')}</title>
	<meta name="description" content={$_('blog.description')} />
</svelte:head>

<!-- Header -->
<div class="mb-12 text-center">
	<h1 class="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
		{$_('blog.title')}
	</h1>
	<p class="mx-auto max-w-2xl text-xl text-muted-foreground">
		{$_('blog.description')}
	</p>
</div>

<!-- Search and Filters -->
<div class="mb-8 space-y-4">
	<!-- Search Bar -->
	<div class="flex gap-2">
		<div class="relative flex-1">
			<Search
				class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground"
			/>
			<input
				type="text"
				bind:value={searchInput}
				onkeydown={(e) => e.key === 'Enter' && handleSearch()}
				placeholder={$_('blog.searchPlaceholder')}
				class="w-full rounded-md border bg-background py-2 pl-10 pr-4"
			/>
		</div>
		<Button on:click={handleSearch} size="sm">
			{$_('blog.search')}
		</Button>
	</div>

	<!-- Category Filters -->
	<div class="flex flex-wrap items-center gap-2">
		<span class="text-sm font-medium">{$_('blog.filterByCategory')}:</span>
		<Button
			variant={!data.currentCategory ? 'default' : 'outline'}
			size="sm"
			on:click={() => handleCategoryFilter(null)}
		>
			{$_('blog.allCategories')}
		</Button>
		{#each categories as category}
			<Button
				variant={data.currentCategory === category ? 'default' : 'outline'}
				size="sm"
				on:click={() => handleCategoryFilter(category)}
			>
				{category}
			</Button>
		{/each}
	</div>

	<!-- Active Filters -->
	{#if data.searchQuery || data.currentCategory}
		<div class="flex flex-wrap items-center gap-2">
			<span class="text-sm text-muted-foreground">{$_('blog.activeFilters')}:</span>
			{#if data.searchQuery}
				<Badge variant="secondary" class="flex items-center gap-1">
					{$_('blog.search')}: {data.searchQuery}
					<button
						onclick={() => {
							searchInput = '';
							handleSearch();
						}}
					>
						<X class="h-3 w-3" />
					</button>
				</Badge>
			{/if}
			{#if data.currentCategory}
				<Badge variant="secondary" class="flex items-center gap-1">
					{data.currentCategory}
					<button onclick={() => handleCategoryFilter(null)}>
						<X class="h-3 w-3" />
					</button>
				</Badge>
			{/if}
		</div>
	{/if}
</div>

<Separator class="mb-8" />

<!-- Blog Posts Grid -->
{#if posts.length > 0}
	<div class="mb-12 grid gap-6">
		{#each posts as post}
			<Card class="h-full transition-shadow hover:shadow-lg">
				{@const localePath = currentLocale === 'en-US' ? '/en' : ''}
				<a href="{localePath}/blog/{post.slug}" class="block h-full">
					{#if post.metadata.coverImage}
						<div class="aspect-video overflow-hidden rounded-t-lg">
							<img
								src={post.metadata.coverImage}
								alt={post.metadata.coverImageAlt || post.metadata.title}
								class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
							/>
						</div>
					{/if}
					<CardHeader>
						<div class="mb-2 flex items-center gap-4 text-sm text-muted-foreground">
							<span class="flex items-center gap-1">
								<CalendarDays class="h-4 w-4" />
								{formatDate(post.metadata.date)}
							</span>
							{#if post.metadata.readingTime}
								<span class="flex items-center gap-1">
									<Clock class="h-4 w-4" />
									{post.metadata.readingTime}
									{$_('blog.minRead')}
								</span>
							{/if}
						</div>
						<CardTitle class="line-clamp-2">{post.metadata.title}</CardTitle>
						<CardDescription class="line-clamp-3">
							{post.metadata.description}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="flex flex-wrap gap-2">
							{#each post.metadata.categories as category}
								<Badge variant="secondary" class="text-xs">
									{category}
								</Badge>
							{/each}
						</div>
					</CardContent>
				</a>
			</Card>
		{/each}
	</div>

	<!-- Pagination -->
	{#if data.pagination.totalPages > 1}
		<div class="flex items-center justify-center gap-2">
			<Button
				variant="outline"
				size="sm"
				disabled={!data.pagination.hasPrev}
				on:click={() => handlePageChange(data.pagination.page - 1)}
			>
				{$_('blog.previous')}
			</Button>

			<div class="flex gap-1">
				{#each Array(data.pagination.totalPages) as _, i}
					{#if i + 1 === 1 || i + 1 === data.pagination.totalPages || (i + 1 >= data.pagination.page - 1 && i + 1 <= data.pagination.page + 1)}
						<Button
							variant={i + 1 === data.pagination.page ? 'default' : 'outline'}
							size="sm"
							on:click={() => handlePageChange(i + 1)}
						>
							{i + 1}
						</Button>
					{:else if i + 1 === data.pagination.page - 2 || i + 1 === data.pagination.page + 2}
						<span class="px-2">...</span>
					{/if}
				{/each}
			</div>

			<Button
				variant="outline"
				size="sm"
				disabled={!data.pagination.hasNext}
				on:click={() => handlePageChange(data.pagination.page + 1)}
			>
				{$_('blog.next')}
			</Button>
		</div>
	{/if}
{:else}
	<div class="py-12 text-center">
		<p class="text-lg text-muted-foreground">
			{#if data.searchQuery}
				{$_('blog.noSearchResults')}
			{:else}
				{$_('blog.noPosts')}
			{/if}
		</p>
	</div>
{/if}
