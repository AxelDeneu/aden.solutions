import type { ISearchProvider, SearchResult } from '../interfaces/ISearchProvider';
import type { EnhancedProject } from '../types/EnhancedProject';
import Fuse, { type IFuseOptions } from 'fuse.js';

export class FuseSearchProvider implements ISearchProvider {
	private options: IFuseOptions<EnhancedProject> = {
		keys: [
			{ name: 'title', weight: 0.4 },
			{ name: 'description', weight: 0.3 },
			{ name: 'technologies', weight: 0.2 },
			{ name: 'category', weight: 0.1 }
		],
		threshold: 0.4,
		includeScore: true,
		minMatchCharLength: 2
	};

	search(projects: EnhancedProject[], query: string): SearchResult[] {
		if (!query || query.trim().length === 0) {
			return projects.map((item) => ({ item, score: 0 }));
		}

		const fuse = new Fuse(projects, this.options);
		const results = fuse.search(query);

		return results.map((result) => ({
			item: result.item,
			score: result.score || 0
		}));
	}

	configure(options: Partial<IFuseOptions<EnhancedProject>>): void {
		this.options = { ...this.options, ...options };
	}
}
