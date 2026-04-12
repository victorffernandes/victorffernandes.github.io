<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';
	import ThemeProvider from 'flowbite-svelte/ThemeProvider.svelte';
	import { flowbiteTheme } from '$lib/theme';
	import { NavBar } from '$lib/components/organisms';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ThemeProvider theme={flowbiteTheme}>
	<NavBar />
	{@render children()}
</ThemeProvider>
