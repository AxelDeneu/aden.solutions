<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { PageData } from './$types';
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { getCurrentLocale } from '$lib/utils/routes';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Search, Filter, Github, ExternalLink, Star, GitFork, X, Activity } from '@lucide/svelte';
	import ProjectCard from '$lib/components/portfolio/ProjectCard.svelte';
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import { BLUR_FADE_DELAY } from '$lib/static/consts';
	import projectsStore from '$lib/static/projects';
	import { projectService } from '$lib/modules/projects/ProjectService';
	import type { EnhancedProject } from '$lib/modules/projects/types/EnhancedProject';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let searchInput = $state(data.activeFilters.search || '');
	let filteredProjects: EnhancedProject[] = $state(data.projects);



	async function applyFilters() {
		// Get fresh projects from service when locale changes
		const allProjects = await projectService.getAllProjects();

		// Apply current filters
		filteredProjects = await projectService.getFilteredProjects({
			technologies: data.activeFilters.technologies,
			categories: data.activeFilters.categories,
			active: data.activeFilters.activeOnly,
			search: data.activeFilters.search
		});

		// Enhance with stats
		filteredProjects = await projectService.enhanceProjectsWithStats(filteredProjects);
	}

	function updateFilters(newFilters: Record<string, any>) {
		const params = new URLSearchParams($page.url.searchParams);
		const currentLocale = getCurrentLocale($page.url.pathname);
		const localePath = currentLocale === 'en-US' ? '/en' : '';

		Object.entries(newFilters).forEach(([key, value]) => {
			if (
				value === undefined ||
				value === null ||
				value === '' ||
				(Array.isArray(value) && value.length === 0)
			) {
				params.delete(key);
			} else if (Array.isArray(value)) {
				params.set(key, value.join(','));
			} else {
				params.set(key, String(value));
			}
		});

		goto(`${localePath}/projects?${params.toString()}`);
	}

	function toggleTechnology(tech: string) {
		const current = data.activeFilters.technologies;
		const updated = current.includes(tech) ? current.filter((t) => t !== tech) : [...current, tech];
		updateFilters({ tech: updated });
	}

	function toggleCategory(category: string) {
		const current = data.activeFilters.categories;
		const updated = current.includes(category)
			? current.filter((c) => c !== category)
			: [...current, category];
		updateFilters({ category: updated });
	}

	function handleSearch() {
		updateFilters({ search: searchInput });
	}

	function clearAllFilters() {
		searchInput = '';
		const currentLocale = getCurrentLocale($page.url.pathname);
		const localePath = currentLocale === 'en-US' ? '/en' : '';
		goto(`${localePath}/projects`);
	}

	// Subscribe to projects store for reactive updates
	let reactiveProjects = $derived($projectsStore);
	// Re-filter projects when locale changes
	run(() => {
		if (reactiveProjects) {
			applyFilters();
		}
	});
	let hasActiveFilters =
		$derived(data.activeFilters.technologies.length > 0 ||
		data.activeFilters.categories.length > 0 ||
		data.activeFilters.activeOnly ||
		data.activeFilters.search);
</script>

<svelte:head>
	<title>{$_('Projects')} - {$_('site.title')}</title>
	<meta
		name="description"
		content={$_('projects.seo.description', { default: 'Explore my portfolio of web development projects showcasing expertise in PHP, Laravel, Vue.js, and modern JavaScript frameworks' })}
	/>
	<meta name="keywords" content="web development projects, PHP projects, Laravel applications, Vue.js projects, fullstack portfolio, SaaS development, open source contributions" />
	
	<!-- Canonical URL -->
	<link rel="canonical" href={`https://aden.solutions${currentLocale === 'en-US' ? '/en' : ''}/projects`} />
	
	<!-- Open Graph -->
	<meta property="og:title" content="{$_('Projects')} - {$_('site.title')}" />
	<meta property="og:description" content={$_('projects.seo.description', { default: 'Explore my portfolio of web development projects' })} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={`https://aden.solutions${currentLocale === 'en-US' ? '/en' : ''}/projects`} />
	
	<!-- Twitter Card -->
	<meta name="twitter:title" content="{$_('Projects')} - {$_('site.title')}" />
	<meta name="twitter:description" content={$_('projects.seo.description', { default: 'Explore my portfolio of web development projects' })} />
	
	<!-- JSON-LD structured data -->
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"name": $_('Projects'),
			"description": $_('projects.seo.description', { default: 'Portfolio of web development projects' }),
			"url": `https://aden.solutions${currentLocale === 'en-US' ? '/en' : ''}/projects`,
			"isPartOf": {
				"@type": "WebSite",
				"name": $_('site.title'),
				"url": "https://aden.solutions"
			},
			"mainEntity": {
				"@type": "ItemList",
				"numberOfItems": filteredProjects.length,
				"itemListElement": filteredProjects.slice(0, 10).map((project, index) => ({
					"@type": "ListItem",
					"position": index + 1,
					"url": project.links?.[0]?.href || project.href,
					"name": __(project.title),
					"description": __(project.description)
				}))
			}
		})}
	</script>
