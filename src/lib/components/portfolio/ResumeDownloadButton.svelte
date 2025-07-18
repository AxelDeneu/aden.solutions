<script lang="ts">
	import { Download } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { html2PdfService } from '$lib/services/Html2PdfService';
	import { locale } from 'svelte-i18n';
	import { __ } from '$lib/i18n';
	import { goto } from '$app/navigation';

	let isDownloading = $state(false);

	async function downloadResume() {
		if (isDownloading) return;
		
		try {
			isDownloading = true;
			
			// Navigate to resume page if not already there
			const currentPath = window.location.pathname;
			const isOnResumePage = currentPath.includes('/resume');
			
			if (!isOnResumePage) {
				// Navigate to resume page and wait for it to load
				const resumePath = $locale === 'en-US' ? '/en/resume' : '/resume';
				await goto(resumePath);
				// Wait for navigation and page render
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
			
			// Wait a bit more to ensure content is fully rendered
			await new Promise(resolve => setTimeout(resolve, 500));
			
			// Check if the resume container exists and has content
			let resumeContainer = document.querySelector('.resume-container');
			let attempts = 0;
			while ((!resumeContainer || resumeContainer.children.length === 0) && attempts < 10) {
				await new Promise(resolve => setTimeout(resolve, 300));
				resumeContainer = document.querySelector('.resume-container');
				attempts++;
			}
			
			if (!resumeContainer || resumeContainer.children.length === 0) {
				console.error('Resume container not found or empty after waiting');
				throw new Error('Resume content not loaded');
			}
			
			console.log('Resume container found with', resumeContainer.children.length, 'children');
			
			const currentLocale = $locale === 'en-US' ? 'en' : 'fr';
			const filename = `axel-deneu-resume-${new Date().toISOString().split('T')[0]}.pdf`;
			
			await html2PdfService.captureElementAsPdf(
				'.resume-container',
				filename,
				{
					beforeCapture: async () => {
						// Ensure we're capturing the right element
						console.log('Starting PDF capture...');
					},
					afterCapture: async () => {
						console.log('PDF capture completed');
					}
				}
			);
		} catch (error) {
			console.error('Failed to download resume:', error);
			// Could show a toast notification here
		} finally {
			isDownloading = false;
		}
	}
</script>

<Button 
	onclick={downloadResume}
	variant="ghost" 
	size="icon"
	class="size-11 rounded-full sm:size-11 md:size-12 {isDownloading ? 'opacity-50 cursor-not-allowed' : ''}"
	disabled={isDownloading}
>
	<Download 
		class="size-[18px] sm:size-[18px] {isDownloading ? 'animate-pulse' : ''}" 
		strokeWidth={1.5} 
	/>
</Button>