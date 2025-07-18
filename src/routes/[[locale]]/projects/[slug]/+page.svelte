<script lang="ts">
	import type { PageData } from './$types';
	import { _ } from 'svelte-i18n';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import {
		ArrowLeft,
		ExternalLink,
		Github,
		Star,
		GitFork,
		Calendar,
		Code,
		Activity,
		Globe
	} from '@lucide/svelte';
	import ProjectCard from '$lib/components/portfolio/ProjectCard.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	function formatDate(dateStr: string): string {
		if (dateStr.includes('Present')) return dateStr;

		try {
			const date = new Date(dateStr);
			return new Intl.DateTimeFormat('en-US', {
				month: 'long',
				year: 'numeric'
			}).format(date);
		} catch {
			return dateStr;
		}
	}
</script>

<svelte:head>
	<title>{data.project.title} - {$_('site.title')}</title>
	<meta name="description" content={data.project.description} />
	<meta name="keywords" content={`${data.project.techStack.join(', ')}, ${data.project.title}, web development project`} />
	
	<!-- Canonical URL -->
	<link rel="canonical" href={`https://aden.solutions/projects/${data.project.slug}`} />
	
	<!-- Open Graph -->
	<meta property="og:title" content={data.project.title} />
	<meta property="og:description" content={data.project.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={`https://aden.solutions/projects/${data.project.slug}`} />
	{#if data.project.image}
		<meta property="og:image" content={data.project.image} />
		<meta property="og:image:alt" content="{data.project.title} screenshot" />
	{/if}
	
	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.project.title} />
	<meta name="twitter:description" content={data.project.description} />
	{#if data.project.image}
		<meta name="twitter:image" content={data.project.image} />
	{/if}
	
	<!-- JSON-LD structured data -->
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "SoftwareApplication",
			"name": data.project.title,
			"description": data.project.description,
			"url": data.project.links?.[0]?.href || `https://aden.solutions/projects/${data.project.slug}`,
			"applicationCategory": "WebApplication",
			"operatingSystem": "Web Browser",
			"author": {
				"@type": "Person",
				"name": "Axel Deneu",
				"url": "https://aden.solutions"
			},
			"dateCreated": data.project.dates,
			"programmingLanguage": data.project.techStack,
			"offers": {
				"@type": "Offer",
				"price": "0",
				"priceCurrency": "USD"
			},
			...(data.project.metrics && {
				"aggregateRating": {
					"@type": "AggregateRating",
					"ratingValue": "5",
					"bestRating": "5",
					"worstRating": "1",
					"ratingCount": data.project.metrics.stars || 1
				}
			})
		})}
	</script>
</svelte:head>

