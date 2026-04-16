import { getAllPosts, localeToLang } from '$lib/data';
import { locale } from '$lib/stores/locale.store';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const lang = localeToLang(get(locale));
	const posts = await getAllPosts(lang);
	return { posts };
};
