<script lang="ts">
	import Badge from 'flowbite-svelte/Badge.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		color?: 'primary' | 'secondary' | 'gray' | 'blue' | 'green' | 'red';
		large?: boolean;
		border?: boolean;
		rounded?: boolean;
		class?: string;
		children?: Snippet;
	}

	let { color = 'primary', class: className = '', children, ...restProps }: Props = $props();
</script>

<Badge {color} class={className} {...restProps}>
	{@render children?.()}
</Badge>
