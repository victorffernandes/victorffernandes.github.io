<script lang="ts">
	import { t } from '$lib/stores/locale.store';
	import { SectionTitle } from '$lib/components/molecules';
	import Timeline from '../Timeline.svelte';
</script>

<section id="education" class="mx-auto max-w-7xl px-container py-section">
	<SectionTitle reversed>{$t.pages.education.title}</SectionTitle>
	<Timeline items={$t.pages.education.items} orientation="right-left" />
</section>
