<script>
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import HackathonCard from '$lib/components/portfolio/HackathonCard.svelte';
	import ProjectCard from '$lib/components/portfolio/ProjectCard.svelte';
	import ResumeCard from '$lib/components/portfolio/ResumeCard.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { resumeStore } from '$lib/stores/resume';
	import { marked } from 'marked';
	import { mode } from 'mode-watcher';
	import Particles from '$lib/components/magic/Particles.svelte';
	
	import { __ } from '$lib/i18n';

	let BLUR_FADE_DELAY = 0.04;
</script>

<svelte:head>
	<title>{$resumeStore.name}</title>
	<meta name="description" content={$resumeStore.description} />
	<meta property="og:title" content={$resumeStore.name} />
	<meta property="og:description" content={$resumeStore.description} />
	<meta property="og:url" content={$resumeStore.url} />
	<meta property="og:site_name" content={$resumeStore.name} />
	<meta property="og:image" content={$resumeStore.img} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="website" />
	<meta name="robots" content="index, follow" />
	<meta
		name="googlebot"
		content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
	/>
	<meta name="twitter:title" content={$resumeStore.name} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={$resumeStore.img} />
	<meta name="twitter:description" content={$resumeStore.description} />

	<meta name="google-site-verification" content="your-google-verification-code" />
	<meta name="yandex-verification" content="your-yandex-verification-code" />
</svelte:head>
<main class="flex min-h-[100dvh] flex-col space-y-10">
	<section id="hero" class="relative">
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[133%] h-[150%] z-0">
			{#key $mode}
				<Particles className="absolute inset-0" refresh={true} color={$mode === "dark" ? "#ffffff" : "#000000"} />
			{/key}
		</div>
		<div class="mx-auto w-full max-w-2xl space-y-8 relative z-10">
			<div class="flex justify-between gap-2">
				<div class="flex flex-1 flex-col space-y-1.5">
					<BlurFade
						delay={BLUR_FADE_DELAY}
						class="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
						yOffset={8}>{$resumeStore.greetings}</BlurFade
					>
					<BlurFade class="max-w-[600px] md:text-xl" delay={BLUR_FADE_DELAY}
					>{$resumeStore.description}</BlurFade
					>
				</div>
				<BlurFade delay={BLUR_FADE_DELAY}>
					<Avatar.Root class="size-28 border">
						<Avatar.Image alt={$resumeStore.name} src={$resumeStore.avatarUrl} />
						<Avatar.Fallback>{$resumeStore.initials}</Avatar.Fallback>
					</Avatar.Root>
				</BlurFade>
			</div>
		</div>
	</section>
	<section id="about">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<h2 class="text-xl font-bold">{$resumeStore.about}</h2>
		</BlurFade>
		<BlurFade delay={BLUR_FADE_DELAY * 1.4}>
			<div
				class="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert"
			>
				{@html marked($resumeStore.summary)}
			</div>
		</BlurFade>
	</section>
	<section id="work">
		<div class="flex min-h-0 flex-col gap-y-3">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<h2 class="text-xl font-bold">{$resumeStore.workExperience}</h2>
			</BlurFade>
			{#each $resumeStore.work as work, id}
				<BlurFade delay={BLUR_FADE_DELAY * 1.2 + id * 0.05}>
					<ResumeCard {...work} />
				</BlurFade>
			{/each}
		</div>
	</section>
	<section id="education">
		<div class="flex min-h-0 flex-col gap-y-3">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<h2 class="text-xl font-bold">{$resumeStore.educationLabel}</h2>
			</BlurFade>
			{#each $resumeStore.education as edu, id}
				<BlurFade delay={BLUR_FADE_DELAY * 1.2 + id * 0.05}>
					<ResumeCard
						href={edu.href}
						logoUrl={edu.logoUrl}
						company={edu.school}
						title={edu.degree}
						start={edu.start}
						end={edu.end}
					/>
				</BlurFade>
			{/each}
		</div>
	</section>
	<section id="skills">
		<div class="flex min-h-0 flex-col gap-y-3">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<h2 class="text-xl font-bold">{__('Skills')}</h2>
			</BlurFade>
			<div class="flex flex-wrap gap-1">
				{#each $resumeStore.skills as skill, id}
					<BlurFade delay={BLUR_FADE_DELAY * id + 0.002}>
						<Badge>{skill}</Badge>
					</BlurFade>
				{/each}
			</div>
		</div>
	</section>
	<section id="projects">
		<div class="w-full space-y-12 py-12">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<div class="flex flex-col items-center justify-center space-y-4 text-center">
					<div class="space-y-2">
						<div class="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
							{$resumeStore.projectsSupLabel}
						</div>
						<h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">
							{$resumeStore.projectsLabel}
						</h2>
						<p
							class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
						>
							{$resumeStore.projectsDescription}
						</p>
					</div>
				</div>
			</BlurFade>
			<div class="mx-auto grid max-w-[800px] grid-cols-1 gap-3 sm:grid-cols-2">
				{#each $resumeStore.projects as project, id}
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
						/>
					</BlurFade>
				{/each}
			</div>
		</div>
	</section>
	<section id="contact">
		<div class="grid w-full items-center justify-center gap-4 px-4 py-12 text-center md:px-6">
			<BlurFade delay={BLUR_FADE_DELAY * 2}>
				<div class="space-y-3">
					<div class="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
						Contact
					</div>
					<h2 class="text-3xl font-bold tracking-tight sm:text-5xl">{$resumeStore.contactLabel}</h2>
					<p
						class="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
					>
						{$resumeStore.contactDescription}
						<a
							href={`mailto:${$resumeStore.email}`}
							class="text-primary hover:underline">
							{$resumeStore.email}
						</a>
					</p>
				</div>
			</BlurFade>
		</div>
	</section>
</main>
