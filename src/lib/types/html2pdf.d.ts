declare module 'html2pdf.js' {
	export interface Html2PdfOptions {
		margin?: number | [number, number, number, number];
		filename?: string;
		image?: {
			type?: 'jpeg' | 'png' | 'webp';
			quality?: number;
		};
		html2canvas?: {
			scale?: number;
			logging?: boolean;
			letterRendering?: boolean;
			useCORS?: boolean;
			[key: string]: any;
		};
		jsPDF?: {
			unit?: 'pt' | 'mm' | 'cm' | 'in';
			format?: string | [number, number];
			orientation?: 'portrait' | 'landscape';
			[key: string]: any;
		};
		pagebreak?: {
			mode?: string | string[];
			before?: string | string[];
			after?: string | string[];
			avoid?: string | string[];
		};
		[key: string]: any;
	}

	interface Html2Pdf {
		from(element: HTMLElement | string): Html2Pdf;
		set(options: Html2PdfOptions): Html2Pdf;
		save(filename?: string): Promise<void>;
		toPdf(): Html2Pdf;
		get(type: 'pdf' | 'canvas' | 'img'): Promise<any>;
		then(callback: (value: any) => void): Html2Pdf;
		catch(callback: (error: any) => void): Html2Pdf;
		outputPdf(type?: 'arraybuffer' | 'blob' | 'bloburi' | 'datauristring'): Promise<any>;
	}

	const html2pdf: {
		(): Html2Pdf;
		(element: HTMLElement | string, options?: Html2PdfOptions): Promise<void>;
	};

	export default html2pdf;
}