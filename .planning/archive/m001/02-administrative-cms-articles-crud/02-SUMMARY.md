# Phase 2 Summary: Administrative CMS (Articles CRUD)

## Goal Achievement

- **Authentication**: Secure admin area implemented using Google OAuth2 and server-side session guards.
- **Article Management**: Full CRUD interface for articles with status tracking and deletion.
- **Rich Text Editor**: Integrated Tiptap editor with support for formatting, headings, and lists.
- **Image Integration**: Real-time image upload to Appwrite Storage for both featured images and content-embedded images.
- **UX/UI**: Modern, responsive admin shell with Svelte 5 runes for state management and Sonner-ready notification flow.

## Key Decisions

- **Tiptap Integration**: Used `@tiptap/core` and `StarterKit` with Svelte 5 `$state` for a high-performance editor without heavy wrappers.
- **OAuth Only**: Prioritized Google login for security and simplicity in the administration flow.
- **Prose Styling**: Leveraged Tailwind Typography for a consistent "New Scientist" aesthetic even in the administrative preview.

## Deviations & Notes

- **Direct Appwrite Storage**: Bypassed URL-based images to use proper Appwrite bucket IDs, improving asset management.
- **Slug Generation**: Implemented client-side auto-slug generation with manual override support.

## Phase Acceptance Criteria

- [x] Admin routes are protected by a server-side auth guard.
- [x] Article list correctly fetches and displays documents from Appwrite.
- [x] Article editor supports rich text and image uploads.
- [x] Slugs are auto-generated and editable.
- [x] Notifications (Sonner) confirm success/failure of actions.

**Phase Verified: 2026-04-19**
