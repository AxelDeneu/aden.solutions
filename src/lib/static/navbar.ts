import type { Navbar } from '$lib/types';

import { HomeIcon, BookOpen, FolderOpen, FileText } from '@lucide/svelte';

const navbar: Navbar = {
	items: [
		{ href: '/', icon: HomeIcon, label: 'Home' },
		// { href: '/blog', icon: BookOpen, label: 'Blog' },
		{ href: '/projects', icon: FolderOpen, label: 'Projects' },
		{ href: '/resume', icon: FileText, label: 'Resume' }
	]
};

export default navbar;
