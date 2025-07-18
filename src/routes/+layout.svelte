<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { Resume } from '$lib/types';

	import '../app.css';
	import { waitLocale, locale, _ } from 'svelte-i18n';
	import { ModeWatcher, setMode } from 'mode-watcher';
	import { page } from '$app/stores';

	import Navbar from '$lib/components/portfolio/Navbar.svelte';
	import { resumeStore } from '$lib/stores/resume';
	import { SeoService } from '$lib/modules/seo';
	import { getCurrentLocale, type Locale } from '$lib/utils/routes';
	import { generateBreadcrumbs, breadcrumbsToStructuredData } from '$lib/utils/breadcrumbs';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let visible = $state(false);
	let jsonLdScript = $state('');

	setMode('dark');

	// Only show content when translations are ready
	run(() => {
		if ($page.data?.translationsReady) {
			waitLocale().then(() => {
				visible = true;
			});
		}
	});

	// Sync locale with URL changes (for direct navigation, browser back/forward)
	run(() => {
		if ($page.url) {
			const urlLocale = getCurrentLocale($page.url.pathname);
			if ($locale !== urlLocale) {
				locale.set(urlLocale);
			}
		}
	});

	let resume: Resume = $state();

	resumeStore.subscribe(($resume) => {
		resume = { ...$resume } as Resume;
	});

	// Generate structured data
	run(() => {
		if (resume && resume.name) {
			const seoService = new SeoService(resume.url || 'https://aden.solutions');

			// Add Person schema
			seoService.addPersonSchema({
				name: resume.name,
				url: resume.url,
				image: resume.img,
				jobTitle: 'Fullstack Web Developer',
				sameAs: [
					resume.social?.github || '',
					resume.social?.linkedin || '',
					resume.social?.twitter || '',
					resume.social?.Malt || ''
				].filter(Boolean),
				address: {
					'@type': 'PostalAddress' as const,
					addressLocality: 'Montval-sur-Loir',
					addressCountry: 'France'
				},
				email: 'hello@aden.solutions',
				telephone: '+33635414964'
			});

			// Add Organization schema
			seoService.addOrganizationSchema({
				name: 'ADEN Solutions',
				url: resume.url || 'https://aden.solutions',
				logo: resume.img || 'https://aden.solutions/avatar.png',
				description: 'Fullstack Web Development Services specializing in PHP, Laravel, and modern JavaScript frameworks',
				email: 'hello@aden.solutions',
				telephone: '+33635414964',
				address: {
					'@type': 'PostalAddress' as const,
					addressLocality: 'Montval-sur-Loir',
					addressRegion: 'Pays de la Loire',
					postalCode: '72500',
					addressCountry: 'FR'
				},
				sameAs: [
					'https://github.com/AxelDeneu',
					'https://www.linkedin.com/in/adeneu/',
					'https://www.malt.fr/profile/axeldeneu'
				],
				founder: {
					'@type': 'Person',
					name: resume.name
				}
			});

			// Add WebSite schema with search action
			seoService.addWebSiteSchema({
				name: resume.name + ' - Portfolio',
				url: resume.url || 'https://aden.solutions',
				description: resume.seo?.description || '',
				inLanguage: $locale === 'en-US' ? 'en' : 'fr',
				potentialAction: {
					'@type': 'SearchAction',
					target: {
						'@type': 'EntryPoint',
						urlTemplate: `${resume.url}/en/blog?search={search_term_string}`
					},
					'query-input': 'required name=search_term_string'
				}
			});

			// Add Service schema for offerings
			const services = [
				{
					'@type': 'Service',
					'name': 'Fullstack Web Development',
					'description': 'End-to-end web application development using modern technologies',
					'provider': {
						'@type': 'Organization',
						'name': 'ADEN Solutions'
					},
					'serviceType': 'Web Development',
					'areaServed': {
						'@type': 'Country',
						'name': 'France'
					}
				},
				{
					'@type': 'Service',
					'name': 'Laravel Development',
					'description': 'Expert Laravel development for robust web applications and APIs',
					'provider': {
						'@type': 'Organization',
						'name': 'ADEN Solutions'
					},
					'serviceType': 'Backend Development'
				},
				{
					'@type': 'Service',
					'name': 'Vue.js Development',
					'description': 'Modern frontend development with Vue.js and reactive interfaces',
					'provider': {
						'@type': 'Organization',
						'name': 'ADEN Solutions'
					},
					'serviceType': 'Frontend Development'
				},
				{
					'@type': 'Service',
					'name': 'SaaS Development',
					'description': 'Complete SaaS application development from concept to deployment',
					'provider': {
						'@type': 'Organization',
						'name': 'ADEN Solutions'
					},
					'serviceType': 'Software Development'
				}
			];
			
			services.forEach(service => seoService.addServiceSchema(service));

			// Add BreadcrumbList schema
			if ($page.url) {
				const breadcrumbTranslations = {
					home: $_('Home'),
					blog: $_('Blog'),
					projects: $_('Projects'),
					en: 'English',
					fr: 'Français'
				};
				
				const breadcrumbs = generateBreadcrumbs(
					$page.url.pathname,
					resume.url || 'https://aden.solutions',
					breadcrumbTranslations
				);
				
				if (breadcrumbs && Array.isArray(breadcrumbs) && breadcrumbs.length > 1) {
					try {
						// Convert breadcrumbs to the format expected by addBreadcrumbSchema
						const breadcrumbItems = breadcrumbs.map(crumb => ({
							name: crumb.name,
							url: crumb.url
						}));
						seoService.addBreadcrumbListSchema(breadcrumbItems);
					} catch (error) {
						console.warn('Failed to add breadcrumb schema:', error);
					}
				}
			}

			// Generate JSON-LD script
			jsonLdScript = seoService.generateJsonLdScript();
		}
	});
