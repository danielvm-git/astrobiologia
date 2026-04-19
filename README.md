# Astrobiologia.com

A modern, feature-rich astrobiology blog and content management system built with SvelteKit and Appwrite.

## Features

- **Public Blog**: Homepage with featured articles, article listing, and detailed article pages
- **Admin CMS**: Full-featured content management system with authentication
- **Article Management**: Create, edit, and delete articles with rich content support
- **Search & Filtering**: Articles can be filtered by category and searched by keyword
- **Responsive Design**: Mobile-first design that works on all devices
- **SEO Optimized**: Meta tags, sitemap support, and semantic HTML

## Tech Stack

- **Frontend**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Appwrite (open-source backend-as-a-service)
- **Database**: Appwrite Collections

## Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Appwrite Cloud account or self-hosted Appwrite instance

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/astrobiologia.com.git
cd astrobiologia.com
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Configure Appwrite

1. Create an Appwrite Cloud account at https://cloud.appwrite.io
2. Create a new project
3. Create a database named `astrobiology_db`
4. Create a collection named `articles` with the following attributes:
   - `title` (String, Required)
   - `slug` (String, Required, Unique)
   - `description` (String, Required)
   - `content` (String, Required)
   - `category` (String, Required)
   - `tags` (String Array)
   - `status` (String, Required, Default: "draft")
   - `featured` (Boolean, Default: false)
   - `author` (String)
   - `featuredImage` (String)
   - `publishedAt` (DateTime)

5. Create an admin user in Appwrite

### 4. Set environment variables

Create a `.env.local` file in the root directory:

```env
VITE_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_API_KEY=your_api_key
VITE_DATABASE_ID=astrobiology_db
VITE_ARTICLES_COLLECTION_ID=articles
```

### 5. Run development server
```bash
pnpm dev
```

The site will be available at `http://localhost:5173`

## Admin Access

1. Go to `http://localhost:5173/admin/login`
2. Log in with your Appwrite admin credentials
3. Access the dashboard and manage articles

## Project Structure

```
src/
├── routes/
│   ├── +layout.svelte          # Root layout
│   ├── +page.svelte            # Homepage
│   ├── articles/
│   │   ├── +page.svelte        # Articles listing
│   │   └── [slug]/
│   │       └── +page.svelte    # Article detail
│   ├── about/
│   │   └── +page.svelte        # About page
│   └── admin/
│       ├── login/
│       │   └── +page.svelte    # Admin login
│       ├── dashboard/
│       │   └── +page.svelte    # Admin dashboard
│       └── articles/
│           ├── +page.svelte    # Articles management
│           ├── new/
│           │   └── +page.svelte # New article
│           └── [id]/edit/
│               └── +page.svelte # Edit article
├── lib/
│   ├── appwrite.ts            # Appwrite configuration
│   ├── components/            # Reusable components
│   └── stores/               # Svelte stores
└── app.css                   # Global styles
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set environment variables in Vercel project settings
4. Deploy

### Docker

```bash
docker build -t astrobiologia .
docker run -p 3000:3000 astrobiologia
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Contact

Created by Danilo Couto - [astrobiologia.com](https://astrobiologia.com)
