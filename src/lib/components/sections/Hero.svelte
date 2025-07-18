<script lang="ts">
	import type { Resume } from '$lib/types/Resume';

	import { BLUR_FADE_DELAY } from '$lib/static/consts';
	import { mode } from 'mode-watcher';

	import {
		Root as AvatarRoot,
		Image as AvatarImage,
		Fallback as AvatarFallback
	} from '$lib/components/ui/avatar';
	import Particles from '$lib/components/magic/Particles.svelte';
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import { Button } from '$lib/components/ui/button';
	import { MapPin, Mail, Calendar } from '@lucide/svelte';
	import { _ } from 'svelte-i18n';
	import { Badge } from '$lib/components/ui/badge';

	interface Props {
		resume: Resume;
	}

	let { resume }: Props = $props();

	function startProject() {
		// Scroll to contact section
		const contactSection = document.getElementById('contact');
		if (contactSection) {
			contactSection.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<section id="hero" class="relative">
	<div
		class="absolute left-1/2 top-1/2 z-0 h-[150%] w-full -translate-x-1/2 -translate-y-1/2 md:w-[133%]"
	>
		{#key mode}
			<Particles
				className="absolute inset-0"
				refresh={true}
				color={mode.current === 'dark' ? '#ffffff' : '#000000'}
			/>
		{/key}
	</div>
	<div class="relative z-10 mx-auto w-full">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-10 lg:gap-12">
			<!-- Content Column -->
			<div class="flex flex-col justify-center space-y-4 sm:space-y-5 md:space-y-6 order-2 md:order-1 md:col-span-3">
				<BlurFade delay={BLUR_FADE_DELAY}>
					<div
						class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 sm:px-3 sm:py-1 sm:text-sm"
					>
						<Calendar class="mr-2 h-4 w-4" />
						{$_('hero.tagline')}
					</div>
				</BlurFade>

				<BlurFade
					delay={BLUR_FADE_DELAY * 1.1}
					yOffset={8}
				>
					<h1 class="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl/none">
						{resume.greetings}
					</h1>
				</BlurFade>

				<BlurFade delay={BLUR_FADE_DELAY * 1.2}>
					<p class="text-sm text-muted-foreground sm:text-base md:text-lg lg:text-xl">
						{resume.description}
					</p>
				</BlurFade>

				<!-- Key Metrics -->
				<BlurFade delay={BLUR_FADE_DELAY * 1.3}>
					<div class="flex flex-wrap gap-3 text-xs text-muted-foreground sm:gap-4 sm:text-sm md:gap-6">
						<div class="flex items-center gap-2">
							<MapPin class="h-3 w-3 sm:h-4 sm:w-4" />
							<a
								href={resume.locationLink}
								target="_blank"
								rel="noopener noreferrer"
								class="transition-colors hover:text-foreground"
							>
								{resume.location}
							</a>
						</div>
						<div class="flex items-center gap-2">
							<Mail class="h-3 w-3 sm:h-4 sm:w-4" />
							<span>{$_('hero.experience')}</span>
						</div>
						<div class="flex items-center gap-2">
							<Calendar class="h-3 w-3 sm:h-4 sm:w-4" />
							<span>{$_('hero.projects')}</span>
						</div>
					</div>
				</BlurFade>

				<BlurFade delay={BLUR_FADE_DELAY * 1.4}>
					<div class="flex flex-col gap-3 sm:flex-row sm:gap-3 md:gap-4">
						<Button onclick={startProject} size="default" class="w-full sm:w-auto">
							<Mail class="mr-2 h-4 w-4" />
							{$_('hero.cta.start')}
						</Button>
					</div>
				</BlurFade>
			</div>

			<!-- Avatar Column -->
			<div class="flex items-center justify-center order-1 md:order-2 md:col-span-2 md:justify-end">
				<BlurFade delay={BLUR_FADE_DELAY * 1.3}>
					<div class="relative">
						<AvatarRoot class="size-28 border-2 border-border/20 shadow-2xl sm:size-32 md:size-36 lg:size-40 xl:size-44">
							<AvatarImage alt={resume.name} src={resume.avatarUrl} />
							<AvatarFallback class="text-xl sm:text-2xl font-bold">{resume.initials}</AvatarFallback>
						</AvatarRoot>
						<!-- Status indicator -->
						<Badge
							variant="success"
							class="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 px-2 py-0.5 text-[10px] shadow-lg sm:-bottom-2 sm:gap-2 sm:px-2.5 sm:py-1 sm:text-xs"
						>
							<div class="h-1.5 w-1.5 animate-pulse rounded-full bg-white"></div>
							{$_('hero.available')}
						</Badge>
					</div>
				</BlurFade>
			</div>
		</div>
	</div>
</section>
