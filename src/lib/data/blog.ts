import { createClient } from '$lib/prismicio';
import { asHTML } from '@prismicio/client';
import type { BlogPost } from '$lib/types';

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

export const getPost = async (uid: string): Promise<BlogPost> => {
	const client = createClient();
	const doc = await client.getByUID('post', uid);
	return mapPost(doc);
};

export const getAllPosts = async (): Promise<BlogPost[]> => {
	const client = createClient();
	const docs = await client.getAllByType('post');
	return docs.map(mapPost);
};

export const getPostUids = async (): Promise<string[]> => {
	const client = createClient();
	const posts = await client.getAllByType('post');
	return posts.map((post) => post.uid ?? '').filter((uid) => uid.length > 0);
};