</script>

<svelte:head>
	<title>{resume.seo.title}</title>
	<meta name="description" content={resume.seo.description} />
	<meta name="keywords" content={resume.seo.keywords} />
	<meta name="author" content={resume.seo.author} />

	<!-- Canonical URL -->
	<link rel="canonical" href={$locale === 'en-US' ? `${resume.url}/en` : resume.url} />

	<!-- Alternate languages -->
	<link rel="alternate" hreflang="en" href="{resume.url}/en" />
	<link rel="alternate" hreflang="fr" href={resume.url} />
	<link rel="alternate" hreflang="x-default" href={resume.url} />

	<!-- Open Graph -->
	<meta property="og:title" content={resume.seo.title} />
	<meta property="og:description" content={resume.seo.description} />
	<meta property="og:url" content={resume.url} />
	<meta property="og:site_name" content={resume.name} />
	<meta property="og:image" content={resume.seo.image} />
	<meta property="og:image:alt" content={resume.seo.imageAlt} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:locale" content={$locale === 'en-US' ? 'en_US' : 'fr_FR'} />
	<meta property="og:locale:alternate" content="en_US" />
	<meta property="og:locale:alternate" content="fr_FR" />
	<meta property="og:type" content="website" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={resume.seo.twitterCreator} />
	<meta name="twitter:creator" content={resume.seo.twitterCreator} />
	<meta name="twitter:title" content={resume.seo.title} />
	<meta name="twitter:description" content={resume.seo.description} />
	<meta name="twitter:image" content={resume.seo.image} />
	<meta name="twitter:image:alt" content={resume.seo.imageAlt} />
	<meta name="twitter:image:width" content="1200" />
	<meta name="twitter:image:height" content="630" />

	<!-- Search Engine -->
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
	<meta name="googlebot" content="index, follow" />
	<meta name="bingbot" content="index, follow" />

	<!-- Verification -->
	<!-- <meta name="google-site-verification" content="your-google-verification-code" /> -->
	<meta name="p:domain_verify" content="pinterest-verification-code" />
	<meta name="yandex-verification" content="yandex-verification-code" />
	<meta name="msvalidate.01" content="bing-verification-code" />

	<!-- Structured Data -->
	{@html jsonLdScript}
</svelte:head>

<ModeWatcher />

<!-- Skip Links -->
{#if visible}
	<a href="#main-content" class="skip-link">
		{$_('Skip to main content')}
	</a>
	<a href="#navigation" class="skip-link">
		{$_('Skip to navigation')}
	</a>
{/if}

<div
	class="relative mx-auto min-h-screen w-full max-w-2xl bg-background px-4 py-6 font-sans antialiased sm:px-6 sm:py-10 md:max-w-3xl md:px-8 md:py-12 lg:max-w-4xl lg:px-10 lg:py-16 xl:max-w-5xl xl:py-20"
>
	{#if visible}
		<main id="main-content" class="flex min-h-[100dvh] flex-col space-y-10" tabindex="-1">
			{@render children?.()}
		</main>
		<Navbar />
	{/if}
</div>

<style>
	.skip-link {
		position: absolute;
		left: -10000px;
		top: auto;
		width: 1px;
		height: 1px;
		overflow: hidden;
		background: var(--background);
		color: var(--foreground);
		padding: 0.5rem 1rem;
		text-decoration: none;
		border-radius: 0.25rem;
		border: 2px solid var(--primary);
		z-index: 9999;
	}

	.skip-link:focus {
		position: fixed;
		left: 1rem;
		top: 1rem;
		width: auto;
		height: auto;
		overflow: visible;
	}
</style>
