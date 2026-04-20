# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Victor Fernandes' professional portfolio site hosted at `victorffernandes.github.io` via GitHub Pages.

**Stack:** SvelteKit (static adapter) · Svelte 5 (runes mode) · Tailwind CSS v4 · flowbite-svelte · TypeScript

> **Node requirement:** The dependencies require Node ≥ 20. Always run scripts with `nvm use v22.22.2` before `npm run dev / build / check`.

## Deployment

The site deploys automatically to `https://victorffernandes.github.io` via GitHub Actions on every push to `main`.

**Workflow:** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
- Runs on Node 22, installs deps with `npm ci`, builds with `npm run build`
- Uploads `build/` as a Pages artifact and deploys via `actions/deploy-pages`

The static adapter is configured with `fallback: '404.html'` in `svelte.config.js` so GitHub Pages serves the SvelteKit error page (`src/routes/+error.svelte`) for any unknown URL instead of a raw GitHub 404.

> Do not change `fallback` back to `undefined` — this breaks direct URL navigation and page refreshes on non-root routes.

## Infrastructure

Alongside the GitHub Pages site, there is a companion self-hosted LLM backend provisioned with **Terraform** on **Oracle Cloud Infrastructure (OCI)**.

**Purpose:** power a chatbot feature on the portfolio. Visitors can ask questions about Victor's background and experience; the LLM answers using a pre-seeded context built from `site-llm-context.md`.

**Setup:**
- **Cloud:** OCI ARM64 VM (`VM.Standard.A1.Flex`, free tier: 4 OCPUs, 24 GB RAM, 100 GB boot)
- **OS:** Ubuntu 22.04, bootstrapped via cloud-init
- **Stack:** Docker Compose with two services:
  - `ollama` — LLM inference server (internal port 11434, never exposed)
  - `nginx` — reverse proxy (public port 80), with HMAC captcha cookie validation
