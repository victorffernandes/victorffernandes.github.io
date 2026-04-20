<script lang="ts">
	import { t } from '$lib/stores/locale.store';
	import { SectionTitle } from '$lib/components/molecules';
	import Timeline from '../Timeline.svelte';
</script>

<section id="experience" class="mx-auto max-w-7xl px-container py-section">
	<SectionTitle reversed>{$t.pages.experience.title}</SectionTitle>
	<Timeline items={$t.pages.experience.items} orientation="left-right" />
</section>
