import type { WorkExperience } from '$lib/types';

import type { Readable } from 'svelte/store';
import { derived } from 'svelte/store';
import { locale } from 'svelte-i18n';
import { getText } from '$lib/i18n';
import MyLittleTripImg from '$lib/imgs/mylittletrip.png';
import ModoImg from '$lib/imgs/modo.png';
import GamecashImg from '$lib/imgs/gamecash.png';
import { createDateFormatter } from '$lib/utils';

const workExperience: Readable<WorkExperience> = derived(locale, ($locale) => {
	const formatDate = createDateFormatter($locale || 'en-US');

	return {
		label: getText('Work Experience'),
		items: [
			{
				company: 'MyLittleTrip',
				href: 'https://mylittletrip.io',
				badges: [],
				location: getText('Full Remote'),
				title: getText('Lead Web Developer'),
				logoUrl: MyLittleTripImg,
				start: formatDate(new Date('2022-11-02')),
				end: formatDate(new Date('2024-10-09')),
				startDate: new Date('2022-11-02'),
				endDate: new Date('2024-10-09'),
				description: getText('MyLittleTrip Description'),
				technologies: ['Tailwind', 'Alpine.js', 'Laravel', 'Livewire', 'MySQL', 'Vue.JS', 'SASS']
			},
			{
				company: 'MŌDO',
				badges: [],
				href: 'https://agence-modo.fr/',
				location: 'Le Mans, France',
				title: getText('Lead Web Developer'),
				logoUrl: ModoImg,
				start: formatDate(new Date('2020-10-01')),
				end: formatDate(new Date('2022-11-02')),
				startDate: new Date('2020-10-01'),
				endDate: new Date('2022-11-02'),
				description: getText('Modo Lead Description'),
				technologies: ['PHP', 'WordPress', 'Laravel', 'Elementor', 'MySQL', 'Vue.JS', 'jQuery']
			},
			{
				company: 'MŌDO',
				href: 'https://agence-modo.fr/',
				badges: [],
				location: 'Le Mans, France',
				title: getText('Web Developer'),
				logoUrl: ModoImg,
				start: formatDate(new Date('2019-04-01')),
				end: formatDate(new Date('2020-10-01')),
				startDate: new Date('2019-04-01'),
				endDate: new Date('2020-10-01'),
				description: getText('Modo Description'),
				technologies: ['PHP', 'WordPress', 'Laravel', 'Elementor', 'MySQL', 'Vue.JS', 'jQuery']
			},
			{
				company: 'Gamecash',
				href: 'https://www.gamecash.fr/',
				badges: [],
				location: 'Angers, France',
				title: getText('Web Developer'),
				logoUrl: GamecashImg,
				start: formatDate(new Date('2017-08-01')),
				end: formatDate(new Date('2019-04-01')),
				startDate: new Date('2017-08-01'),
				endDate: new Date('2019-04-01'),
				description: getText('Gamecash Description'),
				technologies: ['PHP', getText('Custom MVC Framework') as string, 'MySQL', 'LESS', 'jQuery']
			}
		]
	};
});

export default workExperience;
