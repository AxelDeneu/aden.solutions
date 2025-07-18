import type { RequestHandler } from './$types';
import { professionalService } from '$lib/modules/professional/ProfessionalService';
import { resumeStore } from '$lib/stores/resume';
import { get } from 'svelte/store';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const language = url.searchParams.get('lang') || 'en';
		const resume = get(resumeStore);

		// Generate PDF
		const blob = await professionalService.generateResumePDF(resume as any, language);
		const buffer = await blob.arrayBuffer();

		// Generate filename with current date
		const date = new Date().toISOString().split('T')[0];
		const filename = `axel-deneu-resume-${date}.pdf`;

		return new Response(buffer, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="${filename}"`,
				'Cache-Control': 'no-cache'
			}
		});
	} catch (error) {
		console.error('Error generating resume:', error);
		return new Response('Error generating resume', { status: 500 });
	}
};
