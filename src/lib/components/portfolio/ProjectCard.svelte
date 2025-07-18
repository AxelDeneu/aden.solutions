<script lang="ts">
	import { marked } from 'marked';
	import Badge from '../ui/badge/badge.svelte';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
	import { Github, ExternalLink, Calendar, Clock, Activity } from '@lucide/svelte';
	import { _ } from 'svelte-i18n';

	
	interface Props {
		class?: string;
		title: string;
		href?: string;
		description: string;
		dates: string;
		tags: readonly string[];
		link?: string;
		image?: string;
		video?: string;
		links?: { icon: any; type: string; href: string }[];
		active?: boolean;
	}

	let {
		class: _class = '',
		title,
		href = '',
		description,
		dates,
		tags,
		link = '',
		image = '',
		video = '',
		links = [],
		active = false
	}: Props = $props();

	// Icon mapping for serializable data
	const iconMap = {
		Github,
		ExternalLink
	};

	function getIconComponent(iconName: string) {
		return iconMap[iconName as keyof typeof iconMap] || ExternalLink;
	}
</script>

<Card class="h-full transition-shadow hover:shadow-lg {_class}">
	{#if video || image}
		<div class="aspect-video overflow-hidden rounded-t-lg">
			{#if video}
				<video
					class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
					src={video}
					autoplay
					loop
					muted
					aria-label="Demo video for {title}"
				></video>
			{:else}
				<img
					class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
					src={image}
					alt="{title} project screenshot"
				/>
			{/if}
		</div>
	{/if}

	<CardHeader class="p-4 sm:p-6">
		<div class="mb-2 flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
			<span class="flex items-center gap-1">
				<Calendar class="h-3 w-3 sm:h-4 sm:w-4" />
				{dates}
			</span>
			{#if active}
				<Badge variant="success" class="text-[10px] sm:text-xs">
					<Activity class="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
					{$_('projects.badge.active')}
				</Badge>
			{/if}
		</div>
		<CardTitle class="line-clamp-2">{title}</CardTitle>
		<CardDescription class="line-clamp-3">
			{@html marked(description)}
		</CardDescription>
	</CardHeader>

	<CardContent>
		<!-- Technologies -->
		{#if tags && tags.length > 0}
			<div class="mb-4 flex flex-wrap gap-2">
				{#each tags as tag}
					<Badge variant="secondary">{tag}</Badge>
				{/each}
			</div>
		{/if}

		<!-- Project Links -->
		{#if links && links.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each links as link}
					<a
						href={link?.href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="{link.type} link for {title}"
						class="inline-flex"
					>
						<Badge variant="outline" class="flex items-center gap-1">
							{@const SvelteComponent = typeof link.icon === 'string' ? getIconComponent(link.icon) : link.icon}
							<SvelteComponent
								class="h-3 w-3"
								strokeWidth={1.6}
								aria-hidden="true"
							/>
							{$_(link.type)}
						</Badge>
					</a>
				{/each}
			</div>
		{/if}
	</CardContent>
</Card>
