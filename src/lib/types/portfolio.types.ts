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
