# Technology Stack

**Analysis Date:** 2025-05-14

## Languages

**Primary:**
- TypeScript 5.7 - Core logic, type safety, and component scripting
- Svelte 5 - UI components utilizing modern Runes ($state, $derived, $effect)

**Secondary:**
- CSS (Tailwind 4) - Component styling and global design system
- HTML - Base template `src/app.html`

## Runtime

**Environment:**
- Node.js >= 20.0.0

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- SvelteKit 2.57 - Meta-framework for routing, SSR, and API handling
- Svelte 5.33 - Component framework with reactive runes

**Testing:**
- Vitest 4.1.4 - Unit and integration testing framework
- Testing Library (Svelte) 5.3.1 - Component testing

**Build/Dev:**
- Vite 6.3.3 - Frontend build tool and dev server
- @tailwindcss/vite 4.1.8 - Tailwind 4 integration as a Vite plugin
- @inlang/paraglide-js 2.15.2 - I18n compilation and runtime

## Key Dependencies

**Critical:**
- `appwrite` 17.0.0 - Client-side SDK for Appwrite Cloud
- `node-appwrite` 24.0.0 - Server-side SDK for administrative tasks and SSR
- `svelte-tiptap` 3.0.1 - Rich text editor integration for the CMS

**Infrastructure:**
- `lucide-svelte` 0.503.0 - Icon set
- `clsx` & `tailwind-merge` - Utility for dynamic class management

## Configuration

**Environment:**
- Static environment variables via SvelteKit `$env/static/public` and `$env/static/private`
- Requires `PUBLIC_APPWRITE_ENDPOINT`, `PUBLIC_APPWRITE_PROJECT_ID`, `APPWRITE_API_KEY`

**Build:**
- `vite.config.ts` - Plugin configuration for Tailwind, SvelteKit, and Paraglide
- `svelte.config.js` - SvelteKit adapter and preprocessor configuration
- `tsconfig.json` - TypeScript configuration
- `project.inlang` - Paraglide/Inlang configuration

## Platform Requirements

**Development:**
- Node.js 20+
- Access to Appwrite Cloud project

**Production:**
- Appwrite Sites (Deployment target)

---

*Stack analysis: 2025-05-14*
