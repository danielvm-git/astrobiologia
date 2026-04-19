# Astrobiologia.com Setup Guide

## Prerequisites

- Node.js 18+ and pnpm
- An Appwrite Cloud account

## Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Appwrite Cloud Setup

### 1. Create an Appwrite Cloud Project
- Go to [Appwrite Cloud](https://cloud.appwrite.io)
- Create a new project
- Note your Project ID and API Key

### 2. Create Database and Collections
In your Appwrite Console:

1. Create a Database named: `astrobiology_db`
2. Create a Collection: `articles`

Add these attributes to the articles collection:
- `title` (String, required, max 255)
- `slug` (String, required, unique, max 255)
- `excerpt` (String, required, max 500)
- `content` (String, required, for rich text HTML)
- `category` (String, required)
- `tags` (String array)
- `featuredImage` (String, URL to image)
- `featured` (Boolean, default: false)
- `status` (String, enum: published/draft, default: draft)
- `author` (String, default: "Danilo Couto")
- `publishedAt` (DateTime)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### 3. Create Storage Bucket
In Appwrite Console:
1. Go to Storage
2. Create a bucket named: `article_images`
3. Set permissions to allow uploads from authenticated users

### 4. Create Admin User
Use Appwrite Console to create an admin user account.

## Environment Configuration

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Appwrite credentials:
```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_API_KEY=your_api_key
VITE_APPWRITE_DATABASE_ID=astrobiology_db
VITE_APPWRITE_ARTICLES_COLLECTION_ID=articles
VITE_APPWRITE_STORAGE_BUCKET_ID=article_images
```

## Development

Start the development server:
```bash
pnpm dev
```

Open http://localhost:5173 in your browser.

## File Structure

```
src/
├── lib/
│   ├── appwrite.ts          # Appwrite client configuration
│   ├── seo.ts               # SEO utilities
│   ├── utils.ts             # Helper functions
│   ├── components/          # Reusable components
│   └── stores/              # Svelte stores
├── routes/
│   ├── +layout.svelte       # Root layout
│   ├── +page.svelte         # Homepage
│   ├── articles/            # Public articles pages
│   ├── categories/          # Category pages
│   ├── about/               # About page
│   ├── admin/               # Admin panel (protected)
│   ├── api/                 # API routes
│   └── sitemap.xml/         # SEO sitemap
└── app.css                  # Global styles
```

## Admin Panel

1. Navigate to `/admin/login`
2. Log in with your admin credentials
3. Access article management at `/admin/dashboard`

### Features
- Create, edit, delete articles
- Upload featured images
- Preview articles
- Manage article status (published/draft)
- Add tags and categories

## Deployment

### To Vercel
1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel project settings
4. Deploy

### To Other Platforms
Configure your hosting to:
1. Use Node.js 18+
2. Run `pnpm build` during build
3. Set environment variables
4. Start with `node build/index.js`

## SEO Features

- Automatic sitemap generation at `/sitemap.xml`
- robots.txt configuration at `/robots.txt`
- Dynamic meta tags for articles
- Schema.org structured data
- Open Graph tags for social sharing

## Troubleshooting

### Articles not loading
- Verify Appwrite credentials in `.env.local`
- Check that database and collection IDs match your setup
- Ensure articles exist and have `status = "published"`

### Images not uploading
- Verify storage bucket permissions
- Check that bucket ID is correct in environment variables
- Ensure file size is within limits

### Admin login not working
- Verify user exists in Appwrite Console
- Check email and password are correct
- Ensure API key has appropriate permissions

## Support

For issues with Appwrite, visit: https://appwrite.io/docs
For SvelteKit documentation: https://kit.svelte.dev

## License

This project is open source and available under the MIT License.
