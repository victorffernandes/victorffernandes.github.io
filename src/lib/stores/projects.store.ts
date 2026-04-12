import { writable, derived } from 'svelte/store';
import type { AsyncState } from '$lib/types/store.types';
import type { Project } from '$lib/types/portfolio.types';
import { projects as staticProjects } from '$lib/data/projects';
import { success } from '$lib/types/store.types';

const _state = writable<AsyncState<Project[]>>(success(staticProjects));

export const projectsStore = { subscribe: _state.subscribe };

export const featuredProjects = derived(_state, (state) =>
	state.status === 'success' ? state.data.filter((p) => p.featured) : []
);
