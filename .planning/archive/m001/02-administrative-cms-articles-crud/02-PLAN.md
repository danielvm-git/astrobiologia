# Phase 2: Administrative CMS (Articles CRUD) - Plan

This phase builds the secure management area for the portal, allowing the author to publish and manage scientific articles.

## Wave 1: Authentication & Security

Secure the admin area and implement the login flow.

- **Task 1: Admin Login Page [type: execute]**
  - `<read_first>`: `src/lib/appwrite.ts`, `src/routes/+layout.svelte`
  - `<action>`: Create `src/routes/admin/login/+page.svelte` with a clean login form using the `login` helper from `$lib/appwrite`.
  - `<acceptance_criteria>`: `/admin/login` renders and successful login redirects to `/admin/artigos`.
- **Task 2: Server-Side Auth Guard [type: execute]**
  - `<read_first>`: `src/lib/appwrite.ts`
  - `<action>`: Create `src/routes/admin/+layout.server.ts` to check for an active session and redirect to `/admin/login` if not authenticated.
  - `<acceptance_criteria>`: Accessing `/admin/artigos` while logged out redirects to `/admin/login`.

## Wave 2: Dashboard & List View

Implement the administrative shell and article management list.

- **Task 3: Admin Layout & Navigation [type: execute]**
  - `<read_first>`: `components/ui/sidebar.tsx`, `src/routes/+layout.svelte`
  - `<action>`: Create `src/routes/admin/+layout.svelte` with a sidebar for "Artigos", "Configurações", and a "Sair" button.
  - `<acceptance_criteria>`: Admin pages share a consistent sidebar and header.
- **Task 4: Article Management List [type: execute]**
  - `<read_first>`: `src/lib/appwrite.ts`, `components/ui/table.tsx`
  - `<action>`: Create `src/routes/admin/artigos/+page.svelte` that fetches all articles and displays them in a table with Edit/Delete actions.
  - `<acceptance_criteria>`: `/admin/artigos` shows a list of articles from Appwrite.

## Wave 3: Article Editor

Implement the creation and editing interface.

- **Task 5: Article Editor Form [type: execute]**
  - `<read_first>`: `src/lib/appwrite.ts`, `components/ui/form.tsx`, `components/ui/input.tsx`
  - `<action>`: Create `src/routes/admin/artigos/novo/+page.svelte` and `src/routes/admin/artigos/[id]/+page.svelte` with fields for Title, Slug, Excerpt, Category, and Status.
  - `<acceptance_criteria>`: Form handles state using Svelte 5 runes and auto-generates slug from title.
- **Task 6: Rich Text & Image Integration [type: execute]**
  - `<read_first>`: `src/lib/appwrite.ts`
  - `<action>`: Integrate a simple Tiptap-based editor for the content field and implement image upload to the Appwrite `images` bucket.
  - `<acceptance_criteria>`: Editor allows basic formatting and images are correctly uploaded and previewed.

## Wave 4: Verification

- **Task 7: CMS UAT [type: execute]**
  - `<read_first>`: `src/lib/appwrite.ts`
  - `<action>`: Perform end-to-end test: Login -> Create Draft -> Upload Image -> Publish -> Verify on List -> Delete.
  - `<acceptance_criteria>`: All actions complete without errors and state is reflected in Appwrite.

## Verification Criteria

- [ ] Admin routes are protected by a server-side auth guard.
- [ ] Article list correctly fetches and displays documents from Appwrite.
- [ ] Article editor supports rich text and image uploads.
- [ ] Slugs are auto-generated and editable.
- [ ] Notifications (Sonner) confirm success/failure of actions.

## Must-Haves

- Secure auth flow.
- Functional CRUD for articles.
- Responsive admin interface.
- Appwrite Storage integration for images.
