<script lang="ts">
	import Dropdown from 'flowbite-svelte/Dropdown.svelte';
	import DropdownItem from 'flowbite-svelte/DropdownItem.svelte';
	import { locale, setLocale, localeMap, availableLocales, initLocale } from '$lib/stores/locale.store';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	initLocale()

	let isOpen = $state(false);
</script>

<button
	class="flex items-center gap-1.5 text-sm font-medium text-primary-100 transition-colors hover:text-white {className}"
>
	<span>{localeMap[$locale].meta.flag}</span>
	{$locale.toUpperCase()}
	<svg class="h-3 w-3" fill="none" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
		<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m1 1 4 4 4-4" />
	</svg>
</button>
<Dropdown simple bind:isOpen>
	{#each availableLocales as l}
		<DropdownItem
			onclick={() => { setLocale(l); isOpen = false; }}
			class={$locale === l ? 'font-semibold' : ''}
		>
			<span class="mr-2">{localeMap[l].meta.flag}</span>{localeMap[l].meta.name}
		</DropdownItem>
	{/each}
</Dropdown>
