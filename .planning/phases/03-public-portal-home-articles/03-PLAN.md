# Phase 3: Public Portal - Home & Articles - Plan

This phase builds the core public-facing portal, focusing on aesthetics, readability, and content discovery.

## Wave 1: Home Page & Discovery [type: execute]
Refine the home page to prominently feature key content and improve discovery.

- **Task 1: Featured Article Hero [type: execute]**
  - `<read_first>`: `src/routes/+page.svelte`, `src/routes/+page.server.ts`
  - `<action>`: Modify `src/routes/+page.svelte` to prominently display the first `featured` article as a high-impact Hero section with a background image and CTA.
  - `<acceptance_criteria>`: Home page has a Hero section for the latest featured article.
- **Task 2: Dynamic Grid & Category Filter [type: execute]**
  - `<read_first>`: `src/routes/+page.svelte`, `src/lib/components/ArticleCard.svelte`
  - `<action>`: Refine the `recentArticles` grid to exclude the hero article and improve the visual consistency of `ArticleCard.svelte`.
  - `<acceptance_criteria>`: Grid displays only published, non-hero articles.

## Wave 2: Article Detail & SEO [type: execute]
Polish the reading experience and ensure optimal search engine visibility.

- **Task 3: Reading Experience Polish [type: execute]**
  - `<read_first>`: `src/routes/artigos/[slug]/+page.svelte`, `src/app.css`
  - `<action>`: Refine the `prose-astro` typography in `src/app.css` (line height, spacing, heading weights) and ensure `+page.svelte` correctly renders Tiptap HTML.
  - `<acceptance_criteria>`: Articles are highly readable with professional formatting.
- **Task 4: Dynamic SEO & Sharing [type: execute]**
  - `<read_first>`: `src/routes/artigos/[slug]/+page.svelte`, `src/lib/seo.ts`
  - `<action>`: Finalize the `svelte:head` content to use dynamic titles, descriptions, and OpenGraph images from Appwrite.
  - `<acceptance_criteria>`: Social sharing previews correctly display article title and image.

## Wave 3: Secondary Routes & Content [type: execute]
Complete the remaining public pages.

- **Task 5: Category Archive Route [type: execute]**
  - `<read_first>`: `src/routes/categorias/[category]/+page.svelte`
  - `<action>`: Implement the category archive page to filter articles by category from Appwrite.
  - `<acceptance_criteria>`: `/categorias/noticias` displays articles specifically from that category.
- **Task 6: "Sobre" (About) Page [type: execute]**
  - `<read_first>`: `src/routes/sobre/+page.svelte`
  - `<action>`: Build a clean, informative "About" page describing the project's mission and the author.
  - `<acceptance_criteria>`: `/sobre` page is accessible and visually aligned.

## Wave 4: Verification & UAT [type: execute]
- **Task 7: Public Portal UAT [type: execute]**
  - `<action>`: Verify end-to-end flow: Home -> Category -> Article -> Share.
  - `<acceptance_criteria>`: All links work, images load, and SEO tags are correct.

## Verification Criteria
- [ ] Home page features a high-impact Hero section for the latest featured article.
- [ ] Article detail page uses premium typography and correctly renders rich text.
- [ ] Category archive pages are functional and show correct filtering.
- [ ] SEO meta tags are dynamic and optimized for social sharing.
- [ ] "About" page correctly presents the project's mission.
