import type { IResumeGenerator, ResumeOptions } from '../interfaces/IResumeGenerator';
import type { Resume } from '$lib/types';
import type { Html2PdfOptions } from 'html2pdf.js';

export class Html2PdfResumeGenerator implements IResumeGenerator {
	async generate(resume: Resume, options?: ResumeOptions): Promise<Uint8Array> {
		const format = options?.format || 'pdf';

		switch (format) {
			case 'pdf':
				return this.generatePDF(resume, options);
			case 'html':
				const html = await this.generateHTML(resume, options);
				return new TextEncoder().encode(html);
			default:
				throw new Error(`Unsupported format: ${format}`);
		}
	}

	async generatePDF(resume: Resume, options?: ResumeOptions): Promise<Uint8Array> {
		// Create HTML content first
		const htmlContent = await this.generateHTML(resume, options);

		// Create a temporary div to render the HTML
		const container = document.createElement('div');
		container.innerHTML = htmlContent;
		container.style.position = 'absolute';
		container.style.left = '-9999px';
		container.style.width = '210mm'; // A4 width
		container.style.visibility = 'hidden';
		document.body.appendChild(container);

		try {
			// Wait for fonts to load
			await document.fonts.ready;
			
			// Wait for content to render
			await new Promise(resolve => setTimeout(resolve, 100));
			
			// Force a reflow to ensure styles are applied
			container.offsetHeight;

			// html2pdf.js options
			const html2pdfOptions: Html2PdfOptions = {
				margin: 10,
				filename: 'resume.pdf',
				image: {
					type: 'png',
					quality: 0.95
				},
				html2canvas: {
					scale: 2,
					useCORS: true,
					logging: false,
					backgroundColor: '#ffffff',
					width: container.scrollWidth,
					height: container.scrollHeight,
					windowWidth: container.scrollWidth,
					windowHeight: container.scrollHeight,
					allowTaint: true,
					foreignObjectRendering: false
				},
				jsPDF: {
					unit: 'mm',
					format: 'a4',
					orientation: 'portrait'
				},
				pagebreak: {
					mode: ['avoid-all', 'css', 'legacy'],
					before: ['.section'],
					after: ['.page-break-after'],
					avoid: ['.no-break', '.avoid-break']
				}
			};

			// Dynamically import html2pdf.js (browser only)
			const { default: html2pdf } = await import('html2pdf.js');
			
			// Generate PDF and get as array buffer
			const pdfBlob = await html2pdf()
				.from(container)
				.set(html2pdfOptions)
				.outputPdf('blob');

			// Convert blob to array buffer
			const arrayBuffer = await pdfBlob.arrayBuffer();
			return new Uint8Array(arrayBuffer);

		} finally {
			// Clean up
			document.body.removeChild(container);
		}
	}

	async generateHTML(resume: Resume, options?: ResumeOptions): Promise<string> {
		const template = options?.template || 'modern';
		const lang = options?.language || 'en';

		// Helper function to safely get translated text
		const t = (value: any): string => {
			if (typeof value === 'string') return value;
			if (value && typeof value === 'object') {
				return value[lang] || value['en'] || Object.values(value)[0] || '';
			}
			return '';
		};

		return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${resume.name} - Resume</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			line-height: 1.6;
			color: #333;
			background: white;
			padding: 20mm;
			font-size: 14px;
		}
		
		.header {
			text-align: center;
			margin-bottom: 30px;
			padding-bottom: 20px;
			border-bottom: 2px solid #2563eb;
		}
		
		.header h1 {
			font-size: 32px;
			margin-bottom: 10px;
			color: #1e293b;
		}
		
		.header .title {
			font-size: 20px;
			color: #64748b;
			margin-bottom: 10px;
		}
		
		.contact {
			display: flex;
			justify-content: center;
			gap: 20px;
			flex-wrap: wrap;
			font-size: 14px;
			color: #64748b;
		}
		
		.contact a {
			color: #2563eb;
			text-decoration: none;
		}
		
		.section {
			margin-bottom: 30px;
			page-break-inside: avoid;
		}
		
		.section h2 {
			font-size: 22px;
			color: #1e293b;
			margin-bottom: 15px;
			padding-bottom: 5px;
			border-bottom: 1px solid #e2e8f0;
		}
		
