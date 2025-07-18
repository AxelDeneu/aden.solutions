export interface LocaleDictionary {
	[key: string]: LocaleDictionary | string | Array<string | LocaleDictionary> | null;
}
