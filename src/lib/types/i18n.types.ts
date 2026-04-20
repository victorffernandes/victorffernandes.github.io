import type { ExperienceItem, EducationItem } from './portfolio.types';

export type Locale = 'en' | 'pt';

export interface Translations {
	nav: {
		about: string;
		projects: string;
		blog: string;
		experience: string;
		education: string;
		contact: string;
		toggleMenu: string;
	};
	pages: {
		about: { name: string; subtitle: string; role: string; title: string; content: string };
		projects: { title: string };
		blog: { title: string };
		support: { title: string };
		experience: { title: string; items: ExperienceItem[] };
		education: { title: string; items: EducationItem[] };
	};
	error: {
		title: string;
		message: string;
		back: string;
	};
}
