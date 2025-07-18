export interface GitHubStats {
	stars: number;
	forks: number;
	watchers: number;
	openIssues: number;
	language: string;
	topics: string[];
	lastUpdate: string;
	description?: string;
}

export interface IStatsProvider {
	getStats(repoUrl: string): Promise<GitHubStats | null>;
	getBulkStats(repoUrls: string[]): Promise<Map<string, GitHubStats>>;
}
