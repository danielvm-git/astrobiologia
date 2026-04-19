# Architecture

## Overview
The application follows a standard SvelteKit architecture with a focus on Server-Side Rendering (SSR) for SEO and performance, while using Appwrite as a headless backend.

## Key Patterns
- **Svelte 5 Runes**: The codebase utilizes Svelte 5's `$state`, `$derived`, and `$effect` for state management.
- **Server-Side Data Fetching**: Utilizes `+page.server.ts` and `+layout.server.ts` for fetching data from Appwrite during SSR.
- **Client-Side Hydration**: Interactive components are hydrated on the client.
- **Admin Section**: Dedicated `/admin` routes for content management.

## Data Flow
1. **Request**: User visits a route.
2. **Server Fetch**: `+page.server.ts` fetches data from Appwrite using `node-appwrite`.
3. **SSR**: SvelteKit renders the page on the server.
4. **Hydration**: Browser receives HTML and hydrates interactive components.
5. **Client Actions**: Subsequent interactions may use the browser-side `appwrite` SDK.