<article class="container max-w-6xl py-8">
	<!-- Back button -->
	<div class="mb-8">
		<Button href="/projects" variant="ghost" size="sm">
			<ArrowLeft class="mr-2 h-4 w-4" />
			Back to Projects
		</Button>
	</div>

	<div class="grid gap-8 lg:grid-cols-3">
		<!-- Main Content -->
		<div class="space-y-6 lg:col-span-2">
			<!-- Header -->
			<div>
				<h1 class="mb-4 text-4xl font-bold tracking-tight">{data.project.title}</h1>
				<p class="text-xl text-muted-foreground">{data.project.description}</p>
			</div>

			<!-- Image/Video -->
			{#if data.project.video}
				<div class="aspect-video overflow-hidden rounded-lg bg-muted">
					<video src={data.project.video} controls class="h-full w-full object-cover">
						<track kind="captions" />
					</video>
				</div>
			{:else if data.project.image}
				<div class="aspect-video overflow-hidden rounded-lg bg-muted">
					<img
						src={data.project.image}
						alt={data.project.title}
						class="h-full w-full object-cover"
					/>
				</div>
			{/if}

			<!-- Technologies -->
			<div>
				<h2 class="mb-4 text-2xl font-semibold">Technologies Used</h2>
				<div class="flex flex-wrap gap-2">
					{#each data.project.technologies as tech}
						<Badge variant="secondary" class="text-sm">
							<Code class="mr-1 h-3 w-3" />
							{tech}
						</Badge>
					{/each}
				</div>
			</div>

			<!-- Project Details -->
			<div class="prose prose-neutral max-w-none dark:prose-invert">
				<h2>About This Project</h2>
				<p>{data.project.description}</p>

				{#if data.project.active}
					<p>This is an active project that I'm continuously working on and improving.</p>
				{/if}
			</div>
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Project Info Card -->
			<Card>
				<CardHeader>
					<CardTitle>Project Information</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<!-- Duration -->
					<div class="flex items-start gap-3">
						<Calendar class="mt-0.5 h-5 w-5 text-muted-foreground" />
						<div>
							<p class="text-sm font-medium">Duration</p>
							<p class="text-sm text-muted-foreground">{data.project.dates}</p>
						</div>
					</div>

					<!-- Status -->
					<div class="flex items-start gap-3">
						<Activity class="mt-0.5 h-5 w-5 text-muted-foreground" />
						<div>
							<p class="text-sm font-medium">Status</p>
							<p class="text-sm text-muted-foreground">
								{data.project.active ? 'Active Development' : 'Completed'}
							</p>
						</div>
					</div>

					<!-- Category -->
					{#if data.project.category}
						<div class="flex items-start gap-3">
							<Globe class="mt-0.5 h-5 w-5 text-muted-foreground" />
							<div>
								<p class="text-sm font-medium">Category</p>
								<p class="text-sm text-muted-foreground">{data.project.category}</p>
							</div>
						</div>
					{/if}

					<!-- GitHub Stats -->
					{#if data.project.stars !== undefined || data.project.forks !== undefined}
						<Separator />
						<div class="grid grid-cols-2 gap-4">
							{#if data.project.stars !== undefined}
								<div class="text-center">
									<div class="flex items-center justify-center gap-1 text-lg font-semibold">
										<Star class="h-4 w-4" />
										{data.project.stars}
									</div>
									<p class="text-xs text-muted-foreground">Stars</p>
								</div>
							{/if}
							{#if data.project.forks !== undefined}
								<div class="text-center">
									<div class="flex items-center justify-center gap-1 text-lg font-semibold">
										<GitFork class="h-4 w-4" />
										{data.project.forks}
									</div>
									<p class="text-xs text-muted-foreground">Forks</p>
								</div>
							{/if}
						</div>
					{/if}
				</CardContent>
			</Card>

			<!-- Links -->
			{#if data.project.links && data.project.links.length > 0}
				<Card>
					<CardHeader>
						<CardTitle>Links</CardTitle>
					</CardHeader>
					<CardContent class="space-y-2">
						{#each data.project.links as link}
							<Button
								href={link.href}
								variant="outline"
								class="w-full justify-start"
								target="_blank"
								rel="noopener noreferrer"
							>
								<link.icon class="mr-2 h-4 w-4" />
								{link.type}
								<ExternalLink class="ml-auto h-4 w-4" />
							</Button>
						{/each}
						{#if data.project.demo}
							<Button
								href={data.project.demo}
								variant="outline"
								class="w-full justify-start"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Globe class="mr-2 h-4 w-4" />
								Live Demo
								<ExternalLink class="ml-auto h-4 w-4" />
							</Button>
						{/if}
					</CardContent>
				</Card>
			{/if}
		</div>
	</div>

	<!-- Similar Projects -->
	{#if data.similarProjects.length > 0}
		<section class="mt-16">
			<h2 class="mb-6 text-2xl font-bold">Similar Projects</h2>
			<div class="grid gap-6 md:grid-cols-3">
				{#each data.similarProjects as project}
					<a href="/projects/{project.slug}" class="block">
						<ProjectCard
							title={project.title}
							href={project.href}
							description={project.description}
							dates={project.dates}
							tags={project.technologies}
							image={project.image}
							links={project.links}
							class="h-full transition-shadow hover:shadow-lg"
						/>
					</a>
				{/each}
			</div>
		</section>
	{/if}
</article>
