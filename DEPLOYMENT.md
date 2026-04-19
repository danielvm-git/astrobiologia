# Deployment Guide for Astrobiologia.com

## Prerequisites

Before deploying, ensure:
1. All environment variables are set correctly
2. Appwrite Cloud project is set up
3. Database and collections are created
4. Storage bucket is configured
5. All files are committed to git

## Deployment to Vercel

### Step 1: Connect GitHub Repository
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Select your GitHub repository
5. Click "Import"

### Step 2: Configure Environment Variables
In the Vercel project settings:
1. Go to "Settings" → "Environment Variables"
2. Add all variables from `.env.example`:
   - `VITE_APPWRITE_ENDPOINT`
   - `VITE_APPWRITE_PROJECT_ID`
   - `VITE_APPWRITE_API_KEY`
   - `VITE_APPWRITE_DATABASE_ID`
   - `VITE_APPWRITE_ARTICLES_COLLECTION_ID`
   - `VITE_APPWRITE_STORAGE_BUCKET_ID`

### Step 3: Deploy
1. Set the Build Command to: `pnpm build`
2. Set the Output Directory to: `build`
3. Click "Deploy"

Vercel will automatically deploy when you push to main branch.

## Deployment to Other Platforms

### Netlify
1. Connect your GitHub repository
2. Build command: `pnpm build`
3. Publish directory: `build`
4. Add environment variables in Netlify UI
5. Deploy

### Heroku
```bash
heroku create astrobiologia
heroku config:set VITE_APPWRITE_ENDPOINT=...
heroku config:set VITE_APPWRITE_PROJECT_ID=...
# Add all other variables
git push heroku main
```

### Self-Hosted (Docker)
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["node", "build/index.js"]
```

Build and run:
```bash
docker build -t astrobiologia .
docker run -p 3000:3000 -e VITE_APPWRITE_ENDPOINT=... astrobiologia
```

## Post-Deployment Checklist

- [ ] Test homepage loads correctly
- [ ] Articles display properly
- [ ] Images load from Appwrite
- [ ] Admin login works
- [ ] Can create/edit articles
- [ ] Sitemap generates at `/sitemap.xml`
- [ ] robots.txt is accessible
- [ ] Meta tags appear in page source
- [ ] Email newsletter signup works (if configured)

## Monitoring

### Error Tracking
Consider adding error tracking:
1. [Sentry](https://sentry.io) - Error monitoring
2. [LogRocket](https://logrocket.com) - Session replay
3. [Bugsnag](https://bugsnag.com) - Error reports

### Analytics
1. [Vercel Analytics](https://vercel.com/analytics) - Built-in
2. [Google Analytics](https://analytics.google.com)
3. [Plausible](https://plausible.io) - Privacy-focused
4. [Fathom](https://usefathom.com) - Simple analytics

### Uptime Monitoring
1. [Pingdom](https://www.pingdom.com)
2. [StatusPage](https://www.atlassian.com/software/statuspage)
3. [Uptime Robot](https://uptimerobot.com)

## Performance Optimization

### Image Optimization
- Use webp format for images
- Implement lazy loading
- Set appropriate image sizes
- Use responsive images with srcset

### Caching Strategy
- Static pages cache for 1 year
- Articles cache for 1 day
- API responses cache for 1 hour

### CDN Configuration
- Enable Vercel's Edge Network
- Set proper cache headers in `svelte.config.js`

## Security

### SSL/TLS
- Automatically configured on Vercel
- Always use HTTPS in production

### Environment Variables
- Never commit `.env.local` to git
- Use `.env.example` for documentation
- Rotate API keys regularly
- Use limited-scope API keys

### CORS Configuration
In Appwrite Console:
- Set allowed origins to your domain
- Disable public access to sensitive endpoints
- Use JWT tokens for API requests

## Rollback Procedure

### Vercel
1. Go to Deployments tab
2. Click on previous deployment
3. Click "Redeploy"

### GitHub
1. Revert commit: `git revert <commit>`
2. Push to main
3. Wait for automatic redeploy

## Updating Content

### Adding Articles
1. Go to `/admin/dashboard`
2. Click "New Article"
3. Fill in details
4. Upload featured image
5. Save as draft or publish
6. Share permalink

### Updating Articles
1. Go to `/admin/articles`
2. Click "Edit" on article
3. Make changes
4. Save

### Creating Categories
Add categories in Appwrite Console or via API before use in editor.

## Support & Maintenance

### Regular Tasks
- [ ] Back up database weekly
- [ ] Monitor error logs
- [ ] Update dependencies monthly
- [ ] Review analytics
- [ ] Check broken links

### Backup Strategy
- Use Appwrite's export feature
- Store backups in cloud storage
- Test restore procedures

For more help, visit:
- [Vercel Docs](https://vercel.com/docs)
- [SvelteKit Docs](https://kit.svelte.dev/docs/introduction)
- [Appwrite Docs](https://appwrite.io/docs)
