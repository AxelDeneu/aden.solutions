import { get, writable } from 'svelte/store';
import { getText } from '../i18n';
import { locale } from 'svelte-i18n';
import { Github, HomeIcon } from 'lucide-svelte';
import GithubSvg from '../imgs/github.svg';
import GithubDarkSvg from '../imgs/github-dark.svg';
import GamecashImg from '../imgs/gamecash.png';
import GmailSvg from '../imgs/gmail.svg';
import GmailDarkSvg from '../imgs/gmail-dark.svg';
import ImieImg from '../imgs/imie.png';
import LinkedinSvg from '../imgs/linkedin.svg';
import LinkedinDarkSvg from '../imgs/linkedin-dark.svg';
import ModoImg from '../imgs/modo.png';
import MyLittleTripImg from '../imgs/mylittletrip.png';
import TandenDashImg from '../imgs/tanden-dash.png';
import PhpipImg from '../imgs/phpip.png';
import TouchardWashingtonImg from '../imgs/touchard-washington.png';
const createResumeStore = () => {
	const { subscribe, set } = writable({});

	const toLocaleString = (date: Date) => {
		const currentLocale = get(locale) || 'fr-FR';

		// Validate the locale
		const validLocales = ['en-US', 'fr-FR']; // Add other valid locales as needed
		const localeToUse = validLocales.includes(currentLocale) ? currentLocale : 'fr-FR';

		console.log("localeToUse", localeToUse);

		return date.toLocaleString(localeToUse, {
			month: 'short',
			year: 'numeric',
		});
	}

	const updateResume = () => {
		set({
			name: 'Axel Deneu',
			email: 'hello@aden.solutions',
			initials: 'AD',
			url: 'https://github.com/AxelDeneu',
			img: 'https://avatars.githubusercontent.com/u/22771331?v=4',
			location: 'Montval-sur-Loir, France',
			locationLink: 'https://www.google.com/maps/place/montval-sur-loir',
			greetings: getText('Greetings'),
			about: getText('About'),
			description: getText('Description'),
			summary: getText('Summary'),
			workExperience: getText('Work Experience'),
			avatarUrl: 'https://avatars.githubusercontent.com/u/22771331?v=4',
			skills: [
				'PHP',
				'Laravel',
				'Inertia.js',
				'Symfony',
				// 'Typescript',
				'Node.js',
				'Svelte',
				'Sveltekit',
				'Vue.js',
				'React',
				// 'Python',
				// 'Go',
				'TailwindCSS',
				'SASS',
				'LESS',
				'Postgres',
				'MySQL',
				'Docker',
				// 'Kubernetes',
				// 'Java',
				// 'C++'
			],
			navbar: [
				{ href: '/', icon: HomeIcon, label: getText('Home') },
				// { href: '/blog', icon: NotebookIcon, label: getText('Blog') },
				// { href: '#', icon: CodeIcon, label: getText('Projects') }
			],
			contact: {
				email: 'hello@aden.solutions',
				tel: '+33 6 35 41 49 64',
				social: {
					GitHub: {
						name: 'GitHub',
						url: 'https://github.com/AxelDeneu',
						// // icon: Icons.github,
						icon: GithubSvg,
						navbar: true,
						dark_icon: GithubDarkSvg
					},
					LinkedIn: {
						name: 'LinkedIn',
						url: 'https://www.linkedin.com/in/adeneu/',
						// // icon: Icons.linkedin,
						icon: LinkedinSvg,
						navbar: true,
						dark_icon: LinkedinDarkSvg
					},
					email: {
						name: 'Send Email',
						url: 'mailto:hello@aden.solutions',
						// // icon: Icons.email,
						icon: GmailSvg,
						navbar: false,
						dark_icon: GmailDarkSvg
					}
				}
			},
			work: [
				{
					company: 'MyLittleTrip',
					href: 'https://mylittletrip.io',
					badges: [],
					location: getText('Full Remote'),
					title: getText('Lead Web Developer'),
					logoUrl: MyLittleTripImg,
					start: toLocaleString(new Date('2022-11-02')),
					end: toLocaleString(new Date('2024-10-09')),
					description:
						getText('MyLittleTrip Description')
				},
				{
					company: 'MŌDO',
					badges: [],
					href: 'https://agence-modo.fr/',
					location: 'Le Mans, France',
					title: getText('Lead Web Developer'),
					logoUrl: ModoImg,
					start: toLocaleString(new Date('2020-10-01')),
					end: toLocaleString(new Date('2022-11-02')),
					description:
						getText('Modo Lead Description'),
					technologies: ['PHP', 'WordPress', 'Laravel', 'Elementor', 'MySQL', 'Vue.JS', 'jQuery']
				},
				{
					company: 'MŌDO',
					href: 'https://agence-modo.fr/',
					badges: [],
					location: 'Le Mans, France',
					title: getText('Web Developer'),
					logoUrl: ModoImg,
					start: toLocaleString(new Date('2019-04-01')),
					end: toLocaleString(new Date('2020-10-01')),
					description:
						getText('Modo Description'),
					technologies: ['PHP', 'WordPress', 'Laravel', 'Elementor', 'MySQL', 'Vue.JS', 'jQuery']
				},
				{
					company: 'Gamecash',
					href: 'https://www.gamecash.fr/',
					badges: [],
					location: 'Angers, France',
					title: getText('Web Developer'),
					logoUrl: GamecashImg,
					start: toLocaleString(new Date('2017-08-01')),
					end: toLocaleString(new Date('2019-04-01')),
					description:
						getText('Gamecash Description'),
					technologies: ['PHP', getText('Custom MVC Framework'), 'MySQL', 'LESS', 'jQuery']
				}
			],
			educationLabel: getText('Education'),
			education: [
				{
					school: 'IMIE',
					// href: 'https://buildspace.so',
					degree: getText('IMIE Degree'),
					logoUrl: ImieImg,
					start: '2017',
					end: '2018'
				},
				{
					school: 'LPO Touchard-Washington',
					href: 'https://www.touchard-washington.fr/',
					degree: getText('BTS Degree'),
					logoUrl: TouchardWashingtonImg,
					start: '2015',
					end: '2017'
				},
				{
					school: 'LPO Touchard-Washington',
					href: 'https://www.touchard-washington.fr/',
					degree: getText('A Level Degree'),
					logoUrl: TouchardWashingtonImg,
					start: '2013',
					end: '2015'
				}
			],
			projectsSupLabel: getText('My Projects'),
			projectsLabel: getText('Check out my latest work'),
			projectsDescription: getText('I\'m an active open-source contributor and have worked on a variety of projects. Here are a few of my favorites.'),
			projects: [
				{
					title: 'Tanden Dash',
					href: 'https://github.com/AxelDeneu/tanden-dash',
					dates: getText('July 2024 - Present'),
					active: true,
					description:
						getText('Personal dashboard for home use. Displaying weather, calendar, tasks, and more. Made to be used on a big touch screen.'),
					technologies: [
						'SvelteKit',
						'Prisma',
						'SQLite',
						'TailwindCSS',
						'Shadcn UI',
					],
					links: [
						{
							type: 'Source',
							href: 'https://github.com/AxelDeneu/tanden-dash',
							icon: Github
						}
					],
					image: TandenDashImg,
					video: ''
				},
				{
					title: 'phpIP',
					href: 'https://github.com/jjdejong/phpip',
					dates: getText('September 2024 - Present'),
					active: true,
					description: getText('A simple IP management tool written in PHP. Not my project, but I am part of the maintainers.'),
					technologies: [
						'Laravel',
						'PHP',
						'Bootstrap'
					],
					links: [
						{
							type: 'Source',
							href: 'https://github.com/jjdejong/phpip',
							icon: Github
							// icon: <Icons.github className="size-3" />,
						}
					],
					image: PhpipImg
				}
			],
			contactLabel: getText('Get in Touch'),
			contactDescription: getText('I am always open to new opportunities and collaborations. Feel free to reach out to me via email at')
		});
	};

	locale.subscribe(() => {
		if (typeof window !== 'undefined') updateResume(); // Vérifie si on est côté client
	});

	return {
		subscribe,
		updateResume
	};
};

export const resumeStore = createResumeStore();