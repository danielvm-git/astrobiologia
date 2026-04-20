<!-- generated-by: gsd-doc-writer -->
# Astrobiologia.com.br Setup Guide

This guide explains how to set up the project locally for development.

## Prerequisites

- **Node.js**: >= 20.0.0
- **Package Manager**: npm (mandatory)
- **Appwrite Cloud**: An account at [cloud.appwrite.io](https://cloud.appwrite.io)

## Local Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd astrobiologia
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Compile i18n messages**:
    The project uses Paraglide-js for internationalization. While the Vite plugin handles compilation during development, you should run the initial compilation:
    ```bash
    npx paraglide-js compile --project ./project.inlang
    ```

## Environment Configuration

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```

2.  Fill in your **Appwrite Cloud** credentials in `.env`:
    - `PUBLIC_APPWRITE_ENDPOINT`: Usually `https://cloud.appwrite.io/v1`
    - `PUBLIC_APPWRITE_PROJECT_ID`: Your Appwrite project ID.
    - `APPWRITE_API_KEY`: An API key with full permissions (Database, Collections, Attributes, Indexes, Storage, Users).
    - `APPWRITE_ADMIN_EMAIL`: The email for your admin user.
    - `APPWRITE_ADMIN_PASSWORD`: The password for your admin user.

    *Note: The project uses `PUBLIC_` prefix for variables that need to be accessible to the frontend.*

## Appwrite Infrastructure Setup

The project includes automated scripts to set up the database schema and storage.

### 1. Initial Infrastructure Setup
This script creates the database, the `articles` collection, required attributes, indexes, and the admin user.
```bash
node scripts/setup-appwrite.js
```

### 2. Update Schema for i18n
If you are upgrading an existing installation or after the initial setup, run the i18n schema update script to create the `article_translations` collection and add multi-language fields:
```bash
node scripts/update-schema-i18n.js
```

### 3. Migrating Content (Optional)
If you have existing articles that need to be moved to the new i18n structure:
```bash
node scripts/migrate-articles-i18n.js
```

## Development

Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5173`.

### i18n Workflow
- Source messages are located in `messages/` (JSON files).
- The Inlang project configuration is in `project.inlang/`.
- Compiled runtime is generated in `src/lib/paraglide/`.
- To add a new language, update `project.inlang/settings.json` and add the corresponding JSON file in `messages/`.

## Quality Checks

Run the full preflight check before committing:
```bash
npm run preflight
```
This command runs: `npm install`, `npm run check` (Svelte-check), `npm run test`, and `npm run build`.

## Troubleshooting

### Appwrite Permission Denied
Ensure your `APPWRITE_API_KEY` has the following scopes:
- `databases.read`, `databases.write`
- `collections.read`, `collections.write`
- `attributes.read`, `attributes.write`
- `indexes.read`, `indexes.write`
- `files.read`, `files.write`
- `users.read`, `users.write`

### Paraglide compilation errors
If you see errors related to `$lib/paraglide`, ensure you have run:
```bash
npx paraglide-js compile --project ./project.inlang
```

### Database ID mismatch
The scripts default to specific IDs. If you prefer to use your own, ensure `PUBLIC_DATABASE_ID` and `PUBLIC_ARTICLES_COLLECTION_ID` are set in your `.env` file.

## Next Steps

- For production deployment instructions, see **DEPLOYMENT.md**.
- To understand the overall system structure, see **PROJECT_SUMMARY.md**.
