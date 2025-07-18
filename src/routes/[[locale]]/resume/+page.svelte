<script lang="ts">
	import type { Resume } from '$lib/types';
	import { resumeStore } from '$lib/stores/resume';
	import { page } from '$app/stores';
	import { _ } from 'svelte-i18n';
	import { getCurrentLocale } from '$lib/utils/routes';

	// Resume components
	import ResumeHeader from '$lib/components/resume/ResumeHeader.svelte';
	import ResumeSection from '$lib/components/resume/ResumeSection.svelte';
	import WorkExperienceResume from '$lib/components/resume/WorkExperienceResume.svelte';
	import EducationResume from '$lib/components/resume/EducationResume.svelte';
	import SkillsResume from '$lib/components/resume/SkillsResume.svelte';
	import ProjectsResume from '$lib/components/resume/ProjectsResume.svelte';

	let resume = $derived($resumeStore as Resume);
	let isReady = $derived($page.data?.translationsReady && resume?.name);
	let currentLocale = $derived(getCurrentLocale($page.url.pathname));
</script>

<svelte:head>
	<title>{$_('resume.title')} - {$_('site.title')}</title>
	<meta name="description" content={$_('resume.seo.description', { default: 'Professional resume of Axel Deneu, Fullstack Web Developer' })} />
	<meta name="keywords" content="resume, CV, fullstack developer, web developer, PHP, Laravel, Vue.js, professional experience" />
	
	<!-- Canonical URL -->
	<link rel="canonical" href={`https://aden.solutions${currentLocale === 'en-US' ? '/en' : ''}/resume`} />
	
	<!-- Open Graph -->
	<meta property="og:title" content="{$_('resume.title')} - {$_('site.title')}" />
	<meta property="og:description" content={$_('resume.seo.description', { default: 'Professional resume of Axel Deneu, Fullstack Web Developer' })} />
	<meta property="og:type" content="profile" />
	<meta property="og:url" content={`https://aden.solutions${currentLocale === 'en-US' ? '/en' : ''}/resume`} />
	
	<!-- Twitter Card -->
	<meta name="twitter:title" content="{$_('resume.title')} - {$_('site.title')}" />
	<meta name="twitter:description" content={$_('resume.seo.description', { default: 'Professional resume of Axel Deneu, Fullstack Web Developer' })} />
	
	<!-- Print styles -->
	<style>
		@media print {
			body { 
				background: white !important;
				color: black !important;
			}
			.no-print { display: none !important; }
			.resume-container {
				max-width: none !important;
				margin: 0 !important;
				padding: 0 !important;
				box-shadow: none !important;
			}
			.resume-section {
				break-inside: avoid;
				page-break-inside: avoid;
			}
		}
	</style>
</svelte:head>

{#if isReady}
	<div class="resume-container min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-4xl resume-content">
			<!-- Resume Header -->
			<ResumeHeader {resume} />
			
			<!-- Professional Summary -->
			<ResumeSection title={$_('resume.sections.summary')}>
				<div class="prose prose-neutral dark:prose-invert max-w-none">
					<p class="text-lg leading-relaxed">{resume.summary}</p>
				</div>
			</ResumeSection>
			
			<!-- Work Experience -->
			<ResumeSection title={$_('resume.sections.experience')}>
				<WorkExperienceResume workExperience={resume.workExperience} />
			</ResumeSection>
			
			<!-- Education -->
			<ResumeSection title={$_('resume.sections.education')}>
				<EducationResume education={resume.education} />
			</ResumeSection>
			
			<!-- Skills -->
			<ResumeSection title={$_('resume.sections.skills')}>
				<SkillsResume skills={resume.skills} />
			</ResumeSection>
			
			<!-- Featured Projects -->
			<ResumeSection title={$_('resume.sections.projects')}>
				<ProjectsResume projects={resume.projects} />
			</ResumeSection>
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center min-h-screen">
		<div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
	</div>
{/if}

<style>
	.resume-container {
		background: hsl(var(--background));
		color: hsl(var(--foreground));
	}
	
	.resume-section {
		margin-bottom: 2rem;
	}
	
	@media print {
		.resume-container {
			background: white !important;
			color: black !important;
		}
	}
</style>