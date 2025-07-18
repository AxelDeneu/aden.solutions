<script lang="ts">
	import { BLUR_FADE_DELAY } from '$lib/static/consts.js';
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import ProjectCard from '$lib/components/portfolio/ProjectCard.svelte';
	import type { Projects, ProjectItem } from '$lib/types/Projects';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Search, X, Filter, Code2, Activity, Star, ArrowRight } from '@lucide/svelte';
	import { _ } from 'svelte-i18n';
	import { fade, fly } from 'svelte/transition';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { locale } from 'svelte-i18n';

	interface Props {
		projects: Projects;
	}

	let { projects }: Props = $props();

	let searchQuery = $state('');
	let selectedTechnologies: Set<string> = $state(new Set());
	let showActiveOnly = $state(false);

	// Extract all unique technologies
	let allTechnologies = $derived([...new Set(projects.items.flatMap((p) => p.technologies))].sort());

	// Separate featured and regular projects
	let featuredProjects = $derived(projects.items.filter((p) => p.featured));
	let regularProjects = $derived(projects.items.filter((p) => !p.featured));

	// Filter projects based on search and selected technologies
	let filteredProjects = $derived(projects.items.filter((project) => {
		// Search filter
		const matchesSearch =
			searchQuery === '' ||
			project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.technologies.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));

		// Technology filter
		const matchesTechnologies =
			selectedTechnologies.size === 0 ||
			project.technologies.some((tech) => selectedTechnologies.has(tech));

		// Active filter
		const matchesActive = !showActiveOnly || project.active;

		return matchesSearch && matchesTechnologies && matchesActive;
	}));

	// Stats
	let totalProjects = $derived(projects.items.length);
	let activeProjects = $derived(projects.items.filter((p) => p.active).length);
	let totalTechnologies = $derived(allTechnologies.length);

	function toggleTechnology(tech: string) {
		const newSet = new Set(selectedTechnologies);
		if (newSet.has(tech)) {
			newSet.delete(tech);
		} else {
			newSet.add(tech);
		}
		selectedTechnologies = newSet;
	}

	function clearFilters() {
		searchQuery = '';
		selectedTechnologies = new Set();
		showActiveOnly = false;
	}

	let hasActiveFilters = $derived(searchQuery || selectedTechnologies.size > 0 || showActiveOnly);
</script>

