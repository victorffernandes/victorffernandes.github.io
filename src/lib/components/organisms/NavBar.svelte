<script lang="ts">
	import logo from '$lib/assets/apple-touch-icon.png';
	import { t } from '$lib/stores/locale.store';
	import { LocaleSwitcher } from '$lib/components/molecules';

	const navLinks = $derived([
		{ label: $t.nav.about, href: '/' },
		{ label: $t.nav.projects, href: '/projects' },
		{ label: $t.nav.blog, href: '/blog' },
		{ label: $t.nav.support, href: '/support' }
	]);

	let menuOpen = $state(false);
</script>

<nav class="bg-primary-900 text-white shadow-md">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-container py-3">
		<!-- Logo + Name -->
		<a href="/" class="flex items-center gap-3 font-semibold text-white hover:text-primary-200">
			<img src={logo} alt="Victor Fernandes logo" class="h-9 w-9 rounded-full" />
			<span class="text-lg tracking-tight">Victor Fernandes</span>
		</a>

		<!-- Desktop links + locale switcher -->
		<div class="hidden items-center gap-8 md:flex">
			<ul class="flex items-center gap-8">
				{#each navLinks as link}
					<li>
						<a
							href={link.href}
							class="text-sm font-medium text-primary-100 transition-colors hover:text-white"
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
			<LocaleSwitcher />
		</div>

		<!-- Mobile hamburger -->
		<button
			class="flex flex-col gap-1.5 p-2 md:hidden"
			onclick={() => (menuOpen = !menuOpen)}
			aria-label={$t.nav.toggleMenu}
		>
			<span class="block h-0.5 w-6 bg-white transition-all" class:rotate-45={menuOpen} class:translate-y-2={menuOpen}></span>
			<span class="block h-0.5 w-6 bg-white transition-all" class:opacity-0={menuOpen}></span>
			<span class="block h-0.5 w-6 bg-white transition-all" class:-rotate-45={menuOpen} class:-translate-y-2={menuOpen}></span>
		</button>
	</div>

	<!-- Mobile menu -->
	{#if menuOpen}
		<div class="border-t border-primary-800 bg-primary-900 px-container pb-4 pt-2 md:hidden">
			<ul class="mb-3">
				{#each navLinks as link}
					<li>
						<a
							href={link.href}
							class="block py-2 text-sm font-medium text-primary-100 hover:text-white"
							onclick={() => (menuOpen = false)}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
			<LocaleSwitcher />
		</div>
	{/if}
</nav>
