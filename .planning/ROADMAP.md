# Project Roadmap: Astrobiologia.com.br

## Milestone 1: MVP - Functional Portal & Admin

### Phase 1: Infrastructure & Appwrite Setup
- [ ] Configure Appwrite Cloud (Database, Storage Bucket, Auth).
- [ ] Finalize SvelteKit integration (Env vars, Server-side Client).
- [ ] Implement foundational design system (Tailwind 4).
- [ ] **UAT**: Appwrite connection verified, basic layout rendered.

### Phase 2: Administrative CMS (Articles CRUD)
- [ ] Build Login page with Appwrite Auth.
- [ ] Create Article CRUD interface (Create/Edit forms).
- [ ] Implement Rich Text editor and Image upload.
- [ ] **UAT**: Articles can be created and stored in Appwrite.

### Phase 3: Public Portal - Home & Articles
- [ ] Build Home page (Featured Article + Grid).
- [ ] Implement Article Detail page with SEO meta tags.
- [ ] Build Category filtering and Author bio page.
- [ ] **UAT**: Public can read articles and browse categories.

### Phase 4: Initial Content Seed & Polish
- [ ] Populate initial articles (Seed content).
- [ ] Refine "New Scientist" / "Universe Today" aesthetics.
- [ ] Finalize deployment via Appwrite Sites.
- [ ] **UAT**: Site is live and looks premium.

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
