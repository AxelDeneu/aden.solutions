import type { IResumeGenerator } from './interfaces/IResumeGenerator';
import type { Resume } from '$lib/types';
import { Html2PdfResumeGenerator } from './generators/Html2PdfResumeGenerator';

export class ProfessionalService {
	private resumeGenerator: IResumeGenerator;

	constructor(resumeGenerator?: IResumeGenerator) {
		this.resumeGenerator = resumeGenerator || new Html2PdfResumeGenerator();
	}

	async generateResumePDF(resume: Resume, language?: string): Promise<Blob> {
		const buffer = await this.resumeGenerator.generatePDF(resume, {
			format: 'pdf',
			template: 'modern',
			language: language || 'en'
		});

		return new Blob([buffer], { type: 'application/pdf' });
	}

	async downloadResume(
		resume: Resume,
		filename: string = 'resume.pdf',
		language?: string
	): Promise<void> {
		const blob = await this.generateResumePDF(resume, language);
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();

		// Cleanup
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
}

// Singleton instance
export const professionalService = new ProfessionalService();