</svelte:head>

<!-- Header -->
<div class="mb-12 text-center">
	<BlurFade delay={BLUR_FADE_DELAY}>
		<h1 class="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
			{reactiveProjects?.supLabel || $_('My Projects')}
		</h1>
		<p class="mx-auto max-w-2xl text-xl text-muted-foreground">
			{reactiveProjects?.label || $_('Check out my latest work')}
		</p>
	</BlurFade>
</div>

<!-- Stats -->
<BlurFade delay={BLUR_FADE_DELAY * 1.1}>
	<div class="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
		<Card>
			<CardContent class="pt-6">
				<div class="text-2xl font-bold">{data.stats.totalProjects}</div>
				<p class="text-xs text-muted-foreground">{$_('projects.stats.total')}</p>
			</CardContent>
		</Card>
		<Card>
			<CardContent class="pt-6">
				<div class="text-2xl font-bold">{data.stats.activeProjects}</div>
				<p class="text-xs text-muted-foreground">{$_('projects.stats.active')}</p>
			</CardContent>
		</Card>
		<Card>
			<CardContent class="pt-6">
				<div class="flex items-center gap-1 text-2xl font-bold">
					<Star class="h-4 w-4" />
					{data.stats.totalStars}
				</div>
				<p class="text-xs text-muted-foreground">{$_('projects.stats.stars')}</p>
			</CardContent>
		</Card>
		<Card>
			<CardContent class="pt-6">
				<div class="text-2xl font-bold">{data.stats.technologiesUsed.length}</div>
				<p class="text-xs text-muted-foreground">{$_('projects.stats.technologies')}</p>
			</CardContent>
		</Card>
	</div>
</BlurFade>

