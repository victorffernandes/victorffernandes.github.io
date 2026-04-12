# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Victor Fernandes' professional portfolio site hosted at `victorffernandes.github.io` via GitHub Pages.

**Stack:** SvelteKit (static adapter) · Svelte 5 (runes mode) · Tailwind CSS v4 · flowbite-svelte · TypeScript

> **Node requirement:** The dependencies require Node ≥ 20. Always run scripts with `nvm use v22.22.2` before `npm run dev / build / check`.

## Commands

```bash
npm run dev        # dev server at localhost:5173
npm run build      # static output → build/
npm run preview    # serve build/ at localhost:4173
npm run check      # svelte-check type checking (0 errors expected)
```

## Pages

| Route | File | Intended content |
|-------|------|-----------------|
| `/` | `src/routes/+page.svelte` | About — personal bio, intro, skills summary |
| `/projects` | `src/routes/projects/+page.svelte` | Portfolio grid of all projects |
| `/blog` | `src/routes/blog/+page.svelte` | Scrollable list of blog posts |
| `/support` | `src/routes/support/+page.svelte` | Donation / sponsorship initializer |

Each page imports `SectionHeading` from atoms and its title from `$t.pages.<page>.title`. Page titles live in the `pages` namespace of the translation files (`src/lib/langs/`). Add new page-level strings there, not as raw text in components.

All routes are pre-rendered (`export const prerender = true` in `src/routes/+layout.ts`).

---

## Architecture

### Atomic Design — `src/lib/components/`

Components are organized in four layers. Each layer may only import from layers below it.

| Layer | Path | Rule |
|-------|------|------|
| `atoms/` | Smallest units. Wrap a single flowbite-svelte primitive, narrow its prop types to project-relevant values. |
| `molecules/` | Combine atoms to represent one content item (e.g. a card). No direct flowbite imports — use atoms. |
| `organisms/` | Full page sections. Consume a store, render molecules/atoms, own their layout. |

Each folder has an `index.ts` barrel. Always import from the barrel, not the file directly:

```ts
// correct
import { AppButton, AppBadge } from '$lib/components/atoms';
import { ProjectCard } from '$lib/components/molecules';
import { ProjectsSection } from '$lib/components/organisms';

// wrong — bypasses the barrel
import AppButton from '$lib/components/atoms/AppButton.svelte';
```

#### Atom pattern

Atoms define their own `interface Props` (no `extends` on flowbite types — it produces "too complex to represent" TS errors). Expose a narrow set of valid values, forward the rest via `...restProps`:

```svelte
<!-- src/lib/components/atoms/AppButton.svelte -->
<script lang="ts">
  import Button from 'flowbite-svelte/Button.svelte';
  import type { ButtonProps } from 'flowbite-svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    color?: 'primary' | 'alternative' | 'light' | 'dark';
    variant?: 'solid' | 'outline';
    size?: ButtonProps['size'];
    children?: Snippet;
    // ... other explicit props
  }

  let { color = 'primary', variant = 'solid', children, ...restProps }: Props = $props();
</script>

<Button {color} outline={variant === 'outline'} {...restProps}>
  {@render children?.()}
</Button>
```

> **Do not import flowbite-svelte components from the main package index** (`import { Button } from 'flowbite-svelte'`). The main index comments out most components. Import from the component path: `import Button from 'flowbite-svelte/Button.svelte'`. Same for `ThemeProvider`: `import ThemeProvider from 'flowbite-svelte/ThemeProvider.svelte'`.

### Types — `src/lib/types/`

| File | Contents |
|------|----------|
| `portfolio.types.ts` | Domain interfaces: `Project`, and future `Skill`, `ExperienceItem`, `SocialLink` |
| `store.types.ts` | `AsyncState<T>` discriminated union + `idle / loading / success / error` constructors |

All types are re-exported from `src/lib/types/index.ts`. Import from `$lib/types`:

```ts
import type { Project, AsyncState } from '$lib/types';
import { success, loading, error } from '$lib/types';
```

**Adding a new domain type:** add the interface to `portfolio.types.ts` and re-export it. No new files needed until there are several unrelated types.

### Data — `src/lib/data/`

Static, typed content arrays. Each file exports a single named `const` of the matching domain type. Data is pre-loaded — no async fetching at this layer.

```ts
// src/lib/data/projects.ts
import type { Project } from '$lib/types';

export const projects: Project[] = [
  {
    id: 'my-project',           // unique slug, used as key in #each
    title: 'My Project',
    description: 'Short description.',
    tags: ['TypeScript', 'SvelteKit'],
    repoUrl: 'https://github.com/victorffernandes/my-project',
    liveUrl: 'https://my-project.vercel.app',
    featured: true              // shown in featuredProjects derived store
  }
];
```

