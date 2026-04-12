<script lang="ts">
	import Avatar from 'flowbite-svelte/Avatar.svelte';
	import type { AvatarProps } from 'flowbite-svelte';

	interface Props extends AvatarProps {}

	let { class: className = '', ...restProps }: Props = $props();
</script>

<Avatar class={className} {...restProps} />
