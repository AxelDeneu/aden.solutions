<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { marked } from 'marked';
	interface Props {
		title: string;
		description: string;
		dates: string;
		location: string;
		image?: string;
		links?: readonly {
		icon?: any;
		title: string;
		href: string;
	}[];
	}

	let {
		title,
		description,
		dates,
		location,
		image = '',
		links = []
	}: Props = $props();
</script>

<li class="relative ml-10 py-4">
	<div class="absolute -left-16 top-2 flex items-center justify-center rounded-full bg-white">
		<Avatar.Root class="m-auto size-12 border">
			<Avatar.Image src={image} alt={title} class="object-contain" />
			<Avatar.Fallback>{title[0]}</Avatar.Fallback>
		</Avatar.Root>
	</div>
	<div class="flex flex-1 flex-col justify-start gap-1">
		{#if dates}
			<time class="text-xs text-muted-foreground">{dates}</time>
		{/if}
		<h2 class="font-semibold leading-none">{title}</h2>
		{#if location}
			<p class="text-sm text-muted-foreground">{location}</p>
		{/if}
		{#if description}
			<span class="prose text-sm text-muted-foreground dark:prose-invert">
				{@html marked(description)}
			</span>
		{/if}
	</div>
	{#if links && links.length > 0}
		<div class="mt-2 flex flex-row flex-wrap items-start gap-2">
			{#each links as link, idx}
				<a href={link.href}>
					<Badge key={idx} title={link.title} class="flex gap-2">
						<link.icon class="h-4 w-4 " strokeWidth={1.6} />
						{link.title}
					</Badge>
				</a>
			{/each}
		</div>
	{/if}
</li>
