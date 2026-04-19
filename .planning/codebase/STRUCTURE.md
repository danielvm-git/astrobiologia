# Project Structure

## Directory Layout
- **`.planning/`**: GSD planning and codebase documentation.
- **`components/`**: UI components (likely using shadcn/ui patterns).
  - `ui/`: Atom-level components (buttons, inputs, etc.).
- **`src/`**: Primary application source code.
  - **`lib/`**: Shared utilities and components.
    - `appwrite.ts`: Appwrite client configuration.
    - `components/`: Higher-level application components (Header, Footer, ArticleCard).
    - `stores/`: Svelte stores for global state.
  - **`routes/`**: File-based routing.
    - `admin/`: Back-office management.
    - `artigos/`: Article-related pages.
    - `categorias/`: Category filtering.
    - `sobre/`: About page.
    - `api/`: Backend endpoints.
- **`scripts/`**: Utility scripts (e.g., database population).

## Key Files
- `src/app.css`: Global styles (Tailwind 4).
- `src/app.html`: Root HTML template.
- `svelte.config.js`: Svelte configuration.
- `vite.config.ts`: Vite configuration.
