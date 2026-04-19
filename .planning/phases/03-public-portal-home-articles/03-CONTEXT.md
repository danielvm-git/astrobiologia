# Phase 3: Public Portal - Home & Articles - Context

This phase delivers the core public-facing experience of the Astrobiologia portal. The goal is to transform the existing functional routes into a premium, journalistic site inspired by "New Scientist" and "Universe Today".

## Architectural Objectives
- **Data Integrity**: Ensure the public portal only displays articles with `status: 'published'`.
- **Performance**: Optimize data fetching and image loading for a fast, responsive experience.
- **SEO & Social**: Implement comprehensive meta tags and structured data for search engine visibility.
- **Design Alignment**: Use the "Scientific Navy" and "Professional Copper" theme consistently across all public views.

## Technical Requirements
- **Svelte 5 Runes**: Use `$state` and `$derived` for dynamic filtering and UI interactions.
- **Tailwind 4 Typography**: Leverage `@tailwindcss/typography` with custom "astro" overrides.
- **Appwrite Queries**: Efficiently filter and order articles by category and publication date.

## Design Goals
- **Hero Section**: A high-impact "Featured Article" section on the home page.
- **Readability**: Optimized line heights, fluid typography, and professional serif fonts for long-form reading.
- **Discovery**: Intuitive category navigation and related article suggestions.
