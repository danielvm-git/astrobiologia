<!-- generated-by: gsd-doc-writer -->
# Astrobiologia.com.br

A professional journalistic portal covering astrobiology, maintained by Danilo Albergaria. This project focuses on news, interviews, and Brazilian research regarding life in the universe.

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Current Status
**Phase 2: Administrative CMS (Articles CRUD)** - Currently implementing and polishing the content management system and article workflows.

## Tech Stack
- **Frontend**: [SvelteKit](https://kit.svelte.dev/) (Svelte 5 with Runes)
- **Backend**: [Appwrite Cloud](https://appwrite.io/) (Auth, Database, Storage)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Internationalization**: [Paraglide-JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) (Full i18n support)
- **Package Manager**: [pnpm](https://pnpm.io/)

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/daniloalbergaria/astrobiologia.git
   cd astrobiologia
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file and fill in your Appwrite Cloud credentials:
   ```bash
   cp .env.example .env
   ```
   *Note: You will need an Appwrite Cloud project, database, and collection IDs as specified in `.env.example`.*

## Quick Start

1. **Run the development server**:
   ```bash
   pnpm dev
   ```

2. **Open the application**:
   Navigate to `http://localhost:5173` in your browser.

3. **Access Admin Panel**:
   Go to `/admin/login` to access the CMS (requires valid Appwrite credentials).

## Usage Examples

### 1. Internationalization (i18n)
The project is fully multilingual. You can switch between languages using the `LanguageSwitcher` component or by navigating to locale-specific routes.
```svelte
<script>
  import { i18n } from '$lib/i18n';
</script>

<button onclick={() => i18n.setLanguage('en')}>English</button>
<button onclick={() => i18n.setLanguage('pt-br')}>Português</button>
```

### 2. Article Management
Articles are managed via the Admin CMS. Each article supports multiple translations stored in the `article_translations` collection in Appwrite.

### 3. Fetching Content
Articles are fetched using the Appwrite SDK with a custom join logic for translations.
```typescript
import { getPublishedArticles } from '$lib/appwrite';

// Fetch articles in English
const articles = await getPublishedArticles('en');
```

## Project Structure
- `src/routes`: SvelteKit routes including public portal and admin CMS.
- `src/lib/appwrite.ts`: Centralized Appwrite client and content helper functions.
- `src/lib/components`: Reusable UI components (ArticleCard, SearchBox, etc.).
- `messages/`: Translation files for Paraglide-JS.

## Deployment
The project is optimized for deployment on **Appwrite Sites** or similar static/SSR hosting platforms like Vercel. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## License
This project is licensed under the MIT License.
<!-- VERIFY: MIT license confirmed via existing README, though no LICENSE file exists in root. -->
