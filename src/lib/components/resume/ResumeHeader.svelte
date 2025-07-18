<script lang="ts">
	import type { Resume } from '$lib/types';
	import { Mail, Phone, MapPin, Globe, Github, Linkedin } from '@lucide/svelte';
	import { mode } from 'mode-watcher';

	interface Props {
		resume: Resume;
	}

	let { resume }: Props = $props();
</script>

<header class="resume-header mb-8 border-b border-border pb-6">
	<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
		<!-- Left side: Name and Title -->
		<div class="flex-1">
			<h1 class="text-4xl font-bold tracking-tight mb-2">{resume.name}</h1>
			<h2 class="text-xl text-muted-foreground mb-4">{resume.title}</h2>
			
			<!-- Contact Information -->
			<div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
				{#if resume.contact?.methods?.email}
					<div class="flex items-center gap-1 contact-item">
						<Mail class="h-4 w-4 flex-shrink-0" />
						<a href="mailto:{resume.contact.methods.email}" class="hover:text-foreground transition-colors">
							{resume.contact.methods.email}
						</a>
					</div>
				{/if}
				
				{#if resume.contact?.methods?.tel}
					<div class="flex items-center gap-1 contact-item">
						<Phone class="h-4 w-4 flex-shrink-0" />
						<a href="tel:{resume.contact.methods.tel}" class="hover:text-foreground transition-colors">
							{resume.contact.methods.tel}
						</a>
					</div>
				{/if}
				
				<div class="flex items-center gap-1 contact-item">
					<MapPin class="h-4 w-4 flex-shrink-0" />
					<span>Montval-sur-Loir, France</span>
				</div>
				
				{#if resume.url}
					<div class="flex items-center gap-1 contact-item">
						<Globe class="h-4 w-4 flex-shrink-0" />
						<a href={resume.url} class="hover:text-foreground transition-colors">
							{resume.url.replace(/^https?:\/\//, '')}
						</a>
					</div>
				{/if}
			</div>
			
			<!-- Social Links -->
			<div class="flex items-center gap-4 mt-4">
				{#if resume.social?.github}
					<a 
						href={resume.social.github} 
						class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors social-link"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Github class="h-4 w-4 flex-shrink-0" />
						<span>GitHub</span>
					</a>
				{/if}
				
				{#if resume.social?.linkedin}
					<a 
						href={resume.social.linkedin} 
						class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors social-link"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Linkedin class="h-4 w-4 flex-shrink-0" />
						<span>LinkedIn</span>
					</a>
				{/if}
			</div>
		</div>
		
		<!-- Right side: Profile Photo -->
		{#if resume.img}
			<div class="flex-shrink-0">
				<div class="w-32 h-32 rounded-full overflow-hidden border-2 border-border">
					<img 
						src={resume.img} 
						alt={resume.name}
						class="w-full h-full object-cover"
					/>
				</div>
			</div>
		{/if}
	</div>
</header>

<style>
	.contact-item,
	.social-link {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}
	
	@media print {
		.resume-header {
			border-color: #e5e7eb !important;
		}
		
		.resume-header a {
			color: #374151 !important;
			text-decoration: none !important;
		}
	}
	
	:global(body.preparing-pdf) .contact-item,
	:global(body.preparing-pdf) .social-link {
		display: inline-flex !important;
		align-items: center !important;
		gap: 0.25rem !important;
	}
	
	:global(body.preparing-pdf) .contact-item svg,
	:global(body.preparing-pdf) .social-link svg {
		width: 16px !important;
		height: 16px !important;
		display: inline-block !important;
		vertical-align: middle !important;
		margin-top: -2px !important;
	}
</style>