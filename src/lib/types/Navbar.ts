import type { ResumeValue } from '$lib/types';
import { HomeIcon } from '@lucide/svelte';

interface NavbarItem {
	href: string;
	icon: typeof HomeIcon;
	label: string;
}
interface Navbar extends ResumeValue {
	items: NavbarItem[];
}

export type { Navbar, NavbarItem };
