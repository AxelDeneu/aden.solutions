<script lang="ts">
	import { onMount } from 'svelte';
	import type { SkillVisualizationData } from '../types/SkillMetrics';
	import {
		Chart,
		RadialLinearScale,
		PointElement,
		LineElement,
		Filler,
		Tooltip,
		Legend
	} from 'chart.js';

	// Register Chart.js components
	Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

	interface Props {
		data: SkillVisualizationData;
		title?: string;
	}

	let { data, title = 'Skills Overview' }: Props = $props();

	let canvas: HTMLCanvasElement = $state();
	let chart: Chart;

	onMount(() => {
		createChart();
		return () => chart?.destroy();
	});

	function createChart() {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Prepare data for radar chart
		const labels = data.categories.flatMap((category) =>
			category.skills.map((skill) => skill.name)
		);

		const skillLevels = data.categories.flatMap((category) =>
			category.skills.map((skill) => skill.level)
		);

		const colors = [
			'rgba(59, 130, 246, 0.2)', // blue
			'rgba(16, 185, 129, 0.2)', // green
			'rgba(245, 158, 11, 0.2)', // yellow
			'rgba(239, 68, 68, 0.2)', // red
			'rgba(139, 92, 246, 0.2)' // purple
		];

		const borderColors = [
			'rgb(59, 130, 246)',
			'rgb(16, 185, 129)',
			'rgb(245, 158, 11)',
			'rgb(239, 68, 68)',
			'rgb(139, 92, 246)'
		];

		chart = new Chart(ctx, {
			type: 'radar',
			data: {
				labels,
				datasets: [
					{
						label: 'Skill Level',
						data: skillLevels,
						backgroundColor: colors[0],
						borderColor: borderColors[0],
						borderWidth: 2,
						pointBackgroundColor: borderColors[0],
						pointBorderColor: '#fff',
						pointHoverBackgroundColor: '#fff',
						pointHoverBorderColor: borderColors[0]
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					title: {
						display: true,
						text: title,
						font: {
							size: 16,
							weight: 'bold'
						}
					},
					legend: {
						display: false
					},
					tooltip: {
						callbacks: {
							label: function (context) {
								return `${context.label}: ${context.parsed.r}%`;
							}
						}
					}
				},
				scales: {
					r: {
						beginAtZero: true,
						max: 100,
						ticks: {
							stepSize: 20,
							callback: function (value) {
								return value + '%';
							}
						},
						grid: {
							color: 'rgba(0, 0, 0, 0.1)'
						},
						angleLines: {
							color: 'rgba(0, 0, 0, 0.1)'
						}
					}
				}
			}
		});
	}
</script>

<div class="skill-radar-chart">
	<canvas bind:this={canvas} width="400" height="400"></canvas>
</div>

<style>
	.skill-radar-chart {
		width: 100%;
		height: 400px;
		position: relative;
	}
</style>
