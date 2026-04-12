import { writable, derived } from 'svelte/store';
import type { Locale, Translations } from '$lib/types';
import en from '$lib/langs/en.json';
import pt from '$lib/langs/pt.json';

const LOCALE_KEY = 'LOCALE_KEY';
export const localeMap: Record<Locale, Translations> = { en, pt };
export const availableLocales = Object.keys(localeMap) as Locale[];

export const locale = writable<Locale>('en');

export const t = derived(locale, ($locale) => localeMap[$locale]);

export function initLocale(): void {
	if (typeof localStorage === 'undefined') return;
	const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
	if (stored && stored in localeMap) locale.set(stored);
}

export function setLocale(next: Locale): void {
	locale.set(next);
	localStorage.setItem(LOCALE_KEY, next);
}
