# Project Concerns & Technical Debt

## Critical Concerns
- **Missing Tests**: The project lacks automated testing, making it vulnerable to regressions during refactoring.
- **Environment Variables**: Ensure all sensitive Appwrite keys are correctly managed and not committed to source control.

## Technical Debt
- **Component Organization**: There is a mix of components in the root `components/` directory and `src/lib/components/`. Consolidating these into `src/lib/` (the SvelteKit standard) would improve maintainability.
- **Svelte 5 Transition**: Ensure all components are fully utilizing Svelte 5 patterns to avoid technical debt from deprecated Svelte 4 features.

## Potential Risks
- **Appwrite Connectivity**: Dependency on a third-party BaaS means network issues or Appwrite downtime can affect site availability.
- **SEO Optimization**: While `seo.ts` exists, continuous monitoring of meta tags and structured data is needed for a content-heavy portal.
