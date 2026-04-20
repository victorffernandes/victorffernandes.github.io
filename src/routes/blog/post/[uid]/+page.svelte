<script lang="ts">
	import type { BlogPost } from '$lib/types';
	import type { PageProps } from './$types';
	import { SectionHeading, AppBadge } from '$lib/components/atoms';

	const { data }: PageProps = $props();
	const post: BlogPost = data.post;
</script>

<div class="max-w-3xl mx-auto px-4 py-10">
	{#if post.imageUrl}
		<div class="relative rounded-xl overflow-hidden mb-8">
			<img src={post.imageUrl} alt={post.title} class="w-full h-80 object-cover" />
			<div class="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
			<div class="absolute bottom-0 left-0 p-6">
				<h1 class="text-3xl font-bold text-white">{post.title}</h1>
				{#if post.description}
					<p class="mt-1 text-base text-gray-200">{post.description}</p>
				{/if}
			</div>
		</div>
	{:else}
		<SectionHeading>{post.title}</SectionHeading>
		{#if post.description}
			<p class="mt-3 text-lg text-gray-600 dark:text-gray-400">{post.description}</p>
		{/if}
	{/if}

	{#if post.tags.length}
		<div class="flex flex-wrap gap-2 mt-4">
			{#each post.tags as tag}
				<AppBadge>{tag}</AppBadge>
			{/each}
		</div>
	{/if}

	{#if post.content}
		<div class="prose dark:prose-invert mt-8 max-w-none text-white">
			{@html post.content}
		</div>
	{/if}

</div>
