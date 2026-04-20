<script lang="ts">
	import { t } from '$lib/stores/locale.store';
	import { SectionTitle } from '$lib/components/molecules';
</script>

<section id="about-me" class="mx-auto flex max-w-7xl flex-col gap-12 px-container py-section md:flex-row md:items-center">

	<!-- Portrait with displaced frame -->
	<div class="w-full shrink-0 md:w-95">
		<div class="relative pb-3 pr-3">
			<img
				src="src/lib/assets/portrait.png"
				alt={$t.pages.about.name}
				onerror={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
				class="relative z-10 block aspect-3/4 w-full object-cover object-top"
			/>
		</div>
	</div>

	<!-- Text content -->
	<div class="flex flex-col gap-6">
		<SectionTitle>{$t.pages.about.title}</SectionTitle>

		{#each $t.pages.about.content.split('\n\n') as paragraph}
			<p class="font-bold leading-relaxed text-secondary-300">{paragraph}</p>
		{/each}
	</div>

</section>