- **Model:** configurable via `base_model` variable (default `qwen3:0.6b`). A custom Ollama Modelfile bakes in `system_prompt` (behavioral constraints) and `context_prompt` (Victor's professional profile from `site-llm-context.md`) as pre-seeded conversation history.

**Key files:**
- `terraform/main.tf` — OCI provider config, image lookup, module wiring
- `terraform/resources/compute.tf` — VM resource, cloud-init template rendering
- `terraform/resources/network.tf` — VCN, subnet, security list (ports 22/SSH, 80/HTTP, ICMP open)
- `terraform/templates/cloud-init.yaml.tpl` — bootstrap script (Docker install, Compose startup)
- `terraform/templates/docker-compose.yml` — Ollama + Nginx service definitions
- `terraform/templates/nginx/nginx.conf` — reverse proxy config with captcha signing

**Credentials:** `terraform/variables/terraform.tfvars` is git-ignored. An example file is committed for reference; copy it, fill in real OCI credentials and captcha secret, and use it with `terraform plan -var-file=...`.

> **State management:** `terraform/terraform.tfstate` is committed to the repo. This is a security risk if it contains secrets — ensure all sensitive values are in `.tfvars` files, not committed to state.

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
| `/` | `src/routes/+page.svelte` | Hero intro, about bio, experience timeline, education timeline |
| `/blog` | `src/routes/blog/+page.svelte` | Scrollable list of blog posts fetched from Prismic CMS |
| `/blog/post/[uid]` | `src/routes/blog/post/[uid]/+page.svelte` | Individual blog post detail, prerendered from Prismic UIDs |

Each page imports `SectionHeading` from atoms, wraps content with `SeoHead` for SEO metadata, and sources titles from `$t.pages.<page>.title`. Page titles live in the `pages` namespace of the translation files (`src/lib/langs/`). Add new page-level strings there, not as raw text in components.

All routes are pre-rendered. The root layout sets `export const prerender = true` in `src/routes/+layout.ts`; the blog post detail route (`/blog/post/[uid]`) re-declares it and exports `entries()` to enumerate all post UIDs from Prismic.

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
import { BlogPostCard } from '$lib/components/molecules';
import { HeroSection } from '$lib/components/organisms';

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

#### Atoms in use

- `AppButton`, `AppBadge`, `AppAvatar`, `AppSpinner`, `SectionHeading` — flowbite wrappers (documented by the pattern above)
- `SeoHead` — SEO metadata injector. Injects `<svelte:head>` with Open Graph, Twitter Card, canonical URL, and `og:locale` (reactive to `$locale`). Props: `title`, `description`, `canonicalUrl`, `siteName`, `type?` (`'website' | 'article'`), `imageUrl?`, `twitterCard?`, `noIndex?`. Used in every route.
- `ContactButton` — CTA link to `/blog`, label from `$t.nav.blog`. No props beyond `class`.
- `SocialBadge` — icon link for social platforms (`'linkedin' | 'github' | 'lattes'`). Props: `platform`, `href`. Uses inline SVG for LinkedIn/GitHub, imports `lattes.png` for Lattes.

#### Molecules in use

- `ProjectCard` — portfolio card (documented by architecture above)
- `LocaleSwitcher` — language selector dropdown; iterates `availableLocales`, calls `setLocale()` on selection. Props: `class`.
- `SectionTitle` — `SectionHeading` with a horizontal gradient accent line. Props: `title`, `reversed?` (boolean, flips accent side).
- `BlogPostCard` — blog listing card. Props: `post: BlogPost`. Renders cover, title, description, tags; links to `/blog/post/{post.uid}`.
- `TimelineTrack` — vertical timeline connector (line + dot). Props: `isLast?` (boolean, hides line on final entry).

#### Organisms in use

- `NavBar` — top navigation bar. Desktop: `LocaleSwitcher` left, nav links + `ContactButton` right. Mobile: hamburger toggle → slide-down menu. Uses `$app/state`'s `page` for active-link detection. Includes smooth-scroll logic for in-page anchors (`/#experience`, `/#education`).
- `Timeline` — vertical timeline layout. Props: `items: TimelineItem[]`, `orientation: 'left-right' | 'right-left'`. CSS grid with date column, `TimelineTrack`, and content column; orientation flips which holds dates.
- `HeroSection` — hero intro section. Renders name, subtitle, and role from `$t.pages.about`. Column of `SocialBadge` links (LinkedIn, GitHub, Lattes). No props.
- `AboutSection` — personal bio section. Renders portrait image (`$lib/assets/portrait.png`) alongside bio text (`$t.pages.about.content` split on `\n\n` into paragraphs). No props.
- `ExperienceSection` — work experience timeline. `SectionTitle` + `Timeline orientation="left-right"` using `$t.pages.experience.items`. No props.
- `EducationSection` — education timeline. `SectionTitle reversed` + `Timeline orientation="right-left"` using `$t.pages.education.items`. No props.

### Types — `src/lib/types/`

| File | Contents |
|------|----------|
| `portfolio.types.ts` | Domain interfaces: `TimelineItem`, `ExperienceItem`, `EducationItem`, `BlogPost` |
| `store.types.ts` | `AsyncState<T>` discriminated union + `idle / loading / success / error` constructors |
| `i18n.types.ts` | `Translations` interface (enforces shape across locales); includes `seo` namespace for SEO metadata |

All types are re-exported from `src/lib/types/index.ts`. Import from `$lib/types`:

```ts
import type { Project, AsyncState } from '$lib/types';
import { success, loading, error } from '$lib/types';
```

**Adding a new domain type:** add the interface to `portfolio.types.ts` and re-export it. No new files needed until there are several unrelated types.

### Data — `src/lib/data/`

Content is fetched from Prismic CMS, not stored as static arrays. The data layer is **async**.

**`src/lib/data/blog.ts`** exports:
- `getPost(uid: string, lang: string)` — fetch a single blog post by UID and language
- `getAllPosts(lang: string)` — fetch all blog posts for a language
- `getPostUids()` — fetch all post UIDs (used by `+page.ts` `entries()` for static prerendering)
- `localeToLang(locale: Locale)` — map locale BCP 47 tag to Prismic language code

Both Svelte load functions (`+page.ts`) and components can call these async functions. Routes using async data declare `export const prerender = true` and export an `entries()` function to pre-enumerate all possible values (e.g. all blog post UIDs).

### Stores — `src/lib/stores/`

Stores are reactive containers for shared state: UI state (`activeSection`, `isDarkMode`) and locale/translations (`currentLocale`, `t`).

| Store | File | Exported |
|-------|------|----------|
| UI | `ui.store.ts` | `activeSection`, `isDarkMode`, `initDarkMode()`, `toggleDarkMode()` |
| Locale | `locale.store.ts` | `t` (reactive translations), `initLocale()`, `setLocale(locale)`, `currentLocale` |

**Using a store in a component** (Svelte 5 runes, `$store` syntax auto-subscribes):

```svelte
<script lang="ts">
  import { t } from '$lib/stores/locale.store';
  import { isDarkMode } from '$lib/stores/ui.store';
</script>

<p>{$t.pages.about.title}</p>
<p>Dark mode: {$isDarkMode}</p>
```

**Adding a new store:** create `src/lib/stores/<domain>.store.ts`, export it from `src/lib/stores/index.ts`. If the store wraps `AsyncState<T>` (data from an async source), initialize with an `idle`, `loading`, `success`, or `error` state and update it as fetches complete.

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

### CMS — Prismic

Blog and project content is hosted in **Prismic**, a headless CMS.

**Key files:**
- `prismic.config.json` — repo name `victorffernandes`, routes for `post` and `project` content types
- `prismicio-types.d.ts` (root) — generated type declarations; **do not edit manually**
- `src/lib/prismicio.ts` — exports `createClient()` wrapper and `repositoryName` constant
- `src/lib/slices/index.ts` — Prismic slice registry (generated; currently empty)

**Fetching content:**

```ts
// src/lib/data/blog.ts
import { createClient } from '$lib/prismicio';

const client = createClient();
const allPosts = await client.getAllByType('post', { lang: 'en-us' });
const singlePost = await client.getByUID('post', 'my-post-uid', { lang: 'en-us' });
```

Use `localeToLang(locale)` to map locale BCP 47 tags (`'en'`, `'pt'`) to Prismic language codes (`'en-us'`, `'pt-br'`).

### Config — `src/lib/config/`

- `site.ts` — exports `SITE_URL = 'https://victorffernandes.github.io'`. Used by `SeoHead` to build canonical URLs.

### Assets — `src/lib/assets/`

Static images and favicon:
- `portrait.png` — used by `AboutSection`
- `lattes.png` — Lattes platform icon, used by `SocialBadge`
- Favicon set: `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`, `apple-touch-icon.png`

Import assets with the Svelte asset import syntax:

```ts
import portrait from '$lib/assets/portrait.png';
```

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
