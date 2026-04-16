import { getPost, getPostUids, localeToLang } from '$lib/data';
import { locale } from '$lib/stores/locale.store';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = async () => {
	const lang = localeToLang(get(locale));
	const uids = await getPostUids(lang);
	return uids.map((uid) => ({ uid }));
};

export const load: PageLoad = async ({ params }) => {
	const lang = localeToLang(get(locale));
	const post = await getPost(params.uid, lang);
	return { post };
};
