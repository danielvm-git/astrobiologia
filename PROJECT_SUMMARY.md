<!-- generated-by: gsd-doc-writer -->

# Astrobiologia.com - Project Summary

## Overview

Astrobiologia.com.br is a professional science journalism platform focused on astrobiology and the search for life in the universe. Maintained by journalist and researcher Danilo Albergaria, it features news, interviews, and analyses with a special focus on Brazilian research.

## Technology Stack

- **Frontend**: Astro 5 (React for interactive components)
- **Styling**: Tailwind CSS v4
- **Backend**: Appwrite Cloud (Auth, Database, Storage)
- **Language**: TypeScript
- **Testing**: Vitest (Unit), Playwright (E2E)
- **Deployment**: Appwrite Sites / Node.js compatible

## Project Structure (Astro)

### Core Routes

- `/`: Homepage with featured articles and latest news.
- `/artigos`: Full listing of articles with filters.
- `/artigos/[slug]`: Article reading page.
- `/categorias/[category]`: Article listing by category.
- `/sobre`: Biography and author mission.
- `/admin`: Administrative area (Login, Dashboard, Article Management).

### API Routes

- `/api/auth/*` - Authentication handlers.
- `/api/admin/*` - Admin-only data operations.
- `/api/upload` - Image upload to Appwrite storage.

## Key Features

### Multi-language Support (i18n)

- **Relational i18n**: Master articles are linked to language-specific translation documents.
- **Dynamic Content**: Articles can be published in multiple languages with independent slugs and metadata.

### Content Management

- Create, read, update, delete articles with multi-language support.
- Rich text editor (Tiptap).
- Upload and manage featured images.
- Publish/draft status management.

---

**Status**: Stable - Migrated to Astro
**Last Updated**: 2026-05-13
**Maintainer**: Danilo Albergaria
