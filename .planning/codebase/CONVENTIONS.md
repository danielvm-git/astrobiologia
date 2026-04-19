# Coding Conventions

## Language & Syntax
- **TypeScript**: Use strict typing where possible.
- **Svelte 5**: Prefer Runes (`$state`, `$derived`, `$props`) over Svelte 4 syntax.
- **ES Modules**: Standard `import`/`export` syntax.

## Styling
- **Utility-First**: Use Tailwind CSS for almost all styling.
- **Theme**: Uses a `theme-provider` for dark/light mode.
- **Naming**: BEM-like or semantic naming not strictly enforced due to utility-first approach, but component names should be PascalCase.

## File Naming
- **Components**: PascalCase (e.g., `ArticleCard.svelte`).
- **Routes**: SvelteKit standard (`+page.svelte`, `+layout.svelte`).
- **Logic**: camelCase (e.g., `utils.ts`).

## State Management
- Use Svelte 5 runes for component-local state.
- Use Svelte stores or Svelte 5 universal state for global/shared state.
