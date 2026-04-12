export type Locale = 'en' | 'pt';

export interface Translations {
	meta: {
		name: string;
		flag: string;
	};
	nav: {
		about: string;
		projects: string;
		blog: string;
		support: string;
		toggleMenu: string;
	};
	pages: {
		about: { title: string };
		projects: { title: string };
		blog: { title: string };
		support: { title: string };
	};
}
