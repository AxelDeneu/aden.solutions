import type { Html2PdfOptions } from 'html2pdf.js';

export class Html2PdfService {
	async captureElementAsPdf(
		elementSelector: string,
		filename: string = 'document.pdf',
		options?: {
			beforeCapture?: () => void | Promise<void>;
			afterCapture?: () => void | Promise<void>;
			html2pdfOptions?: Html2PdfOptions;
		}
	): Promise<void> {
		const element = document.querySelector(elementSelector) as HTMLElement;
		if (!element) {
			throw new Error(`Element with selector "${elementSelector}" not found`);
		}

		console.log('Found element:', element);
		console.log('Element dimensions:', {
			width: element.offsetWidth,
			height: element.offsetHeight,
			scrollWidth: element.scrollWidth,
			scrollHeight: element.scrollHeight
		});

		// Execute before capture callback if provided
		if (options?.beforeCapture) {
			await options.beforeCapture();
		}

		try {
			// Wait for fonts to load
			await document.fonts.ready;
			
			// Add print styles temporarily
			const printClass = 'preparing-pdf';
			document.body.classList.add(printClass);
			
			// Wait for styles and fonts to fully apply
			await new Promise(resolve => setTimeout(resolve, 500));
			
			// Force a reflow to ensure styles are applied
			element.offsetHeight;

			// Default options optimized for resume generation
			const defaultOptions: Html2PdfOptions = {
				margin: 10,
				filename,
				image: {
					type: 'png',
					quality: 0.95
				},
				html2canvas: {
					scale: 2,
					useCORS: true,
					logging: false,
					backgroundColor: '#ffffff',
					windowWidth: Math.max(element.scrollWidth, 1200),
					windowHeight: Math.max(element.scrollHeight, 1000),
					width: element.scrollWidth,
					height: element.scrollHeight,
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
					before: ['.page-break-before', '.section'],
					after: ['.page-break-after'],
					avoid: ['.no-break', '.avoid-break']
				}
			};

			// Merge with user options
			const mergedOptions = {
				...defaultOptions,
				...options?.html2pdfOptions,
				html2canvas: {
					...defaultOptions.html2canvas,
					...options?.html2pdfOptions?.html2canvas
				},
				jsPDF: {
					...defaultOptions.jsPDF,
					...options?.html2pdfOptions?.jsPDF
				},
				pagebreak: {
					...defaultOptions.pagebreak,
					...options?.html2pdfOptions?.pagebreak
				}
			};

			// Dynamically import html2pdf.js (browser only)
			const { default: html2pdf } = await import('html2pdf.js');
			
			// Generate PDF using html2pdf.js
			await html2pdf()
				.from(element)
				.set(mergedOptions)
				.save();

		} finally {
			// Remove print styles
			document.body.classList.remove('preparing-pdf');
			
			// Execute after capture callback if provided
			if (options?.afterCapture) {
				await options.afterCapture();
			}
		}
	}

	async captureElementAsBlob(
		elementSelector: string,
		options?: {
			beforeCapture?: () => void | Promise<void>;
			afterCapture?: () => void | Promise<void>;
			html2pdfOptions?: Html2PdfOptions;
		}
	): Promise<Blob> {
		const element = document.querySelector(elementSelector) as HTMLElement;
		if (!element) {
			throw new Error(`Element with selector "${elementSelector}" not found`);
		}

		// Execute before capture callback if provided
		if (options?.beforeCapture) {
			await options.beforeCapture();
		}

		try {
			// Wait for fonts to load
			await document.fonts.ready;
			
			// Add print styles temporarily
			const printClass = 'preparing-pdf';
			document.body.classList.add(printClass);
			
			// Wait for styles and fonts to fully apply
			await new Promise(resolve => setTimeout(resolve, 500));
			
			// Force a reflow to ensure styles are applied
			element.offsetHeight;

			// Default options optimized for resume generation
			const defaultOptions: Html2PdfOptions = {
				margin: 10,
				image: {
					type: 'png',
					quality: 0.95
				},
				html2canvas: {
					scale: 2,
					useCORS: true,
					logging: false,
					backgroundColor: '#ffffff',
					windowWidth: Math.max(element.scrollWidth, 1200),
					windowHeight: Math.max(element.scrollHeight, 1000),
					width: element.scrollWidth,
					height: element.scrollHeight,
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
					before: ['.page-break-before', '.section'],
					after: ['.page-break-after'],
					avoid: ['.no-break', '.avoid-break']
				}
			};

			// Merge with user options
			const mergedOptions = {
				...defaultOptions,
				...options?.html2pdfOptions,
				html2canvas: {
					...defaultOptions.html2canvas,
					...options?.html2pdfOptions?.html2canvas
				},
				jsPDF: {
					...defaultOptions.jsPDF,
					...options?.html2pdfOptions?.jsPDF
				},
				pagebreak: {
					...defaultOptions.pagebreak,
					...options?.html2pdfOptions?.pagebreak
				}
			};

			// Dynamically import html2pdf.js (browser only)
			const { default: html2pdf } = await import('html2pdf.js');
			
			// Generate PDF and return as blob
			const pdfBlob = await html2pdf()
				.from(element)
				.set(mergedOptions)
				.outputPdf('blob');

			return pdfBlob;

		} finally {
			// Remove print styles
			document.body.classList.remove('preparing-pdf');
			
			// Execute after capture callback if provided
			if (options?.afterCapture) {
				await options.afterCapture();
			}
		}
	}
}

// Export singleton instance
export const html2PdfService = new Html2PdfService();