		.experience-item,
		.education-item,
		.project-item {
			margin-bottom: 20px;
			page-break-inside: avoid;
		}
		
		.item-header {
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			margin-bottom: 5px;
		}
		
		.item-title {
			font-size: 18px;
			font-weight: 600;
			color: #1e293b;
		}
		
		.item-date {
			font-size: 14px;
			color: #64748b;
		}
		
		.item-subtitle {
			font-size: 16px;
			color: #475569;
			margin-bottom: 5px;
		}
		
		.item-description {
			font-size: 14px;
			color: #64748b;
			line-height: 1.5;
		}
		
		.skills-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			gap: 10px;
		}
		
		.skill-category {
			margin-bottom: 15px;
		}
		
		.skill-category h3 {
			font-size: 16px;
			color: #1e293b;
			margin-bottom: 8px;
		}
		
		.skill-list {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
		}
		
		.skill-badge {
			background: #e0e7ff;
			color: #4338ca;
			padding: 4px 12px;
			border-radius: 4px;
			font-size: 14px;
		}
		
		.page-break-before {
			page-break-before: always;
		}
		
		.page-break-after {
			page-break-after: always;
		}
		
		.no-break {
			page-break-inside: avoid;
		}
		
		@media print {
			body {
				padding: 10mm;
				font-size: 12px;
			}
			
			.header h1 {
				font-size: 28px;
			}
			
			.header .title {
				font-size: 18px;
			}
			
			.section h2 {
				font-size: 20px;
			}
			
			.item-title {
				font-size: 16px;
			}
			
			.item-subtitle {
				font-size: 14px;
			}
		}
	</style>
</head>
<body>
	<div class="header">
		<h1>${resume.name}</h1>
		<div class="title">${t(resume.title)}</div>
		<div class="contact">
			${resume.contact.methods.email ? `<a href="mailto:${resume.contact.methods.email}">${resume.contact.methods.email}</a>` : ''}
			${resume.contact.methods.tel ? `<span>${resume.contact.methods.tel}</span>` : ''}
			${resume.location ? `<span>${resume.location}</span>` : ''}
		</div>
	</div>

	<div class="section">
		<h2>${t(resume.about)}</h2>
		<p class="item-description">${t(resume.summary)}</p>
	</div>

	<div class="section">
		<h2>${t(resume.workExperience.label)}</h2>
		${resume.workExperience.items
			.map(
				(work) => `
			<div class="experience-item">
				<div class="item-header">
					<div class="item-title">${t(work.title)}</div>
					<div class="item-date">${t(work.start)} - ${t(work.end)}</div>
				</div>
				<div class="item-subtitle">${work.company} • ${t(work.location)}</div>
				<p class="item-description">${t(work.description)}</p>
			</div>
		`
			)
			.join('')}
	</div>

	<div class="section">
		<h2>${t(resume.education.label)}</h2>
		${resume.education.items
			.map(
				(edu) => `
			<div class="education-item">
				<div class="item-header">
					<div class="item-title">${t(edu.degree)}</div>
					<div class="item-date">${t(edu.start)} - ${t(edu.end)}</div>
				</div>
				<div class="item-subtitle">${edu.school}</div>
			</div>
		`
			)
			.join('')}
	</div>

	<div class="section">
		<h2>Skills</h2>
		<div class="skill-list">
			${resume.skills
				.map(
					(skill) => `
				<span class="skill-badge">${skill}</span>
			`
				)
				.join('')}
		</div>
	</div>

	<div class="section">
		<h2>${t(resume.projects.label)}</h2>
		${resume.projects.items
			.slice(0, 3)
			.map(
				(project) => `
			<div class="project-item">
				<div class="item-header">
					<div class="item-title">${project.title}</div>
					<div class="item-date">${project.dates}</div>
				</div>
				<p class="item-description">${project.description}</p>
				<div class="skill-list" style="margin-top: 8px;">
					${project.technologies
						.map(
							(tech) => `
						<span class="skill-badge">${tech}</span>
					`
						)
						.join('')}
				</div>
			</div>
		`
			)
			.join('')}
	</div>
</body>
</html>
		`;
	}
}