<script lang="ts">
	import type { SkillCategory } from '../types/SkillMetrics';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	interface Props {
		categories: SkillCategory[];
		title?: string;
	}

	let { categories, title = 'Skills Breakdown' }: Props = $props();

	function getSkillColor(level: number): string {
		if (level >= 90) return 'bg-green-500';
		if (level >= 75) return 'bg-blue-500';
		if (level >= 60) return 'bg-yellow-500';
		if (level >= 40) return 'bg-orange-500';
		return 'bg-red-500';
	}

	function getSkillLevel(level: number): string {
		if (level >= 90) return 'Expert';
		if (level >= 75) return 'Advanced';
		if (level >= 60) return 'Intermediate';
		if (level >= 40) return 'Basic';
		return 'Beginner';
	}
</script>

<Card>
	<CardHeader>
		<CardTitle>{title}</CardTitle>
	</CardHeader>
	<CardContent class="space-y-6">
		{#each categories as category}
			<div class="space-y-3">
				<h3 class="flex items-center gap-2 text-lg font-semibold">
					{category.name}
					<Badge variant="outline" class="text-xs">
						{category.skills.length} skills
					</Badge>
				</h3>

				<div class="space-y-3">
					{#each category.skills as skill}
						<div class="space-y-1">
							<div class="flex items-center justify-between text-sm">
								<span class="font-medium">{skill.name}</span>
								<div class="flex items-center gap-2">
									<Badge variant="secondary" class="text-xs">
										{getSkillLevel(skill.level)}
									</Badge>
									<span class="text-muted-foreground">{skill.level}%</span>
								</div>
							</div>

							<div class="h-2 w-full rounded-full bg-muted">
								<div
									class="h-2 rounded-full transition-all duration-500 {getSkillColor(skill.level)}"
									style="width: {skill.level}%"
								></div>
							</div>

							{#if skill.yearsOfExperience || skill.lastUsed}
								<div class="flex items-center gap-4 text-xs text-muted-foreground">
									{#if skill.yearsOfExperience}
										<span>{skill.yearsOfExperience} years experience</span>
									{/if}
									{#if skill.lastUsed}
										<span>Last used: {skill.lastUsed}</span>
									{/if}
									{#if skill.projects}
										<span>{skill.projects} projects</span>
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</CardContent>
</Card>
