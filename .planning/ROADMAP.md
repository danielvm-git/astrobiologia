# Project Roadmap: Astrobiologia.com.br

## Milestone 1: MVP - Functional Portal & Admin

### Phase 1: Infrastructure & Appwrite Setup
- [x] Configure Appwrite Cloud (Database, Storage Bucket, Auth).
- [x] Finalize SvelteKit integration (Env vars, Server-side Client).
- [x] Implement foundational design system (Tailwind 4).
- [x] **UAT**: Appwrite connection verified, basic layout rendered.

### Phase 2: Administrative CMS (Articles CRUD)
- [x] Build Login page with Appwrite Auth.
- [x] Create Article CRUD interface (Create/Edit forms).
- [x] Implement Rich Text editor and Image upload.
- [x] **UAT**: Articles can be created and stored in Appwrite.

### Phase 3: Public Portal - Home & Articles
- [x] Build Home page (Featured Article + Grid).
- [x] Implement Article Detail page with SEO meta tags.
- [x] Build Category filtering and Author bio page.
- [x] **UAT**: Public can read articles and browse categories.

### Phase 4: Initial Content Seed & Polish
- [x] Populate initial articles (Seed content).
- [x] Refine "New Scientist" / "Universe Today" aesthetics.
- [x] Finalize deployment via Appwrite Sites.
- [x] **UAT**: Site is live and looks premium.

**Plans:** 2 plans
- [x] 04-01-PLAN.md — Content seeding and aesthetic audit (animations, typography).
- [x] 04-02-PLAN.md — Image optimization and production deployment on Appwrite Sites.

## Milestone 2: Expansion & Global Reach

### Phase 5: Multilingual (i18n)
- [ ] Integrate `svelte-i18n` or similar.
- [ ] Implement language switcher.
- [ ] Integration with DeepL for article drafts.
- [ ] **UAT**: UI and articles are accessible in multiple languages.

### Phase 6: Search & Discovery
- [ ] Implement global search (Appwrite Query).
- [ ] Finalize SEO optimization (Sitemap, Schema.org).
- [ ] **UAT**: Search returns relevant articles, SEO audit passes.

### Phase 7: Optimization & Maintenance
- [ ] Image optimization and lazy loading.
- [ ] Dark mode refinements.
- [ ] Newsletter subscription form (simple).
- [ ] **UAT**: Site performance is excellent (90+ Lighthouse).
