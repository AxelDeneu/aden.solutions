<script lang="ts">
	import type { Testimonials, TestimonialItem } from '$lib/types';

	import { BLUR_FADE_DELAY } from '$lib/static/consts';

	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import TestimonialCard from '$lib/components/portfolio/TestimonialCard.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	interface Props {
		testimonials: Testimonials;
	}

	let { testimonials }: Props = $props();
	
	let selectedTestimonial = $state<TestimonialItem | null>(null);
	let isDialogOpen = $state(false);

	function openTestimonialDialog(testimonial: TestimonialItem) {
		selectedTestimonial = testimonial;
		isDialogOpen = true;
	}

	function closeDialog() {
		isDialogOpen = false;
		selectedTestimonial = null;
	}
</script>

<section id="testimonials">
	<div class="w-full space-y-8 py-8 sm:space-y-10 sm:py-10 md:space-y-12 md:py-12">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<div class="flex flex-col items-center justify-center space-y-4 text-center">
				<div class="space-y-2">
					<div class="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
						{testimonials.supLabel}
					</div>
					<h2 class="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
						{testimonials.label}
					</h2>
					<p
						class="text-sm text-muted-foreground sm:text-base md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed"
					>
						{testimonials.description}
					</p>
				</div>
			</div>
		</BlurFade>
		
		<div class="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each testimonials.items as testimonial, idx}
				<BlurFade delay={BLUR_FADE_DELAY * 1.2 + idx * 0.05}>
					<TestimonialCard
						{testimonial}
						onReadMore={() => openTestimonialDialog(testimonial)}
						class="h-full"
					/>
				</BlurFade>
			{/each}
		</div>
	</div>
	
	<Dialog.Root open={isDialogOpen} onOpenChange={(open) => !open && closeDialog()}>
		<Dialog.Content>
			{#if selectedTestimonial}
				<Dialog.Header>
					<Dialog.Title>
						{selectedTestimonial.name}
					</Dialog.Title>
				</Dialog.Header>
				<div class="space-y-4">
					<div class="flex items-center gap-2">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
						>
							{selectedTestimonial.name.charAt(0).toUpperCase()}
						</div>
						<div>
							<p class="font-medium">{selectedTestimonial.name}</p>
							<p class="text-sm text-muted-foreground">
								{selectedTestimonial.role}
								{#if selectedTestimonial.company}
									• {selectedTestimonial.company}
								{/if}
							</p>
						</div>
					</div>
					<blockquote class="space-y-2 text-sm leading-relaxed">
						<svg
							class="h-6 w-6 text-muted-foreground/20"
							fill="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
							/>
						</svg>
						<p class="italic">"{selectedTestimonial.testimonial}"</p>
					</blockquote>
				</div>
			{/if}
		</Dialog.Content>
	</Dialog.Root>
</section>
