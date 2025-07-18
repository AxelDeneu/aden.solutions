<script lang="ts">
	import type { Resume } from '$lib/types';
	import { skillVisualizationService } from '$lib/modules/professional/SkillVisualizationService';
	import SkillRadarChart from '$lib/modules/professional/visualizations/SkillRadarChart.svelte';
	import SkillProgressBar from '$lib/modules/professional/visualizations/SkillProgressBar.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { TrendingUp, Award, Target } from '@lucide/svelte';
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import { BLUR_FADE_DELAY } from '$lib/static/consts';

	interface Props {
		resume: Resume;
	}

	let { resume }: Props = $props();

	let showVisualization: 'radar' | 'bars' | 'grid' = $state('grid');

	let skillData = $derived(skillVisualizationService.generateSkillData(resume));
	let topSkills = $derived(skillVisualizationService.getTopSkills(skillData, 5));
</script>

<section id="skills-enhanced" class="py-16">
	<div class="container">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">Skills</h2>
				<p class="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
					Comprehensive overview of my technical expertise and proficiency levels
				</p>

				<!-- View Toggle -->
				<div class="mb-8 flex justify-center gap-2">
					<Button
						variant={showVisualization === 'grid' ? 'default' : 'outline'}
						size="sm"
						on:lick={() => (showVisualization = 'grid')}
					>
						Grid View
					</Button>
					<Button
						variant={showVisualization === 'bars' ? 'default' : 'outline'}
						size="sm"
						onclick={() => (showVisualization = 'bars')}
					>
						Progress Bars
					</Button>
					<Button
						variant={showVisualization === 'radar' ? 'default' : 'outline'}
						size="sm"
						onclick={() => (showVisualization = 'radar')}
					>
						Radar Chart
					</Button>
				</div>
			</div>
		</BlurFade>

		<!-- Skills Overview Stats -->
		<BlurFade delay={BLUR_FADE_DELAY * 1.1}>
			<div class="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
				<Card>
					<CardContent class="pt-6">
						<div class="flex items-center space-x-2">
							<Target class="h-8 w-8 text-primary" />
							<div>
								<p class="text-2xl font-bold">{skillData.totalSkills}</p>
								<p class="text-xs text-muted-foreground">Total Skills</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent class="pt-6">
						<div class="flex items-center space-x-2">
							<TrendingUp class="h-8 w-8 text-green-500" />
							<div>
								<p class="text-2xl font-bold">{skillData.averageLevel}%</p>
								<p class="text-xs text-muted-foreground">Average Proficiency</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent class="pt-6">
						<div class="flex items-center space-x-2">
							<Award class="h-8 w-8 text-yellow-500" />
							<div>
								<p class="text-2xl font-bold">{skillData.categories.length}</p>
								<p class="text-xs text-muted-foreground">Categories</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</BlurFade>

		<!-- Top Skills Highlight -->
		<BlurFade delay={BLUR_FADE_DELAY * 1.2}>
			<Card class="mb-12">
				<CardHeader>
					<CardTitle class="flex items-center gap-2">
						<Award class="h-5 w-5" />
						Top Skills
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="flex flex-wrap gap-3">
						{#each topSkills as skill}
							<div class="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
								<span class="font-medium">{skill.name}</span>
								<Badge variant="secondary">{skill.level}%</Badge>
								<span class="text-xs text-muted-foreground">
									{skill.yearsOfExperience} years
								</span>
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>
		</BlurFade>

		<!-- Skills Visualization -->
		<BlurFade delay={BLUR_FADE_DELAY * 1.3}>
			{#if showVisualization === 'radar'}
				<Card class="mb-8">
					<CardContent class="pt-6">
						<SkillRadarChart data={skillData} title="Skills Radar" />
					</CardContent>
				</Card>
			{:else if showVisualization === 'bars'}
				<SkillProgressBar categories={skillData.categories} title="Skill Proficiency" />
			{:else}
				<!-- Grid View (Original) -->
				<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{#each skillData.categories as category, idx}
						<BlurFade delay={BLUR_FADE_DELAY * 1.4 + idx * 0.1}>
							<Card>
								<CardHeader>
									<CardTitle class="flex items-center justify-between">
										{category.name}
										<Badge variant="outline" class="text-xs">
											{skillVisualizationService.calculateCategoryAverage(category)}% avg
										</Badge>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div class="space-y-3">
										{#each category.skills as skill}
											<div class="space-y-1">
												<div class="flex items-center justify-between text-sm">
													<span class="font-medium">{skill.name}</span>
													<span class="text-muted-foreground">{skill.level}%</span>
												</div>
												<div class="h-2 w-full rounded-full bg-muted">
													<div
														class="h-2 rounded-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-700"
														style="width: {skill.level}%"
													></div>
												</div>
												<div class="flex items-center gap-2 text-xs text-muted-foreground">
													<span>{skill.yearsOfExperience} years</span>
													<span>•</span>
													<span>{skill.projects} projects</span>
													<span>•</span>
													<span>{skill.lastUsed}</span>
												</div>
											</div>
										{/each}
									</div>
								</CardContent>
							</Card>
						</BlurFade>
					{/each}
				</div>
			{/if}
		</BlurFade>

		<!-- Category Breakdown -->
		<BlurFade delay={BLUR_FADE_DELAY * 1.5}>
			<div class="mt-12">
				<Separator class="mb-8" />
				<h3 class="mb-6 text-center text-2xl font-bold">Skills by Category</h3>
				<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
					{#each skillData.categories as category}
						<Card class="text-center">
							<CardContent class="pt-6">
								<div class="mb-2 text-2xl font-bold" style="color: {category.color}">
									{skillVisualizationService.calculateCategoryAverage(category)}%
								</div>
								<p class="font-medium">{category.name}</p>
								<p class="text-xs text-muted-foreground">
									{category.skills.length} skills
								</p>
							</CardContent>
						</Card>
					{/each}
				</div>
			</div>
		</BlurFade>
	</div>
</section>
