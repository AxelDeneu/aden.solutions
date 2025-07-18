<script lang="ts">
	import { resumeStore } from '$lib/stores/resume';
	import Dock from '../magic/Dock.svelte';
	import DockIcon from '../magic/DockIcon.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ModeToggle from './ModeToggle.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { mode } from 'mode-watcher';
	import LocaleToggle from '$lib/components/portfolio/LocaleToggle.svelte';
	import ResumeDownloadButton from '$lib/components/portfolio/ResumeDownloadButton.svelte';
	import { locale } from 'svelte-i18n';
	import { __ } from '$lib/i18n';
	import type { SocialLink } from '$lib/types/Contact';

	let socialLinks =
		$derived(($resumeStore.contact &&
				Object.entries($resumeStore.contact.methods.social)
					.filter(([_, social]) => social.navbar)
					.map(([_, social]) => social as SocialLink)) ||
			[]);
</script>

<nav
	id="navigation"
	class="pointer-events-none fixed inset-x-0 bottom-10 z-30 mx-auto mb-safe flex h-full max-h-14 origin-bottom sm:mb-4 sm:max-h-14"
	aria-label={__('Main navigation')}
	tabindex="-1"
>
	<div
		class="fixed inset-x-0 bottom-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"
	></div>
	<Dock
		class="pointer-events-auto relative z-50 mx-auto flex h-full min-h-full max-w-[calc(100vw-2rem)] transform-gpu items-center gap-1 overflow-x-auto rounded-full bg-background px-2 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] sm:gap-1.5 sm:overflow-x-visible sm:px-3 md:gap-2 md:px-4"


	>
		{#snippet children({ magnification, distance, mouseX })}
			{#each $resumeStore.navbar?.items || [] as item}
				<DockIcon {magnification} {mouseX} {distance}>
					<Tooltip.Provider>
						<Tooltip.Root openDelay={300}>
							<Tooltip.Trigger>
								<Button href={item.href} variant="ghost" size="icon" class="size-11 rounded-full sm:size-11 md:size-12">
									<item.icon class="size-[18px] sm:size-[18px]" strokeWidth={1.5} />
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>{item.label}</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>
				</DockIcon>
			{/each}
			<Separator orientation="vertical" class="hidden h-full sm:block" />
			{#each socialLinks as social (social.name)}
				<DockIcon {magnification} {mouseX} {distance}>
					<Tooltip.Provider>
						<Tooltip.Root openDelay={300}>
							<Tooltip.Trigger>
								<Button href={social.url} variant="ghost" size="icon"
												class="size-11 rounded-full sm:size-11 md:size-12">
									<!-- <svelte:component this={social.icon} class="size-4" strokeWidth={1.5} /> -->
									{#if social?.dark_icon && mode.current === 'dark'}
										<img src={social?.dark_icon} class="size-4 sm:size-[18px]" alt={social.name} />
									{:else}
										<img src={social.icon} class="size-4 sm:size-[18px]" alt={social.name} />
									{/if}
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>{social.name}</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>
				</DockIcon>
			{/each}
			<Separator orientation="vertical" class="hidden h-full py-2 sm:block" />
			<DockIcon {magnification} {mouseX} {distance}>
				<Tooltip.Provider>
					<Tooltip.Root openDelay={300}>
						<Tooltip.Trigger>
							<ModeToggle />
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>Theme</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
			</DockIcon>
			<DockIcon {magnification} {mouseX} {distance}>
				<Tooltip.Provider>
					<Tooltip.Root openDelay={300}>
						<Tooltip.Trigger>
							<LocaleToggle />
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>
								{$locale === 'fr-FR' ? __('Switch to English version') : __('Switch to French version')}
							</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
			</DockIcon>
<!--			<DockIcon {magnification} {mouseX} {distance}>-->
<!--				<Tooltip.Provider>-->
<!--					<Tooltip.Root openDelay={300}>-->
<!--						<Tooltip.Trigger>-->
<!--							<ResumeDownloadButton />-->
<!--						</Tooltip.Trigger>-->
<!--						<Tooltip.Content>-->
<!--							<p>{__('resume.download', { default: 'Download Resume' })}</p>-->
<!--						</Tooltip.Content>-->
<!--					</Tooltip.Root>-->
<!--				</Tooltip.Provider>-->
<!--			</DockIcon>-->
		{/snippet}
	</Dock>
</nav>
