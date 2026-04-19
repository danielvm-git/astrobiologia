# Astrobiologia.com - Project Summary

## Overview

Astrobiologia.com is a comprehensive, modern astrobiology content platform built with SvelteKit and Appwrite Cloud. The site features a professional public-facing interface for reading articles and a secure admin CMS for content management.

## Technology Stack

- **Frontend**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Appwrite Cloud
- **Database**: Appwrite Database
- **Storage**: Appwrite Storage Buckets
- **Deployment**: Vercel-ready (or any Node.js host)

## Project Structure

### Public Pages
- **Homepage** (`/`) - Featured articles carousel + recent articles grid
- **Articles Listing** (`/articles`) - Searchable, filterable article grid with pagination
- **Article Detail** (`/articles/[slug]`) - Full article with meta tags and schema.org markup
- **Categories** (`/categories/[category]`) - Category-specific article browsing
- **About** (`/about`) - Information about Danilo Couto

### Admin Pages (Protected)
- **Admin Login** (`/admin/login`) - Secure authentication
- **Dashboard** (`/admin/dashboard`) - Overview and quick stats
- **Articles Management** (`/admin/articles`) - CRUD operations for articles
- **Article Editor** (`/admin/articles/new`, `/admin/articles/[id]/edit`) - Rich text editor with image upload

### API Routes
- `/api/articles/[id]/delete` - Delete articles via POST
- `/api/upload` - Image upload to Appwrite storage
- `/sitemap.xml` - Dynamic SEO sitemap
- `/robots.txt` - Search engine directives

## Key Features

### Content Management
- Create, read, update, delete articles
- Rich text editor with HTML support
- Upload and manage featured images
- Organize articles by category and tags
- Publish/draft status management

### Public Interface
- Responsive design (mobile-first)
- Fast page loads with SvelteKit SSR
- Advanced search and filtering
- Category browsing
- Related articles suggestions

### SEO
- Dynamic meta tags for each page
- Schema.org JSON-LD structured data
- Automatic sitemap generation
- robots.txt configuration
- Open Graph tags for social sharing
- Responsive meta images

### Security
- Appwrite authentication
- Protected admin routes
- Secure file uploads with validation
- Session-based authorization
- CSRF protection

## Database Schema

### articles Collection
```
{
  title: string,
  slug: string (unique),
  excerpt: string,
  content: string (HTML),
  category: string,
  tags: string[],
  featuredImage: string (URL),
  featured: boolean,
  status: "published" | "draft",
  author: string,
  publishedAt: datetime,
  createdAt: datetime,
  updatedAt: datetime
}
```

## Component Architecture

### Reusable Components
- `Header.svelte` - Navigation header with responsive menu
- `Footer.svelte` - Site footer with links and social
- `ArticleCard.svelte` - Article preview card for grids
- `ArticleEditor.svelte` - WYSIWYG article editor
- `SearchBox.svelte` - Search input component
- `Loading.svelte` - Loading spinner
- `NotFound.svelte` - 404 page component

### Stores
- `auth.ts` - Authentication state management

## Styling Approach

- **Color Palette**: 
  - Primary: Blue (`#2563eb`)
  - Neutrals: Slate grays (`#0f172a`, `#e2e8f0`)
  - Accents: Green for success states
  
- **Typography**:
  - Sans-serif for body and headings
  - Line height: 1.5-1.6 for readability
  
- **Layout**:
  - Flexbox for most layouts
  - CSS Grid for multi-column article layouts
  - Max width containers (1280px)

## Getting Started

### Development
```bash
# Install dependencies
pnpm install

# Create .env.local with Appwrite credentials
cp .env.example .env.local

# Start dev server
pnpm dev

# Open http://localhost:5174
```

### Admin Access
1. Set up admin user in Appwrite Console
2. Go to `/admin/login`
3. Enter credentials
4. Access `/admin/dashboard`

## Environment Variables Required

```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_API_KEY=your_api_key
VITE_APPWRITE_DATABASE_ID=astrobiology_db
VITE_APPWRITE_ARTICLES_COLLECTION_ID=articles
VITE_APPWRITE_STORAGE_BUCKET_ID=article_images
```

## Build & Deployment

### Build for Production
```bash
pnpm build
```

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy to Other Platforms
See `DEPLOYMENT.md` for detailed instructions for Netlify, Heroku, and self-hosted options.

## Performance Metrics

- **Lighthouse Score**: Target 90+
- **Time to First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## Future Enhancements

### Phase 2
- User comments and discussions
- Email newsletter subscription
- Reading time estimates
- Article recommendation engine
- Social sharing buttons

### Phase 3
- Multi-language support (Portuguese, English, Spanish)
- Learning paths and courses
- Gamification (badges, points)
- User profiles and saved articles
- Advanced search with filters

### Phase 4
- Podcast transcription integration
- Video content embedding
- Interactive visualizations
- Community forums
- Expert contributor profiles

## File Navigation Guide

```
astrobiologia/
├── src/
│   ├── app.html              # HTML template
│   ├── app.css               # Global styles
│   ├── app.d.ts              # TypeScript types
│   ├── lib/
│   │   ├── appwrite.ts       # Appwrite SDK initialization
│   │   ├── seo.ts            # SEO utilities
│   │   ├── utils.ts          # Helper functions
│   │   ├── components/       # Reusable Svelte components
│   │   └── stores/           # Svelte stores
│   └── routes/
│       ├── +page.svelte      # Homepage
│       ├── +layout.svelte    # Root layout
│       ├── articles/         # Article routes
│       ├── categories/       # Category routes
│       ├── about/            # About page
│       ├── admin/            # Admin routes (protected)
│       ├── api/              # API endpoints
│       └── sitemap.xml/      # SEO sitemap
├── .env.example              # Environment variables template
├── svelte.config.js          # SvelteKit configuration
├── vite.config.ts            # Vite configuration
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
├── README.md                 # Project overview
├── SETUP.md                  # Setup instructions
├── DEPLOYMENT.md             # Deployment guide
└── PROJECT_SUMMARY.md        # This file

```

## Support & Resources

- **SvelteKit Docs**: https://kit.svelte.dev
- **Appwrite Docs**: https://appwrite.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

## License

Open source project available under MIT License.

---

**Status**: Production Ready
**Last Updated**: 2024
**Maintainer**: Danilo Couto
