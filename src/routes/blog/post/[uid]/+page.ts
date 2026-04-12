import { getPost, getPostUids } from '$lib/data';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = async () => {
	const uids = await getPostUids();
	return uids.map((uid) => ({ uid }));
};

export const load: PageLoad = async ({ params }) => {
	const post = await getPost(params.uid);
	return { post };
};
