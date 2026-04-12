<script lang="ts">
	import Button from 'flowbite-svelte/Button.svelte';
	import type { ButtonProps } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		color?: 'primary' | 'alternative' | 'light' | 'dark';
		variant?: 'solid' | 'outline';
		pill?: boolean;
		size?: ButtonProps['size'];
		href?: string;
		target?: string;
		rel?: string;
		tag?: string;
		disabled?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		color = 'primary',
		variant = 'solid',
		pill = false,
		size = 'md',
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<Button {color} outline={variant === 'outline'} {pill} {size} class={className} {...restProps}>
	{@render children?.()}
</Button>