<!-- Search and Filters -->
<BlurFade delay={BLUR_FADE_DELAY * 1.2}>
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
					placeholder={$_('projects.search.placeholder')}
					class="w-full rounded-md border bg-background py-2 pl-10 pr-4"
				/>
			</div>
			<Button on:click={handleSearch} size="sm">{$_('projects.button.search')}</Button>
		</div>

		<!-- Filter Options -->
		<div class="space-y-3">
			<!-- Technology Filter -->
			<div>
				<h3 class="mb-2 flex items-center gap-2 text-sm font-medium">
					<Filter class="h-4 w-4" />
					{$_('projects.filter.technologies')}
				</h3>
				<div class="flex flex-wrap gap-2">
					{#each data.filters.technologies as tech}
						<Button
							variant={data.activeFilters.technologies.includes(tech) ? 'default' : 'outline'}
							size="sm"
							on:click={() => toggleTechnology(tech)}
						>
							{tech}
						</Button>
					{/each}
				</div>
			</div>

			<!-- Category Filter -->
			<div>
				<h3 class="mb-2 text-sm font-medium">{$_('projects.filter.categories')}</h3>
				<div class="flex flex-wrap gap-2">
					{#each data.filters.categories as category}
						<Button
							variant={data.activeFilters.categories.includes(category) ? 'default' : 'outline'}
							size="sm"
							on:click={() => toggleCategory(category)}
						>
							{category}
						</Button>
					{/each}
				</div>
			</div>

			<!-- Status Filter -->
			<div class="flex items-center gap-4">
				<label class="flex items-center gap-2">
					<input
						type="checkbox"
						checked={data.activeFilters.activeOnly}
						onchange={(e) => updateFilters({ active: e.currentTarget.checked })}
						class="rounded"
					/>
					<span class="text-sm">{$_('projects.filter.activeOnly')}</span>
				</label>
			</div>
		</div>

		<!-- Active Filters Summary -->
		{#if hasActiveFilters}
			<div class="flex items-center gap-2">
				<span class="text-sm text-muted-foreground">{$_('projects.filter.activeFilters')}</span>
				<div class="flex flex-wrap gap-2">
					{#each data.activeFilters.technologies as tech}
						<Badge variant="secondary" class="flex items-center gap-1">
							{tech}
							<button onclick={() => toggleTechnology(tech)}>
								<X class="h-3 w-3" />
							</button>
						</Badge>
					{/each}
					{#each data.activeFilters.categories as category}
						<Badge variant="secondary" class="flex items-center gap-1">
							{category}
							<button onclick={() => toggleCategory(category)}>
								<X class="h-3 w-3" />
							</button>
						</Badge>
					{/each}
					{#if data.activeFilters.search}
						<Badge variant="secondary" class="flex items-center gap-1">
							Search: {data.activeFilters.search}
							<button
								onclick={() => {
									searchInput = '';
									updateFilters({ search: undefined });
								}}
							>
								<X class="h-3 w-3" />
							</button>
						</Badge>
					{/if}
					{#if data.activeFilters.activeOnly}
						<Badge variant="secondary" class="flex items-center gap-1">
							{$_('projects.filter.activeOnly')}
							<button onclick={() => updateFilters({ active: undefined })}>
								<X class="h-3 w-3" />
							</button>
						</Badge>
					{/if}
				</div>
				<Button variant="ghost" size="sm" on:click={clearAllFilters}
					>{$_('projects.button.clearAll')}</Button
				>
			</div>
		{/if}
	</div>
</BlurFade>

<Separator class="mb-8" />

<!-- Projects Grid -->
{#if filteredProjects.length > 0}
	<div class="mb-12 grid gap-6">
		{#each filteredProjects as project, idx}
			<BlurFade delay={BLUR_FADE_DELAY * 1.5 + idx * 0.05}>
				{@const currentLocale = getCurrentLocale($page.url.pathname)}
				{@const localePath = currentLocale === 'en-US' ? '/en' : ''}
				<a href="{localePath}/projects/{project.slug}" class="block h-full">
					<ProjectCard
						title={project.title}
						href={project.href}
						description={project.description}
						dates={project.dates}
						tags={project.technologies}
						image={project.image}
						video={project.video}
						links={project.links}
						class="h-full transition-all duration-300 hover:shadow-lg"
					>
						{#snippet footer()}
												<div
								
								class="flex items-center justify-between text-sm text-muted-foreground"
							>
								<div class="flex items-center gap-3">
									{#if project.stars !== undefined}
										<span class="flex items-center gap-1">
											<Star class="h-3 w-3" />
											{project.stars}
										</span>
									{/if}
									{#if project.forks !== undefined}
										<span class="flex items-center gap-1">
											<GitFork class="h-3 w-3" />
											{project.forks}
										</span>
									{/if}
								</div>
								{#if project.active}
									<Badge variant="secondary" class="text-xs">
										<Activity class="mr-1 h-3 w-3" />
										{$_('projects.badge.active')}
									</Badge>
								{/if}
							</div>
											{/snippet}
					</ProjectCard>
				</a>
			</BlurFade>
		{/each}
	</div>
{:else}
	<div class="py-12 text-center">
		<p class="text-lg text-muted-foreground">
			{#if data.activeFilters.search}
				{$_('projects.empty.search')}
			{:else}
				{$_('projects.empty.filters')}
			{/if}
		</p>
		<Button variant="outline" class="mt-4" on:click={clearAllFilters}
			>{$_('projects.button.clearFilters')}</Button
		>
	</div>
{/if}
