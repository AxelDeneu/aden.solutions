import { get, writable } from 'svelte/store';
import { __ } from '../i18n';
import { waitLocale, locale } from 'svelte-i18n';
import { CodeIcon, Github, Globe, HomeIcon, NotebookIcon, Youtube } from 'lucide-svelte';
import BuildSpaceImg from '../imgs/buildspace.jpg';
import GithubSvg from '../imgs/github.svg';
import GithubDarkSvg from '../imgs/github-dark.svg';
import GamecashImg from '../imgs/gamecash.png';
import GmailSvg from '../imgs/gmail.svg';
import GmailDarkSvg from '../imgs/gmail-dark.svg';
import IBImg from '../imgs/ib.png';
import ImieImg from '../imgs/imie.png';
import LaurierImg from '../imgs/laurier.png';
import LimeSvg from '../imgs/lime.svg';
import LinkedinSvg from '../imgs/linkedin.svg';
import LinkedinDarkSvg from '../imgs/linkedin-dark.svg';
import MitreMediaImg from '../imgs/mitremedia.png';
import ModoImg from '../imgs/modo.png';
import MyLittleTripImg from '../imgs/mylittletrip.png';
import NvidiaImg from '../imgs/nvidia.png';
import PeerListSvg from '../imgs/peerlist.svg';
import PeerListDarkSvg from '../imgs/peerlist-dark.svg';
import ShopifySvg from '../imgs/shopify.svg';
import SplunkSvg from '../imgs/splunk.svg';
import TandenDashImg from '../imgs/tanden-dash.png';
import PhpipImg from '../imgs/phpip.png';
import TouchardWashingtonImg from '../imgs/touchard-washington.png';
import WaterLooImg from '../imgs/waterloo.png';
const createResumeStore = () => {
	const { subscribe, set } = writable({});

	const updateResume = async () => {
		await waitLocale();

		set({
			name: 'Axel Deneu',
			email: 'hello@aden.solutions',
			initials: 'AD',
			url: 'https://github.com/AxelDeneu',
			img: 'https://avatars.githubusercontent.com/u/22771331?v=4',
			location: 'Montval-sur-Loir, France',
			locationLink: 'https://www.google.com/maps/place/montval-sur-loir',
			greetings: __('Greetings'),
			about: __('About'),
			description: __('Description'),
			summary: __('Summary'),
			workExperience: __('Work Experience'),
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
				{ href: '/', icon: HomeIcon, label: __('Home') },
				// { href: '/blog', icon: NotebookIcon, label: __('Blog') },
				// { href: '#', icon: CodeIcon, label: __('Projects') }
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
					location: __('Full Remote'),
					title: __('Lead Web Developer'),
					logoUrl: MyLittleTripImg,
					start: (new Date('2022-11-02')).toLocaleString(get(locale), {
						month: 'short',
						year: 'numeric',
					}),
					end: (new Date('2024-10-09')).toLocaleString(get(locale), {
						month: 'long',
						year: 'numeric',
					}),
					description:
						__('MyLittleTrip Description')
				},
				{
					company: 'MŌDO',
					badges: [],
					href: 'https://agence-modo.fr/',
					location: 'Le Mans, France',
					title: __('Lead Web Developer'),
					logoUrl: ModoImg,
					start: (new Date('2020-10-01')).toLocaleString(get(locale), {
						month: 'short',
						year: 'numeric',
					}),
					end: (new Date('2022-11-02')).toLocaleString(get(locale), {
						month: 'short',
						year: 'numeric',
					}),
					description:
						__('Modo Lead Description'),
					technologies: ['PHP', 'WordPress', 'Laravel', 'Elementor', 'MySQL', 'Vue.JS', 'jQuery']
				},
				{
					company: 'MŌDO',
					href: 'https://agence-modo.fr/',
					badges: [],
					location: 'Le Mans, France',
					title: __('Web Developer'),
					logoUrl: ModoImg,
					start: (new Date('2019-04-01')).toLocaleString(get(locale), {
						month: 'short',
						year: 'numeric',
					}),
					end: (new Date('2020-10-01')).toLocaleString(get(locale), {
						month: 'short',
						year: 'numeric',
					}),
					description:
						__('Modo Description'),
					technologies: ['PHP', 'WordPress', 'Laravel', 'Elementor', 'MySQL', 'Vue.JS', 'jQuery']
				},
				{
					company: 'Gamecash',
					href: 'https://www.gamecash.fr/',
					badges: [],
					location: 'Angers, France',
					title: __('Web Developer'),
					logoUrl: GamecashImg,
					start: (new Date('2017-08-01')).toLocaleString(get(locale), {
						month: 'short',
						year: 'numeric',
					}),
					end: (new Date('2019-04-01')).toLocaleString(get(locale), {
						month: 'short',
						year: 'numeric',
					}),
					description:
						__('Gamecash Description'),
					technologies: ['PHP', __('Custom MVC Framework'), 'MySQL', 'LESS', 'jQuery']
				}
			],
			educationLabel: __('Education'),
			education: [
				{
					school: 'IMIE',
					// href: 'https://buildspace.so',
					degree: __('IMIE Degree'),
					logoUrl: ImieImg,
					start: '2017',
					end: '2018'
				},
				{
					school: 'LPO Touchard-Washington',
					href: 'https://www.touchard-washington.fr/',
					degree: __('BTS Degree'),
					logoUrl: TouchardWashingtonImg,
					start: '2015',
					end: '2017'
				},
				{
					school: 'LPO Touchard-Washington',
					href: 'https://www.touchard-washington.fr/',
					degree: __('A Level Degree'),
					logoUrl: TouchardWashingtonImg,
					start: '2013',
					end: '2015'
				}
			],
			projectsSupLabel: __('My Projects'),
			projectsLabel: __('Check out my latest work'),
			projectsDescription: __('I\'m an active open-source contributor and have worked on a variety of projects. Here are a few of my favorites.'),
			projects: [
				{
					title: 'Tanden Dash',
					href: 'https://github.com/AxelDeneu/tanden-dash',
					dates: __('July 2024 - Present'),
					active: true,
					description:
						__('Personal dashboard for home use. Displaying weather, calendar, tasks, and more. Made to be used on a big touch screen.'),
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
					dates: __('September 2024 - Present'),
					active: true,
					description: __('A simple IP management tool written in PHP. Not my project, but I am part of the maintainers.'),
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
			contactLabel: __('Get in Touch'),
			contactDescription: __('I am always open to new opportunities and collaborations. Feel free to reach out to me via email at')
		});
	};

	locale.subscribe(() => {
		updateResume();
	});

	return {
		subscribe,
		updateResume
	};
};

export const resumeStore = createResumeStore();