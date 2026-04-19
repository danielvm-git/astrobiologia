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
- ✓ [SvelteKit + Tailwind 4 Setup] — existing
- ✓ [Appwrite Integration Foundation] — existing logic in `src/lib/appwrite.ts`

### Active
- [ ] [Appwrite Cloud Configuration] — Database collections, storage buckets, and auth setup.
- [ ] [CMS / Admin Dashboard] — Extremely simple CRUD for articles (Title, Slug, Rich Text, Image, Category).
- [ ] [Public Interface] — Featured article grid, article list, and detailed article view.
- [ ] [Author Profile] — Professional bio and links for Danilo Albergaria.
- [ ] [Multilingual Support] — i18n for English, Spanish, Dutch, Chinese, Japanese.
- [ ] [SEO & Discovery] — Meta tags, Open Graph, Sitemap, and basic search.

### Out of Scope
- [Complex User Accounts] — Site is primarily a solo editorial portal.
- [Real-time Comments] — Maintenance overhead too high for solo journalist.
- [Self-hosted Backend] — Using Appwrite Cloud to minimize infrastructure management.

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Appwrite Cloud | All-in-one BaaS reduces maintenance and simplifies hosting/storage. | Accepted |
| SvelteKit + Tailwind 4 | Modern, fast development with premium aesthetics. | Accepted |
| i18n via DeepL | Automates translations for a global audience with low effort. | Pending |

## Context
- **Target Audience**: Science enthusiasts, researchers, and students interested in astrobiology.
- **Tone**: Professional, journalistic, and scientifically accurate.
- **Reference Sites**: New Scientist, Universe Today, PLOS One.

## Evolution
This document evolves at phase transitions and milestone boundaries.

---
*Last updated: 2026-04-19 after initialization*
