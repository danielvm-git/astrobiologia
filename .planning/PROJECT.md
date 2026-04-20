<!-- generated-by: gsd-doc-writer -->
# Project: Astrobiologia.com.br

## What This Is
A professional journalistic portal covering astrobiology, maintained by Danilo Albergaria (journalist and researcher). The site focuses on news about life in the universe, interviews with scientists, and Brazilian research in the field.

## Core Value
Maximum simplicity, minimum maintenance (under 1 hour/month), low cost (free tier priority), and premium "New Scientist" / "Universe Today" aesthetics.

## Tech Stack
- **Frontend/Full-stack**: SvelteKit (Svelte 5)
- **Backend**: Appwrite Cloud (Auth, Database, Storage, Functions, Sites)
- **Styling**: Tailwind CSS 4
- **Deploy**: Appwrite Sites

## Requirements

### Validated
- ✓ [Appwrite Cloud Configuration] — v1.0
- ✓ [CMS / Admin Dashboard] — v1.0 (Full CRUD + Tiptap)
- ✓ [Public Interface] — v1.0 (Home + Detail + Category Filter)
- ✓ [Author Profile] — v1.0 (Integrated in "Sobre" page)
- ✓ [SEO & Social Sharing] — v1.0 (Meta tags + Schema.org)
- ✓ [Multilingual Support (i18n)] — Implementation for global audience (Phase 5 complete).

### Active
- [ ] [Server-side Global Search] — Database-indexed discovery (Phase 6 next priority).
- [ ] [Performance Audit] — Formal Lighthouse optimization and lazy loading (Phase 7).
- [ ] [Newsletter] — Simple subscription form for engagement.

### Out of Scope
- [Complex User Accounts] — Site is primarily a solo editorial portal.
- [Real-time Comments] — Maintenance overhead too high for solo journalist.
- [Self-hosted Backend] — Using Appwrite Cloud to minimize infrastructure management.

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Appwrite Cloud | All-in-one BaaS reduces maintenance and hosting. | ✓ Good |
| Google OAuth Only | Simplifies admin auth while maintaining security. | ✓ Good |
| Tiptap Editor | Flexible rich text without heavy dependencies. | ✓ Good |
| Client-side Filter | Quick discovery for MVP without complex backend logic. | ✓ Good |
| i18n via Paraglide | High-performance, typesafe i18n for Svelte 5. | ✓ Good |

## Context
- **Current State**: v1.0 shipped, v1.1 Phase 5 complete.
- **Next Goal**: Phase 6: Search Engine Integration.
- **Tone**: Professional, journalistic, and scientifically accurate.

---
*Last updated: 2026-04-20 after completion of Phase 5.*
