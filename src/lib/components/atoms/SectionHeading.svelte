<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className = '', children }: Props = $props();
</script>

<h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-black {className}">
	{@render children?.()}
</h2>
