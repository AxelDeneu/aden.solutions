import type { Projects } from '$lib/types';
import type { Readable } from 'svelte/store';
import { derived } from 'svelte/store';
import { locale } from 'svelte-i18n';
import { getText } from '$lib/i18n';

import TandenDashImg from '../imgs/tanden-dash.png';
import PhpipImg from '../imgs/phpip.png';

const projects: Readable<Projects> = derived(locale, ($locale) => {
	const isEnglish = $locale === 'en-US' || !$locale || $locale === 'en';

	return {
		supLabel: getText('My Projects') as string,
		label: getText('Check out my latest work') as string,
		description: getText(
			"I'm an active open-source contributor and have worked on a variety of projects. Here are a few of my favorites."
		) as string,
		items: [
			{
				title: 'Tanden Dash',
				href: 'https://github.com/AxelDeneu/tanden-dash',
				dates: isEnglish ? 'July 2024 - Present' : 'Juillet 2024 - Présent',
				active: true,
				featured: true,
				description: isEnglish
					? 'Personal dashboard for home use. Displaying weather, calendar, tasks, and more. Made to be used on a big touch screen.'
					: 'Tableau de bord personnel pour usage domestique. Affichage de la météo, du calendrier, des tâches, et plus encore. Conçu pour être utilisé sur un grand écran tactile.',
				technologies: ['SvelteKit', 'Prisma', 'SQLite', 'TailwindCSS', 'Shadcn UI'],
				links: [
					{
						type: 'projects.link.source',
						href: 'https://github.com/AxelDeneu/tanden-dash',
						icon: 'Github'
					}
				],
				image: TandenDashImg
			},
			{
				title: 'phpIP',
				href: 'https://github.com/jjdejong/phpip',
				dates: isEnglish ? 'September 2024 - Present' : 'Septembre 2024 - Présent',
				active: true,
				description: isEnglish
					? 'A simple IP management tool written in PHP. Not my project, but I am part of the maintainers.'
					: "Un outil de gestion d'IP simple écrit en PHP. Ce n'est pas mon projet, mais je fais partie des mainteneurs.",
				technologies: ['Laravel', 'PHP', 'Bootstrap'],
				links: [
					{
						type: 'projects.link.source',
						href: 'https://github.com/jjdejong/phpip',
						icon: 'Github'
					}
				],
				image: PhpipImg
			}
		]
	};
});

export default projects;
