import type { Resume } from '$lib/types';

export interface ResumeOptions {
	format?: 'pdf' | 'docx' | 'html';
	template?: 'modern' | 'classic' | 'minimal';
	includePhoto?: boolean;
	includeReferences?: boolean;
	language?: string;
}

export interface IResumeGenerator {
	generate(resume: Resume, options?: ResumeOptions): Promise<Uint8Array>;
	generatePDF(resume: Resume, options?: ResumeOptions): Promise<Uint8Array>;
	generateHTML(resume: Resume, options?: ResumeOptions): Promise<string>;
}
