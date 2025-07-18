import type { IMarkdownProcessor, ProcessedMarkdown } from '../interfaces/IMarkdownProcessor';
import type { BlogPostMetadata, LocalizedSlug } from '../types/BlogPost';

export class MdxProcessor implements IMarkdownProcessor {
	private readonly wordsPerMinute = 200;

	async process(content: string, slug: string): Promise<ProcessedMarkdown> {
		const metadata = this.extractMetadata(content);
		// Only use the filename slug if no slug is defined in frontmatter
		if (!metadata.slug) {
			metadata.slug = slug;
		}

		// Remove frontmatter from content
		const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---\n*/m, '');

		let processedContent: string;

		// Check if we're running server-side (Node.js environment)
		if (this.isServerSide()) {
			try {
				// Use a simple markdown-to-HTML processor instead of mdsvex for now
				// since mdsvex returns Svelte component code, not HTML
				processedContent = this.markdownToHtml(contentWithoutFrontmatter);
			} catch (error) {
				console.error(`Error processing markdown for ${slug}:`, error);
				processedContent = contentWithoutFrontmatter;
			}
		} else {
			// Client-side: return raw markdown (used only for metadata extraction in blog listing)
			processedContent = contentWithoutFrontmatter;
		}

		const readingTime = this.calculateReadingTime(contentWithoutFrontmatter);
		const excerpt = this.generateExcerpt(contentWithoutFrontmatter);

