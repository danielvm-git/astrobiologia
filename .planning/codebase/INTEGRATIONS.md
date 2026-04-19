# Integrations

## Appwrite
The project uses Appwrite for authentication and database management.

### SDK Usage
- **Client-side**: Uses the `appwrite` package (configured in `src/lib/appwrite.ts`).
- **Server-side**: Uses `node-appwrite` for administrative tasks or SSR-level data fetching.

### Configuration
Based on `src/lib/appwrite.ts`, the following environment variables are likely required:
- `PUBLIC_APPWRITE_ENDPOINT`
- `PUBLIC_APPWRITE_PROJECT_ID`
- `APPWRITE_API_KEY` (for server-side operations)
- `PUBLIC_APPWRITE_DATABASE_ID`
- `PUBLIC_APPWRITE_COLLECTION_ID`

## Local Services
- **Dev Server**: Vite running on port 5173.
