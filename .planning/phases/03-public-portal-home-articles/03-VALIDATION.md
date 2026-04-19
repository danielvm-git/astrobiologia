# Phase 3 Validation: Public Portal - Home & Articles

## Validation Checklist

### 1. Home Page & Discovery
- [x] Hero section displays the most recent article with `featured: true`.
- [x] Article grid excludes the hero article and displays published content only.
- [x] `ArticleCard` visual styling matches the premium scientific design goal.
- [x] Hover states and transitions are smooth.

### 2. Article Detail & SEO
- [x] Article content renders correctly with Tiptap HTML.
- [x] `prose-astro` styles (line height, spacing, heading weights) are applied.
- [x] Dynamic `<title>` and `<meta name="description">` are present in source.
- [x] OpenGraph and Twitter images use the featured image URL from Appwrite.
- [x] Schema.org JSON-LD is correctly formatted and injected.

### 3. Navigation & Archives
- [x] Category links in the header and cards route to the correct archive page.
- [x] Category archive page shows correct articles for the active category.
- [x] Breadcrumbs work correctly for navigation.
- [x] "Sobre" page is accessible and visually consistent.

### 4. Technical Quality
- [x] `pnpm check` passes for public routes (ignoring pre-existing admin/test errors).
- [x] No layout shifts or console errors on page load.
- [x] Responsive design verified for mobile and desktop.

## UAT Observations
The portal now feels professional and authoritative. The typography in the articles is a significant improvement, providing a clear "New Scientist" vibe. SEO tags were verified using `curl` to inspect head content.

## Approval
**Status: PASSED**
**Date: 2026-04-19**
