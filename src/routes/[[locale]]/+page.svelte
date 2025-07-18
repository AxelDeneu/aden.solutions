<script lang="ts">
	import type { Resume } from '$lib/types';
	import { resumeStore } from '$lib/stores/resume';
	import { page } from '$app/stores';
	import { _ } from 'svelte-i18n';

	import Customers from '$lib/components/sections/Customers.svelte';
	import About from '$lib/components/sections/About.svelte';
	import Hero from '$lib/components/sections/Hero.svelte';
	import WorkExperience from '$lib/components/sections/WorkExperienceTimeline.svelte';
	import Education from '$lib/components/sections/Education.svelte';
	import Skills from '$lib/components/sections/Skills.svelte';
	import Projects from '$lib/components/sections/ProjectsEnhanced.svelte';
	import Contact from '$lib/components/sections/Contact.svelte';
	import Testimonials from '$lib/components/sections/Testimonials.svelte';

	let resume = $derived($resumeStore as Resume);
	let isReady = $derived($page.data?.translationsReady && resume?.name);
	
	// Generate testimonial structured data
	let testimonialStructuredData = $derived(() => {
		if (!resume?.testimonials?.items) return null;
		
		const reviews = resume.testimonials.items.map((testimonial) => ({
			"@type": "Review",
			"author": {
				"@type": "Person",
				"name": testimonial.name,
				"jobTitle": testimonial.role,
				...(testimonial.company && { "worksFor": testimonial.company })
			},
			"reviewBody": testimonial.testimonial,
			"reviewRating": {
				"@type": "Rating",
				"ratingValue": 5,
				"bestRating": 5,
				"worstRating": 1
			}
		}));
		
		return {
			"@context": "https://schema.org",
			"@type": "Person",
			"name": resume.name,
			"review": reviews,
			"aggregateRating": {
				"@type": "AggregateRating",
				"ratingValue": "5",
				"reviewCount": reviews.length,
				"bestRating": "5",
				"worstRating": "1"
			}
		};
	});
</script>

<svelte:head>
	{#if testimonialStructuredData()}
		<script type="application/ld+json">
			{JSON.stringify(testimonialStructuredData())}
		</script>
	{/if}
</svelte:head>

{#if isReady}
	<Hero {resume} />
	<About {resume} />
	<Customers customers={resume.customers} />
	<WorkExperience workExperience={resume.workExperience} />
	<Education education={resume.education} />
	<Skills skills={resume.skills} />
	<Projects projects={resume.projects} />
	<Testimonials testimonials={resume.testimonials} />
	<Contact contact={resume.contact} />
{/if}
