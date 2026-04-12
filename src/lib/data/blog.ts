import { createClient } from '$lib/prismicio';
import type { BlogPost } from '$lib/types';

export const getPost = async (uid: string): Promise<BlogPost> => {
	const client = createClient();
	const doc = await client.getByUID('post', uid);

	return {
		uid: doc.uid,
		title: doc.data.title as string,
		tags: doc.data.tags as string,
		slices: doc.data.slices as unknown[],
	};
};

export const getPostUids = async (): Promise<string[]> => {
	const client = createClient();
	const posts = await client.getAllByType('post');
	return posts.map((post) => post.uid);
};
