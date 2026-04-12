import { writable } from 'svelte/store';

export const activeSection = writable<string>('hero');

export const isDarkMode = writable<boolean>(false);

export function initDarkMode(): void {
	if (typeof localStorage === 'undefined') return;
	const stored = localStorage.getItem('THEME_PREFERENCE_KEY');
	const prefersDark =
		typeof window !== 'undefined'
			? window.matchMedia('(prefers-color-scheme: dark)').matches
			: false;
	isDarkMode.set(stored ? stored === 'dark' : prefersDark);
}

export function toggleDarkMode(): void {
	isDarkMode.update((current) => {
		const next = !current;
		document.documentElement.classList.toggle('dark', next);
		localStorage.setItem('THEME_PREFERENCE_KEY', next ? 'dark' : 'light');
		return next;
	});
}
