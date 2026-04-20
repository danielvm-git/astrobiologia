<!-- generated-by: gsd-doc-writer -->
# Astrobiologia.com - Project Summary

## Overview

Astrobiologia.com.br is a professional science journalism platform focused on astrobiology and the search for life in the universe. Maintained by journalist and researcher Danilo Albergaria, it features news, interviews, and analyses with a special focus on Brazilian research. Built with SvelteKit 5 and Appwrite Cloud.

## Technology Stack

- **Frontend**: SvelteKit 5 (Runes) with TypeScript
- **i18n**: @inlang/paraglide-js for UI and routing
- **Styling**: Tailwind CSS v4
- **Backend**: Appwrite Cloud (Auth, Database, Storage)
- **Database**: Appwrite Database (Relational i18n Architecture)
- **Deployment**: Appwrite Sites / Node.js compatible

## Project Status

- **Current Milestone**: Milestone 1 (MVP) - **Completed**
- **Phase 5 (Multilingual)**: **Completed**
- **Health**: Stable. All 22 tests passing. Core features (Articles CRUD, Auth, i18n) are functional.

## Project Structure

### Estrutura de Rotas (SvelteKit + Paraglide)
All routes are automatically localized by Paraglide:
- `/`: Homepage with featured articles and latest news.
- `/artigos`: Full listing of articles with filters.
- `/artigos/[slug]`: Article reading page (New Scientist style).
- `/categorias/[category]`: Article listing by category.
- `/sobre`: Biography and author mission.
- `/admin`: Administrative area (Login, Dashboard, Article Management).
- `/admin/artigos`: List and actions for articles.
- `/admin/artigos/new`: Editor for new articles.
- `/admin/artigos/[id]/edit`: Editing existing articles (supports multiple languages).

### API Routes
- `/api/articles/[id]/delete` - Delete articles and their translations via POST
- `/api/upload` - Image upload to Appwrite storage
- `/sitemap.xml` - Dynamic SEO sitemap
- `/robots.txt` - Search engine directives

## Key Features

### Multi-language Support (i18n)
- **Relational i18n**: Master articles are linked to language-specific translation documents.
- **Routing**: Locale-aware routing (e.g., `/en/articles` vs `/artigos`).
- **Dynamic Content**: Articles can be published in multiple languages with independent slugs and metadata.

### Content Management
- Create, read, update, delete articles with multi-language support.
- Rich text editor (Tiptap) with HTML support.
- Upload and manage featured images.
- Organize articles by category and tags.
- Publish/draft status management.

### SEO & Public Interface
- Dynamic meta tags per language.
- Schema.org JSON-LD structured data.
- Responsive design (mobile-first).
- Fast page loads with SvelteKit SSR.

## Database Schema (Relational i18n)

### articles Collection (Master)
Stores metadata shared across all translations.
```json
{
  "category": "string",
  "tags": "string[]",
  "featuredImage": "string (Appwrite File ID)",
  "featuredImageAlt": "string",
  "featured": "boolean",
  "status": "published | draft",
  "authorId": "string",
  "authorName": "string",
  "publishedAt": "datetime",
  "ogImage": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### article_translations Collection
Stores content for a specific language.
```json
{
  "article_id": "string (reference to articles.$id)",
  "language": "string (e.g., 'pt-br', 'en')",
  "title": "string",
  "slug": "string (unique per language)",
  "excerpt": "string",
  "content": "string (HTML)",
  "metaTitle": "string",
  "metaDescription": "string"
}
```

## Component Architecture

### Reusable Components
- `Header.svelte` - Navigation header with language switcher.
- `Footer.svelte` - Site footer with links and social.
- `ArticleCard.svelte` - Article preview card for grids.
- `ArticleEditor.svelte` - WYSIWYG article editor with translation tabs.
- `SearchBox.svelte` - Search input component.

### Stores & Hooks
- `auth.ts` - Authentication state management.
- `hooks.server.ts` - Paraglide middleware and Admin session validation.

## Getting Started

### Development
```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

### Admin Access
1. Set up admin user in Appwrite Console.
2. Go to `/admin/login`.
3. Access `/admin/dashboard`.

## Build & Deployment

### Build for Production
```bash
pnpm build
```

### Deployment
The project is optimized for Appwrite Sites or any Node.js compatible environment.

## Future Enhancements

### Upcoming Phases
- User comments and discussions.
- Email newsletter subscription.
- Reading time estimates.
- Article recommendation engine.
- Interactive visualizations.

---

**Status**: Stable - Milestone 1 (MVP) & Phase 5 (i18n) Complete
**Last Updated**: 2026-05-20
**Maintainer**: Danilo Albergaria
