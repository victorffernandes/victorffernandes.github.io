import { createClient } from '$lib/prismicio';
import { asHTML } from '@prismicio/client';
import type { BlogPost, Locale } from '$lib/types';

export type PrismicLang = 'en-us' | 'pt-br';

export const localeToLang = (locale: Locale): PrismicLang =>
	locale === 'pt' ? 'pt-br' : 'en-us';

const mapPost = (doc: Awaited<ReturnType<ReturnType<typeof createClient>['getByUID']>>): BlogPost => ({
	uid: doc.uid ?? '',
	title: doc.data.title as string,
	description: doc.data.description as string,
	imageUrl: (doc.data.preview_image as { url?: string })?.url,
	content: asHTML(doc.data.content as Parameters<typeof asHTML>[0]) ?? undefined,
	tags: ((doc.data.tags as string) ?? '')
		.split(',')
		.map((t) => t.trim())
		.filter((t): t is string => t.length > 0),
	slices: doc.data.slices as unknown[],
});

export const getPost = async (uid: string, lang: PrismicLang = 'en-us'): Promise<BlogPost> => {
	const client = createClient();
	const doc = await client.getByUID('post', uid, { lang });
	return mapPost(doc);
};

export const getAllPosts = async (lang: PrismicLang = 'en-us'): Promise<BlogPost[]> => {
	const client = createClient();
	const docs = await client.getAllByType('post', { lang });
	return docs.map(mapPost);
};

export const getPostUids = async (lang: PrismicLang = 'en-us'): Promise<string[]> => {
	const client = createClient();
	const posts = await client.getAllByType('post', { lang });
	return posts.map((post) => post.uid ?? '').filter((uid) => uid.length > 0);
};
