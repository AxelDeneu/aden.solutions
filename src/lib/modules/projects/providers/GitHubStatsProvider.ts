import type { IStatsProvider, GitHubStats } from '../interfaces/IStatsProvider';

export class GitHubStatsProvider implements IStatsProvider {
	private cache: Map<string, GitHubStats> = new Map();
	private cacheTimeout = 3600000; // 1 hour

	async getStats(repoUrl: string): Promise<GitHubStats | null> {
		// Extract owner and repo from URL
		const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
		if (!match) return null;

		const [, owner, repo] = match;
		const cacheKey = `${owner}/${repo}`;

		// Check cache
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey)!;
		}

		try {
			// In production, this would use the GitHub API
			// For now, return mock data
			const mockStats: GitHubStats = {
				stars: Math.floor(Math.random() * 1000),
				forks: Math.floor(Math.random() * 100),
				watchers: Math.floor(Math.random() * 50),
				openIssues: Math.floor(Math.random() * 20),
				language: 'TypeScript',
				topics: ['web', 'svelte', 'typescript'],
				lastUpdate: new Date().toISOString()
			};

			this.cache.set(cacheKey, mockStats);

			// Clear cache after timeout
			setTimeout(() => {
				this.cache.delete(cacheKey);
			}, this.cacheTimeout);

			return mockStats;
		} catch (error) {
			console.error(`Error fetching GitHub stats for ${repoUrl}:`, error);
			return null;
		}
	}

	async getBulkStats(repoUrls: string[]): Promise<Map<string, GitHubStats>> {
		const results = new Map<string, GitHubStats>();

		// In production, use Promise.all for parallel fetching
		for (const url of repoUrls) {
			const stats = await this.getStats(url);
			if (stats) {
				results.set(url, stats);
			}
		}

		return results;
	}
}
