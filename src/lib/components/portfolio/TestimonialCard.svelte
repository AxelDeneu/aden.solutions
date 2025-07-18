<script lang="ts">
	import type { TestimonialItem } from '$lib/types';
	import { cn } from '$lib/utils';
	import Card from '../ui/card/card.svelte';
	import CardContent from '../ui/card/card-content.svelte';
	import Badge from '../ui/badge/badge.svelte';
	import { __ } from '$lib/i18n';

	interface Props {
		testimonial: TestimonialItem;
		class?: string;
		onReadMore?: () => void;
	}

	let { testimonial, class: className, onReadMore }: Props = $props();

	const MAX_LENGTH = 200;
	const isLong = testimonial.testimonial.length > MAX_LENGTH;
	const truncatedText = isLong
		? testimonial.testimonial.substring(0, MAX_LENGTH) + '...'
		: testimonial.testimonial;

	const getInitial = (name: string) => name.charAt(0).toUpperCase();
</script>

<Card class={cn('relative overflow-hidden transition-all hover:shadow-lg', className)}>
	<CardContent class="p-6">
		<div class="mb-4 flex items-start justify-between">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground"
			>
				{getInitial(testimonial.name)}
			</div>
			<svg
				class="h-8 w-8 text-muted-foreground/20"
				fill="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
				/>
			</svg>
		</div>

		<blockquote class="mb-4 text-sm leading-relaxed text-muted-foreground">
			"{isLong ? truncatedText : testimonial.testimonial}"
		</blockquote>

		{#if isLong && onReadMore}
			<button
				onclick={onReadMore}
				class="mb-4 text-sm font-medium text-primary hover:underline focus:outline-none focus:underline"
			>
				{__('testimonial.readMore')}
			</button>
		{/if}

		<div class="space-y-1">
			<p class="font-semibold">{testimonial.name}</p>
			<p class="text-sm text-muted-foreground">
				{testimonial.role}
				{#if testimonial.company}
					<span class="mx-1">•</span>
					<span>{testimonial.company}</span>
				{/if}
			</p>
		</div>
	</CardContent>
</Card>