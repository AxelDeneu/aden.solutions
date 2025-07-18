import type { Education } from '$lib/types';

import ImieImg from '$lib/imgs/imie.png';
import TouchardWashingtonImg from '$lib/imgs/touchard-washington.png';

const education: Education = {
	label: 'Education',
	items: [
		{
			school: 'IMIE',
			// href: 'https://buildspace.so',
			degree: 'IMIE Degree',
			logoUrl: ImieImg,
			start: '2017',
			end: '2018'
		},
		{
			school: 'LPO Touchard-Washington',
			href: 'https://www.touchard-washington.fr/',
			degree: 'BTS Degree',
			logoUrl: TouchardWashingtonImg,
			start: '2015',
			end: '2017'
		},
		{
			school: 'LPO Touchard-Washington',
			href: 'https://www.touchard-washington.fr/',
			degree: 'A Level Degree',
			logoUrl: TouchardWashingtonImg,
			start: '2013',
			end: '2015'
		}
	]
};

export default education;
