<script lang="ts">
	import { SliceZone } from '@prismicio/svelte';
	import { components } from '$lib/slices';
	import type { BlogPost } from '$lib/types';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const post: BlogPost = data.post;
</script>

<h1>{post.uid}</h1>
