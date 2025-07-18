import type { LocaleDictionary } from '$lib/types/LocalDictionary';

type TranslatedValue<T> = T extends string
	? LocaleDictionary | string
	: T extends Array<infer U>
		? Array<TranslatedValue<U>>
		: T extends object
			? { [K in keyof T]: TranslatedValue<T[K]> }
			: T;

export type { TranslatedValue };
