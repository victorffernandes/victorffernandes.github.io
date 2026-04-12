<script lang="ts">
	import Spinner from 'flowbite-svelte/Spinner.svelte';

	interface Props {
		color?: 'primary' | 'secondary' | 'gray' | 'red' | 'green' | 'blue';
		size?: '4' | '5' | '6' | '8' | '10' | '12' | '16';
		class?: string;
	}

	let { color = 'primary', size = '8', class: className = '', ...restProps }: Props = $props();
</script>

<Spinner {color} {size} class={className} {...restProps} />