**Adding a new content type** (e.g. skills): create `src/lib/data/skills.ts`, add an entry to `src/lib/data/index.ts`, add the `Skill` interface to `portfolio.types.ts`.

### Stores — `src/lib/stores/`

Stores expose `AsyncState<T>` via Svelte `writable`. Data files are the source — stores initialize already in `success` state, so components never have to handle a loading screen for purely static content.

```ts
// src/lib/stores/projects.store.ts
const _state = writable<AsyncState<Project[]>>(success(staticProjects));
export const projectsStore = { subscribe: _state.subscribe }; // read-only public surface
export const featuredProjects = derived(_state, (state) => ...); // convenience derived
```

| Store | File | Exported |
|-------|------|----------|
| Projects | `projects.store.ts` | `projectsStore`, `featuredProjects` |
| UI | `ui.store.ts` | `activeSection`, `isDarkMode`, `initDarkMode()`, `toggleDarkMode()` |

**Using a store in a component** (Svelte 5 runes, `$store` syntax still works):

```svelte
<script lang="ts">
  import { projectsStore } from '$lib/stores/projects.store';
</script>

{#if $projectsStore.status === 'loading'}
  <AppSpinner />
{:else if $projectsStore.status === 'error'}
  <p>{$projectsStore.error}</p>
{:else if $projectsStore.status === 'success'}
  {#each $projectsStore.data as project (project.id)}
    <ProjectCard {project} />
  {/each}
{/if}
```

**Adding a new store:** create `src/lib/stores/<domain>.store.ts`, initialize with `success(staticData)` for static content, export it from `src/lib/stores/index.ts`.

### Internationalization — `src/lib/langs/`

Translation strings live in JSON files under `src/lib/langs/`. Each locale is one file named after its BCP 47 tag:

```
src/lib/langs/
├── en.json   # English (default)
└── pt.json   # Portuguese
```

The `Translations` interface in `src/lib/types/i18n.types.ts` defines the authoritative shape. Both JSON files must satisfy it — TypeScript enforces this at import time via the `localeMap` record in the store.

**Adding a new string:**
1. Add the key to `Translations` in `src/lib/types/i18n.types.ts`
2. Add the value to every JSON file in `src/lib/langs/`

**Adding a new locale:**
1. Create `src/lib/langs/<tag>.json` matching the `Translations` shape
2. Add the tag to `Locale` in `src/lib/types/i18n.types.ts`
3. Add the entry to `localeMap` in `src/lib/stores/locale.store.ts`

**Using translations in a component:**

```svelte
<script lang="ts">
  import { t } from '$lib/stores/locale.store';
</script>

<p>{$t.nav.about}</p>
```

Access is via dot notation on the reactive `$t` object — fully type-safe, no function call needed.

**Locale persistence:** `initLocale()` reads `localStorage` key `'LOCALE_KEY'` and sets the store. Call it once in `+layout.svelte`:

```svelte
<script lang="ts">
  import { initLocale } from '$lib/stores/locale.store';
  $effect(() => { initLocale(); });
</script>
```

To switch locale programmatically, call `setLocale('pt')` from `$lib/stores/locale.store`.

---

### Theme — `src/lib/theme/`

Two parallel systems that must stay in sync:

1. **CSS tokens** (`src/routes/layout.css` `@theme {}` block) — define Tailwind v4 utility classes and CSS custom properties. Flowbite resolves `primary-*` and `secondary-*` color utilities from here.
2. **TS constants** (`src/lib/theme/colors.ts`, `typography.ts`, `spacing.ts`) — mirror the same values for programmatic use.
3. **`flowbiteTheme`** (`src/lib/theme/index.ts`) — a `ThemeConfig` object passed to `<ThemeProvider>` for structural slot overrides on flowbite components.

> **Tailwind v4 has no `tailwind.config.ts`.** All theme customization is in `src/routes/layout.css` inside `@theme {}`.

To change a brand color, update **both** `layout.css` and `src/lib/theme/colors.ts`.

To override a flowbite component's CSS structure (e.g. make all Cards use `rounded-xl`):

```ts
// src/lib/theme/index.ts
export const flowbiteTheme: ThemeConfig = {
  card: { base: 'rounded-xl shadow-lg' }
};
```

## Key Conventions

- **Svelte 5 runes mode is enforced** project-wide (`compilerOptions.runes` in `svelte.config.js`). Use `$props()`, `$state()`, `$derived()`, `$effect()`. Do not use the legacy options API.
- **`$store` syntax** (auto-subscribe with `$`) works for cross-component shared state even in runes mode.
- **All routes are prerendered** (`export const prerender = true` in `src/routes/+layout.ts`). Do not add server-only logic or dynamic routes without updating this.
- **Import paths** use `$lib/` alias, never relative paths like `../../lib/`.
- **Component `class` prop** is always named `class` in the interface and aliased to `className` in destructuring to avoid the JS reserved word conflict.
