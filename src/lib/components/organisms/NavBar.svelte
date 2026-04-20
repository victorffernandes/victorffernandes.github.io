<script lang="ts">
	import { page } from '$app/state';
	import { t } from '$lib/stores/locale.store';
	import { LocaleSwitcher } from '$lib/components/molecules';
	import { ContactButton } from '$lib/components/atoms';

	const navLinks = $derived([
		{ label: $t.nav.about, href: '/' },
		// { label: $t.nav.projects, href: '/projects' },
		{ label: $t.nav.experience, href: '/#experience' },
		{ label: $t.nav.education, href: '/#education' },
		{ label: $t.nav.blog, href: '/blog' }
	]);

	let menuOpen = $state(false);

	function isActive(href: string): boolean {
		return page.url.pathname === href;
	}

	function handleNavClick(href: string) {
		menuOpen = false;

		// Handle anchor links with smooth scroll
		if (href.startsWith('/#')) {
			const sectionId = href.slice(2);
			const section = document.getElementById(sectionId);
			if (section) {
				section.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}
	}
</script>

<nav class="bg-secondary-950 border-b border-secondary-900">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-container py-3">
		<LocaleSwitcher class="hidden md:flex" />

		<!-- Desktop links + contact button -->
		<div class="hidden items-center gap-8 md:flex">
			<ul class="flex items-center gap-8">
				{#each navLinks as link}
					<li>
						<a
							href={link.href}
							class="text-sm font-medium transition-colors {isActive(link.href)
								? 'text-secondary-300'
								: 'text-secondary-600 hover:text-primary-500'}"
							onclick={(e) => {
								if (link.href.startsWith('/#')) {
									e.preventDefault();
									handleNavClick(link.href);
								}
							}}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
			<ContactButton />
		</div>

		<!-- Mobile hamburger -->
		<button
			class="ml-auto flex flex-col gap-1.5 p-2 md:hidden"
			onclick={() => (menuOpen = !menuOpen)}
			aria-label={$t.nav.toggleMenu}
		>
			<span class="block h-0.5 w-6 bg-secondary-200 transition-all" class:rotate-45={menuOpen} class:translate-y-2={menuOpen}></span>
			<span class="block h-0.5 w-6 bg-secondary-200 transition-all" class:opacity-0={menuOpen}></span>
			<span class="block h-0.5 w-6 bg-secondary-200 transition-all" class:-rotate-45={menuOpen} class:-translate-y-2={menuOpen}></span>
		</button>
	</div>

	<!-- Mobile menu -->
	{#if menuOpen}
		<div class="border-t border-secondary-900 bg-secondary-950 px-container pb-4 pt-2 md:hidden">
			<ul class="mb-3">
				{#each navLinks as link}
					<li>
						<a
							href={link.href}
							class="block py-2 text-sm font-medium transition-colors {isActive(link.href)
								? 'text-secondary-300'
								: 'text-secondary-600 hover:text-primary-500'}"
							onclick={(e) => {
								if (link.href.startsWith('/#')) {
									e.preventDefault();
									handleNavClick(link.href);
								} else {
									menuOpen = false;
								}
							}}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
			<div class="flex items-center justify-between">
				<LocaleSwitcher />
				<ContactButton />
			</div>
		</div>
	{/if}
</nav>
