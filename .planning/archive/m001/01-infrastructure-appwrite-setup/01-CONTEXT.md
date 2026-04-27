# Phase 1: Infrastructure & Appwrite Setup - Context

**Gathered:** 2026-04-19
**Status:** Ready for planning
**Source:** PRD Express Path (from user initial request)

<domain>
## Phase Boundary
This phase establishes the foundational infrastructure for the Astrobiologia portal. This includes the backend setup on Appwrite Cloud, the server-side integration in SvelteKit, and the global design system implementation using Tailwind 4.

**Deliverables:**

- Appwrite Cloud project configured (Database, Storage, Auth).
- SvelteKit environment variables and client configured for server-side operations.
- Global CSS and design tokens (colors, typography) established.
- Basic layout shell (Header/Footer) rendered.
  </domain>

<decisions>
## Implementation Decisions

### Appwrite Configuration

- **Auth**: Email/Password and Magic Link enabled.
- **Database**: Create a "Main" database with a "articles" collection (Schema to be finalized in this phase).
- **Storage**: Create a "media" bucket for article images (Public read, Private write).

### SvelteKit Integration

- Use `node-appwrite` for server-side logic in `+page.server.ts` and `+layout.server.ts`.
- Use the `appwrite` browser SDK for client-side interactions if needed.
- Store credentials in `.env` (not committed).

### Design System

- **Framework**: Tailwind CSS 4.
- **Aesthetics**: "New Scientist" inspired (Serif headlines, clean grids, premium scientific feel).
- **Typography**: Google Fonts (e.g., Playfair Display for headers, Inter for body).
- **Colors**: Deep blues, blacks, and crisp whites for a scientific space theme.

### the agent's Discretion

- Exact collection schema details (attributes).
- Specific Tailwind configuration for custom tokens.
- Header/Footer component structure.
  </decisions>

<canonical_refs>

## Canonical References

- [PROJECT.md](file:///Users/me/Sites/astrobiologia/.planning/PROJECT.md)
- [REQUIREMENTS.md](file:///Users/me/Sites/astrobiologia/.planning/REQUIREMENTS.md)
- [ROADMAP.md](file:///Users/me/Sites/astrobiologia/.planning/ROADMAP.md)
- `src/lib/appwrite.ts` — Existing client foundation.
  </canonical_refs>

---

_Phase: 01-infrastructure-appwrite-setup_
_Context gathered: 2026-04-19 via PRD Express Path_
