import type { ResumeValue } from '$lib/types/ResumeValue';

interface Customers extends ResumeValue {
	label: string;
	items: string[];
}

export type { Customers };
