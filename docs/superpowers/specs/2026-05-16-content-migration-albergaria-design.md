# Design Spec: Danilo Albergaria Content Migration

## Overview

Transform the current dummy scientific platform into a professional Science Journalism portfolio by replacing all existing dummy data with real, high-quality articles authored by Danilo Albergaria.

## Goals

1.  **Purge**: Remove all current articles, translations, and featured images from the Appwrite database and storage.
2.  **Import**: Extract and import 12 professional science journalism pieces from verified sources.
3.  **Integrity**: Maintain the existing database schema and category relationships.
4.  **Aesthetics**: Ensure each article has its original featured image hosted on Appwrite.

## Content Sources

- Revista Pesquisa FAPESP (Primary source for physics and history of science).
- ComCiência (Philosophy and social impacts of science).
- Fundação Conrado Wessel (Astrobiology and scientific culture).

## Execution Strategy

### Phase 1: Purge (The "Great Reset")

- **Target Collections**: `articles`, `article_translations`.
- **Target Storage**: `featured_images` bucket (ID: `PUBLIC_STORAGE_BUCKET_ID`).
- **Action**: Iterative deletion of all existing documents and files to ensure a clean slate.

### Phase 2: High-Fidelity Extraction

For each of the 12 identified URLs:

- **Extraction**: Use `web_fetch` to retrieve the full article body (HTML/Markdown).
- **Formatting**: Clean the content for the Tiptap editor (removing ads, navbars, and sidebars).
- **Metadata**: Extract the original slug, publication date, and featured image URL.

### Phase 3: Asset & Database Insertion

1.  **Image Upload**: Download the original image and upload to the Appwrite `featured_images` bucket.
2.  **Master Article**: Create a record in the `articles` collection:
    - Set `featured` status based on the article's importance.
    - Map to categories: `noticias`, `analises`, `exoplanetas`, `extremofilos`, `entrevistas`, `pesquisas-brasileiras`.
3.  **Translation Entry**: Create a record in `article_translations`:
    - `language`: `pt-br` (preserving the original Portuguese).
    - `content`: The full cleaned body.
    - `slug`: The original professional slug.

## Data Mapping (Preview)

| Category                | Source Article Topic                          |
| :---------------------- | :-------------------------------------------- |
| `noticias`              | Site comemorativo Fritz Müller                |
| `analises`              | Ameaça à etnobotânica                         |
| `exoplanetas`           | Tantos sóis, tantos mundos                    |
| `extremofilos`          | (Reserved for specific extreme life articles) |
| `pesquisas-brasileiras` | Costa Ribeiro e a cera de carnaúba            |

## Technical Implementation Notes

- The migration will be performed via a specialized agent script.
- Environment variables (`DATABASE_ID`, `COLLECTION_ID`) will be sourced using the robust `getEnv` helper.
- Rate limiting will be applied during Appwrite uploads to ensure stability.

## Success Criteria

- The `/artigos` page displays 12 real, professional articles.
- All dummy data is 100% removed.
- Article images load correctly from the Appwrite bucket.
- The site search correctly indexes the new content.
