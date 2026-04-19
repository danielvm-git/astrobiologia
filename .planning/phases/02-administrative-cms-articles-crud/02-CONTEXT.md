# Phase 2: Administrative CMS (Articles CRUD) - Context

**Gathered:** 2026-04-19
**Status:** Ready for planning
**Source:** Project Requirements

<domain>
## Phase Boundary
This phase focuses on the back-office capabilities of the Astrobiologia portal. It enables Danilo Albergaria to securely log in and manage (Create, Read, Update, Delete) scientific articles.

**Deliverables:**
- Login page at `/admin/login`.
- Administrative layout for the dashboard.
- Articles list view at `/admin/artigos`.
- Article editor (Create/Edit) with Rich Text and Image Upload.
- Secure routing (only authenticated users can access `/admin/*` except `/admin/login`).
</domain>

<decisions>
## Implementation Decisions

### Authentication
- Use Appwrite Email/Password sessions.
- Implement a simple "Login" form with error handling.
- Use a `+layout.server.ts` in the `/admin` group to protect routes.

### Article CRUD
- **List View**: A table or list showing all articles with status (Draft/Published) and edit/delete actions.
- **Editor**:
  - Fields: Title, Slug, Content (Rich Text), Excerpt, Category, Featured Image.
  - Slug generation: Auto-generate from Title.
  - Rich Text: Use a simple, lightweight library like [Tiptap](https://tiptap.dev/) or a clean textarea with markdown support.
  - Image Upload: Use the `uploadImage` helper from Phase 1.

### UI & UX
- **Dashboard Aesthetic**: Minimalist, clean, and productive. Focus on writing and management.
- **Components**: Utilize existing `components/ui` (shadcn-like) where appropriate.

### the agent's Discretion
- Specific Rich Text editor choice (preferring lightweight and easy to integrate).
- Layout of the article editor form.
- Confirmation modals for destructive actions (Delete).
</decisions>

<canonical_refs>
- [PROJECT.md](file:///Users/me/Sites/astrobiologia/.planning/PROJECT.md)
- [REQUIREMENTS.md](file:///Users/me/Sites/astrobiologia/.planning/REQUIREMENTS.md)
- `src/lib/appwrite.ts` — Auth and CRUD helpers.
</canonical_refs>

---
*Phase: 02-administrative-cms-articles-crud*
*Context gathered: 2026-04-19*
