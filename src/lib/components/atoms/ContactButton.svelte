<script lang="ts">
	import AppButton from './AppButton.svelte';
	import { t } from '$lib/stores/locale.store';
</script>

<AppButton color="primary" href="/blog">{$t.nav.blog}</AppButton>
