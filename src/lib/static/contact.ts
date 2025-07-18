import type { ContactMethods } from '$lib/types';

import GithubSvg from '$lib/imgs/github.svg';
import GithubDarkSvg from '$lib/imgs/github-dark.svg';
import LinkedinSvg from '$lib/imgs/linkedin.svg';
import LinkedinDarkSvg from '$lib/imgs/linkedin-dark.svg';
import MaltSvg from '$lib/imgs/malt.svg';
import MaltDarkSvg from '$lib/imgs/malt-dark.svg';
import GmailSvg from '$lib/imgs/gmail.svg';
import GmailDarkSvg from '$lib/imgs/gmail-dark.svg';

export default {
	label: 'Get in Touch',
	description:
		'I am always open to new opportunities and collaborations. Feel free to reach out to me via email at',
	methods: {
		email: 'hello@aden.solutions',
		tel: '+33 6 35 41 49 64',
		social: {
			GitHub: {
				name: 'GitHub',
				url: 'https://github.com/AxelDeneu',
				icon: GithubSvg,
				navbar: true,
				dark_icon: GithubDarkSvg
			},
			LinkedIn: {
				name: 'LinkedIn',
				url: 'https://www.linkedin.com/in/adeneu/',
				icon: LinkedinSvg,
				navbar: true,
				dark_icon: LinkedinDarkSvg
			},
			Malt: {
				name: 'Malt',
				url: 'https://www.malt.fr/profile/axeldeneu',
				icon: MaltSvg,
				navbar: true,
				dark_icon: MaltDarkSvg
			},
			email: {
				name: 'Send Email',
				url: 'mailto:hello@aden.solutions',
				icon: GmailSvg,
				navbar: false,
				dark_icon: GmailDarkSvg
			}
		}
	} as ContactMethods
};
