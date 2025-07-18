<script lang="ts">
	import type { Contact } from '$lib/types';

	import { BLUR_FADE_DELAY } from '$lib/static/consts';

	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import ContactForm from '$lib/components/portfolio/ContactForm.svelte';

	interface Props {
		contact: Contact;
	}

	let { contact }: Props = $props();
</script>

<section id="contact">
	<div class="grid w-full items-center justify-center gap-6 px-0 py-8 sm:gap-8 sm:px-4 sm:py-10 md:px-6 md:py-12">
		<BlurFade delay={BLUR_FADE_DELAY * 2}>
			<div class="space-y-3 text-center">
				<div
					class="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background"
					aria-hidden="true"
				>
					Contact
				</div>
				<h2 class="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">{contact.label}</h2>
				<p
					class="mx-auto max-w-[600px] text-sm text-muted-foreground sm:text-base md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed"
				>
					{contact.description}
					<a
						href={`mailto:${contact.methods.email}`}
						class="text-primary hover:underline"
						aria-label="Send email to {contact.methods.email}"
					>
						{contact.methods.email}
					</a>
				</p>
			</div>
		</BlurFade>
		
		<BlurFade delay={BLUR_FADE_DELAY * 2.5}>
			<ContactForm />
		</BlurFade>
	</div>
</section>
