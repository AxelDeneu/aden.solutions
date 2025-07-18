<script lang="ts">
	import { BLUR_FADE_DELAY } from '$lib/static/consts.js';
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import ProjectCard from '$lib/components/portfolio/ProjectCard.svelte';
	import type { Projects } from '$lib/types/Projects';

	interface Props {
		projects: Projects;
	}

	let { projects }: Props = $props();
</script>

<section id="projects">
	<div class="w-full space-y-12 py-12">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<div class="flex flex-col items-center justify-center space-y-4 text-center">
				<div class="space-y-2">
					<div class="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
						{projects.supLabel}
					</div>
					<h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">
						{projects.label}
					</h2>
					<p
						class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
					>
						{projects.description}
					</p>
				</div>
			</div>
		</BlurFade>
		<div class="mx-auto grid max-w-[800px] grid-cols-1 gap-3 sm:grid-cols-2">
			{#each projects.items as project, id}
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
