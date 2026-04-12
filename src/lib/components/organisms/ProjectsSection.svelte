<script lang="ts">
	import { SectionHeading, AppSpinner } from '$lib/components/atoms';
	import { ProjectCard } from '$lib/components/molecules';
	import { projectsStore } from '$lib/stores/projects.store';
</script>

<section class="py-section px-container">
	<SectionHeading class="mb-8">Projects</SectionHeading>

	{#if $projectsStore.status === 'loading'}
		<div class="flex justify-center py-12">
			<AppSpinner />
		</div>
	{:else if $projectsStore.status === 'error'}
		<p class="text-red-500">{$projectsStore.error}</p>
	{:else if $projectsStore.status === 'success'}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each $projectsStore.data as project (project.id)}
				<ProjectCard {project} />
			{/each}
		</div>
	{/if}
</section>
