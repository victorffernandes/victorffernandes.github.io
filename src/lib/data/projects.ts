import type { Project } from '$lib/types';

export const projects: Project[] = [
	{
		id: 'example-project',
		title: 'Example Project',
		description: 'A description of the project.',
		tags: ['TypeScript', 'SvelteKit'],
		repoUrl: 'https://github.com/victorffernandes/example',
		featured: true
	}
];