		return {
			metadata: {
				...metadata,
				readingTime
			},
			content: processedContent,
			excerpt,
			readingTime
		};
	}

	private isServerSide(): boolean {
		return (
			typeof process !== 'undefined' &&
			process.versions &&
			typeof process.versions.node === 'string' &&
			typeof window === 'undefined'
		);
	}

	private markdownToHtml(markdown: string): string {
		// Split content into blocks (separated by double newlines)
		const blocks = markdown.split('\n\n').filter((block) => block.trim() !== '');
		const htmlBlocks: string[] = [];

		for (let block of blocks) {
			block = block.trim();

			// Skip empty blocks
			if (!block) continue;

			// Code blocks
			if (block.startsWith('```')) {
				const lines = block.split('\n');
				const langMatch = lines[0].match(/```(\w+)?/);
				const language = langMatch ? langMatch[1] || 'text' : 'text';
				const code = lines.slice(1, -1).join('\n');
				htmlBlocks.push(
					`<pre><code class="language-${language}">${this.escapeHtml(code)}</code></pre>`
				);
				continue;
			}

			// Headers - check from highest level to lowest to avoid conflicts
			if (block.startsWith('###### ')) {
				htmlBlocks.push(`<h6>${this.processInlineMarkdown(block.substring(7))}</h6>`);
				continue;
			}
			if (block.startsWith('##### ')) {
				htmlBlocks.push(`<h5>${this.processInlineMarkdown(block.substring(6))}</h5>`);
				continue;
			}
			if (block.startsWith('#### ')) {
				htmlBlocks.push(`<h4>${this.processInlineMarkdown(block.substring(5))}</h4>`);
				continue;
			}
			if (block.startsWith('### ')) {
				htmlBlocks.push(`<h3>${this.processInlineMarkdown(block.substring(4))}</h3>`);
				continue;
			}
			if (block.startsWith('## ')) {
				htmlBlocks.push(`<h2>${this.processInlineMarkdown(block.substring(3))}</h2>`);
				continue;
			}
			if (block.startsWith('# ')) {
				htmlBlocks.push(`<h1>${this.processInlineMarkdown(block.substring(2))}</h1>`);
				continue;
			}

			// Lists
			if (block.includes('\n- ') || block.startsWith('- ')) {
				const listItems = block
					.split('\n')
					.filter((line) => line.trim().startsWith('- '))
					.map((line) => `<li>${this.processInlineMarkdown(line.substring(2).trim())}</li>`)
					.join('');
				htmlBlocks.push(`<ul>${listItems}</ul>`);
				continue;
			}

			// Regular paragraphs
			const processedBlock = this.processInlineMarkdown(block);
			if (processedBlock) {
				htmlBlocks.push(`<p>${processedBlock}</p>`);
			}
		}

		return htmlBlocks.join('\n\n');
	}

	private processInlineMarkdown(text: string): string {
		let processed = text;

		// Bold
		processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

		// Italic
		processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');

		// Inline code
		processed = processed.replace(/`([^`]+)`/g, '<code>$1</code>');

		// Links
		processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

		// Line breaks within paragraphs
		processed = processed.replace(/\n/g, '<br>');

		return processed;
	}

	private escapeHtml(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	extractMetadata(content: string): BlogPostMetadata {
		const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
		const match = content.match(frontmatterRegex);

		if (!match) {
			throw new Error('No frontmatter found in markdown file');
		}

		const frontmatter = match[1];
		const metadata: Partial<BlogPostMetadata> = {};

		// Parse YAML-like frontmatter manually
		const lines = frontmatter.split('\n');
		let currentKey = '';
		let inArray = false;
		let inObject = false;
		let arrayValues: string[] = [];
		let objectValues: { [key: string]: string } = {};

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const trimmed = line.trim();

			if (trimmed.startsWith('- ') && inArray) {
				// Array item
				arrayValues.push(trimmed.substring(2).trim());
			} else if (trimmed.includes(': ') && inObject) {
				// Object property (e.g., "en: english-slug")
				const [key, ...valueParts] = trimmed.split(': ');
				const value = valueParts.join(': ').trim();
				objectValues[key.trim()] = this.parseValue(value) as string;
			} else if (line.includes(':')) {
				// Save previous array or object if exists
				if (inArray && currentKey) {
					(metadata as any)[currentKey] = arrayValues;
					arrayValues = [];
					inArray = false;
				}
				if (inObject && currentKey) {
					(metadata as any)[currentKey] = objectValues;
					objectValues = {};
					inObject = false;
				}

				// New key-value pair
				const [key, ...valueParts] = line.split(':');
				currentKey = key.trim();
				const value = valueParts.join(':').trim();

				if (value) {
					// Single value
					(metadata as any)[currentKey] = this.parseValue(value);
				} else {
					// Might be start of array or object
					// Check next line to determine
					if (i + 1 < lines.length) {
						const nextLine = lines[i + 1].trim();
						if (nextLine.startsWith('- ')) {
							inArray = true;
						} else if (nextLine.includes(': ') && !nextLine.startsWith('- ')) {
							inObject = true;
						}
					}
				}
			}
		}

		// Save last array or object if exists
		if (inArray && currentKey) {
			(metadata as any)[currentKey] = arrayValues;
		}
		if (inObject && currentKey) {
			(metadata as any)[currentKey] = objectValues;
		}

		// Validate required fields
		if (!metadata.title || !metadata.description || !metadata.date) {
			throw new Error('Missing required metadata fields: title, description, or date');
		}

		return {
			title: metadata.title as string,
			description: metadata.description as string,
			date: metadata.date as string,
			published: metadata.published !== false,
			categories: (metadata.categories as string[]) || [],
			author: metadata.author as string | undefined,
			coverImage: metadata.coverImage as string | undefined,
			coverImageAlt: metadata.coverImageAlt as string | undefined,
			slug: metadata.slug as LocalizedSlug | undefined
		};
	}

	generateExcerpt(content: string, length: number = 160): string {
		// Remove code blocks
		const withoutCode = content.replace(/```[\s\S]*?```/g, '');

		// Remove inline code
		const withoutInlineCode = withoutCode.replace(/`[^`]+`/g, '');

		// Remove markdown syntax
		const plainText = withoutInlineCode
			.replace(/#{1,6}\s+/g, '') // Headers
			.replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
			.replace(/\*([^*]+)\*/g, '$1') // Italic
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
			.replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Images
			.replace(/^\s*[-*+]\s+/gm, '') // Lists
			.replace(/^\s*\d+\.\s+/gm, '') // Numbered lists
			.replace(/\n{2,}/g, ' ') // Multiple newlines
			.replace(/\n/g, ' ') // Single newlines
			.trim();

		if (plainText.length <= length) {
			return plainText;
		}

		// Cut at word boundary
		const truncated = plainText.substring(0, length);
		const lastSpace = truncated.lastIndexOf(' ');

		return truncated.substring(0, lastSpace) + '...';
	}

	calculateReadingTime(content: string): number {
		// Remove code blocks for more accurate reading time
		const withoutCode = content.replace(/```[\s\S]*?```/g, '');

		// Count words
		const words = withoutCode.trim().split(/\s+/).length;

		// Calculate minutes
		const minutes = Math.ceil(words / this.wordsPerMinute);

		return minutes;
	}

	private parseValue(value: string): string | boolean {
		const trimmed = value.trim();

		// Remove quotes if present
		if (
			(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
			(trimmed.startsWith("'") && trimmed.endsWith("'"))
		) {
			return trimmed.slice(1, -1);
		}

		// Parse boolean
		if (trimmed === 'true') return true;
		if (trimmed === 'false') return false;

		return trimmed;
	}
}