<section id="projects">
	<div class="w-full space-y-8 py-8 sm:space-y-10 sm:py-10 md:space-y-12 md:py-12">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<div class="flex flex-col items-center justify-center space-y-4 text-center">
				<div class="space-y-2">
					<div class="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
						{projects.supLabel}
					</div>
					<h2 class="heading-1">
						{projects.label}
					</h2>
					<p
						class="body-text text-muted-foreground"
					>
						{projects.description}
					</p>
				</div>
			</div>
		</BlurFade>

		<!-- Stats -->
		<BlurFade delay={BLUR_FADE_DELAY * 1.1}>
			<div class="mx-auto max-w-[800px]">
				<div class="grid grid-cols-3 gap-2 sm:gap-4">
					<div class="rounded-lg border bg-card p-3 sm:p-4 text-center">
						<div class="text-xl sm:text-2xl font-bold">{totalProjects}</div>
						<div class="text-xs sm:text-sm text-muted-foreground">{$_('projects.stats.total')}</div>
					</div>
					<div class="rounded-lg border bg-card p-3 sm:p-4 text-center">
						<div class="flex items-center justify-center gap-1 sm:gap-2">
							<Activity class="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
							<span class="text-xl sm:text-2xl font-bold">{activeProjects}</span>
						</div>
						<div class="text-xs sm:text-sm text-muted-foreground">{$_('projects.stats.active')}</div>
					</div>
					<div class="rounded-lg border bg-card p-3 sm:p-4 text-center">
						<div class="flex items-center justify-center gap-1 sm:gap-2">
							<Code2 class="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
							<span class="text-xl sm:text-2xl font-bold">{totalTechnologies}</span>
						</div>
						<div class="text-xs sm:text-sm text-muted-foreground">{$_('projects.stats.technologies')}</div>
					</div>
				</div>
			</div>
		</BlurFade>

		<!-- Search and Filters -->
		<BlurFade delay={BLUR_FADE_DELAY * 1.2}>
			<div class="mx-auto max-w-[800px] space-y-4">
				<!-- Search Bar -->
				<div class="relative">
					<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						bind:value={searchQuery}
						placeholder={$_('projects.search.placeholder')}
						class="pl-10"
					/>
					{#if searchQuery}
						<button
							onclick={() => (searchQuery = '')}
							class="absolute right-3 top-1/2 -translate-y-1/2"
							transition:fade={{ duration: 150 }}
						>
							<X class="h-4 w-4 text-muted-foreground hover:text-foreground" />
						</button>
					{/if}
				</div>

				<!-- Technology Filters -->
				<div class="space-y-2">
					<div class="flex items-center gap-2">
						<Filter class="h-4 w-4 text-muted-foreground" />
						<span class="text-sm font-medium">{$_('projects.filter.technologies')}</span>
					</div>
					<div class="flex flex-wrap gap-1.5 sm:gap-2">
						{#each allTechnologies as tech}
							<Badge
								variant={selectedTechnologies.has(tech) ? 'default' : 'outline'}
								class="cursor-pointer transition-colors"
								onclick={() => toggleTechnology(tech)}
							>
								{tech}
							</Badge>
						{/each}
					</div>
				</div>

				<!-- Active Filter -->
				<div class="flex items-center justify-between">
					<label class="flex cursor-pointer items-center gap-2 h-9">
						<Checkbox bind:checked={showActiveOnly} />
						<span class="text-sm">{$_('projects.filter.activeOnly')}</span>
					</label>

					{#if hasActiveFilters}
						<Button variant="ghost" size="sm" onclick={clearFilters}>
							<X class="mr-2 h-4 w-4" />
							{$_('projects.button.clearFilters')}
						</Button>
					{/if}
				</div>

				<!-- Active Filters Display -->
				{#if hasActiveFilters}
					<div class="rounded-lg bg-muted/50 p-2 sm:p-3" transition:fly={{ y: -10, duration: 200 }}>
						<div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
							<span class="text-xs sm:text-sm text-muted-foreground"
								>{$_('projects.filter.activeFilters')}</span
							>
							{#if searchQuery}
								<Badge variant="secondary">
									Search: "{searchQuery}"
								</Badge>
							{/if}
							{#each [...selectedTechnologies] as tech}
								<Badge variant="secondary">
									{tech}
								</Badge>
							{/each}
							{#if showActiveOnly}
								<Badge variant="secondary">Active only</Badge>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</BlurFade>

		<!-- Featured Projects -->
		{#if featuredProjects.length > 0 && !hasActiveFilters}
			<BlurFade delay={BLUR_FADE_DELAY * 1.3}>
				<div class="mx-auto max-w-[800px] space-y-4">
					<div class="flex items-center gap-2">
						<Star class="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-500 text-yellow-500" />
						<h3 class="text-base sm:text-lg font-semibold">{$_('projects.featured')}</h3>
					</div>
					<div
						class="rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-1"
					>
						{#each featuredProjects as project}
							<ProjectCard
								href={project.href}
								title={project.title}
								description={project.description}
								dates={project.dates}
								tags={project.technologies}
								image={project.image}
								video={project.video}
								links={project.links}
								active={project.active}
								class="border-0 shadow-none"
							/>
						{/each}
					</div>
				</div>
			</BlurFade>
		{/if}

		<!-- Projects Grid -->
		{#if filteredProjects.length > 0}
			<div class="mx-auto grid max-w-[800px] grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
				{#each filteredProjects.filter((p) => !p.featured || hasActiveFilters) as project, id}
					<div transition:fade|local={{ duration: 200, delay: id * 50 }}>
						<BlurFade delay={BLUR_FADE_DELAY * 1.5 + id * 0.05}>
							<ProjectCard
								href={project.href}
								title={project.title}
								description={project.description}
								dates={project.dates}
								tags={project.technologies}
								image={project.image}
								video={project.video}
								links={project.links}
								active={project.active}
							/>
						</BlurFade>
					</div>
				{/each}
			</div>
		{:else}
			<div class="mx-auto max-w-[800px]" transition:fade={{ duration: 200 }}>
				<div class="rounded-lg border border-dashed p-8 text-center">
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted"
					>
						<Search class="h-6 w-6 text-muted-foreground" />
					</div>
					<p class="text-muted-foreground">
						{searchQuery ? $_('projects.empty.search') : $_('projects.empty.filters')}
					</p>
					<Button variant="outline" size="sm" class="mt-4" onclick={clearFilters}>
						{$_('projects.button.clearAll')}
					</Button>
				</div>
			</div>
		{/if}

		<!-- View All Projects Link -->
		<BlurFade delay={BLUR_FADE_DELAY * 1.6}>
			<div class="mx-auto mt-8 max-w-[800px] text-center">
				<Button
					href={$locale === 'en-US' || $locale === 'en' ? '/en/projects' : '/projects'}
					variant="outline"
					class="group"
				>
					{$_('projects.viewAll')}
					<ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Button>
			</div>
		</BlurFade>
	</div>
</section>
