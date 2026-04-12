export interface Project {
	id: string;
	title: string;
	description: string;
	tags: string[];
	repoUrl?: string;
	liveUrl?: string;
	imageUrl?: string;
	featured: boolean;
}

export interface BlogPost {
	uid: string;
	title: string;
	tags: string;
	// Opaque Prismic slice data — consumed by <SliceZone> at render time
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	slices: any[];
}
