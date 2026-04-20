<!-- generated-by: gsd-doc-writer -->
# Database Schema

This document describes the Appwrite database structure for the Astrobiologia.com.br project. The schema is optimized for a multi-language journalistic portal, separating article metadata from localized content.

## Articles Collection (Master)

The `articles` collection is the primary source of truth for an article's existence, metadata, and shared properties (such as categorization and featured status).

**Collection ID:** `articles`

### Attributes

| Key | Type | Size/Format | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `title` | String | 255 | Yes | - | Legacy/Fallback title |
| `slug` | String | 255 | Yes | - | Legacy/Fallback URL slug |
| `excerpt` | String | 1000 | Yes | - | Legacy/Fallback summary |
| `content` | String | 1,000,000 | Yes | - | Legacy/Fallback content (Markdown) |
| `category` | String | 100 | Yes | - | Category slug (e.g., `noticias`) |
| `authorId` | String | 255 | Yes | - | Appwrite User ID of the author |
| `authorName` | String | 255 | Yes | - | Display name of the author |
| `status` | Enum | `draft`, `published` | Yes | - | Current publication state |
| `featured` | Boolean | - | Yes | - | Whether the article is highlighted on home |
| `publishedAt` | Datetime | - | No | - | Official publication timestamp |
| `featuredImage` | String | 255 | No | - | Appwrite Storage file ID for main image |
| `featuredImageAlt` | String | 255 | No | - | Accessibility text for the image |
| `tags` | String Array | 100 | No | - | List of keywords for indexing |
| `metaTitle` | String | 255 | No | - | SEO Title fallback |
| `metaDescription` | String | 500 | No | - | SEO Description fallback |
| `language` | String | 10 | No | `pt-br` | Source language of the master record |
| `translationId` | String | 255 | No | - | Identifier for the translation group |

### Indexes

| Name | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `slug_index` | Unique | `slug` | Ensures unique fallback URLs |
| `status_index` | Key | `status` | Optimized filtering for public vs draft |

---

## Article Translations Collection (Child)

The `article_translations` collection stores the localized versions of article content. Every public-facing article typically has entries here for each supported language.

**Collection ID:** `article_translations`

### Attributes

| Key | Type | Size/Format | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `article_id` | String | 255 | Yes | Reference to the master `articles` document ID |
| `language` | String | 10 | Yes | ISO language code (e.g., `pt-br`, `en`) |
| `title` | String | 255 | Yes | Localized article title |
| `slug` | String | 255 | Yes | Localized URL slug |
| `excerpt` | String | 1000 | No | Localized summary |
| `content` | String | 1,000,000 | Yes | Localized full content (Markdown) |
| `metaTitle` | String | 255 | No | Localized SEO Title |
| `metaDescription` | String | 500 | No | Localized SEO Description |

### Indexes

| Name | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `slug_index` | Unique | `slug` | Ensures unique URLs within the portal |
| `article_lang_index` | Unique | `article_id`, `language` | Prevents duplicate translations for the same article |

---

## Storage Buckets

### Images Bucket
- **ID:** `images`
- **Permissions:** Public Read (`read("any")`)
- **Usage:** Stores all featured images and media assets used within articles.

---

## Data Relationships

- **Articles → Article Translations**: 1:N relationship. One master record can have multiple translations.
- **Join Logic**: The application fetches the master article and then joins the specific translation based on the user's active locale and the `article_id` link.
- **Fallback Logic**: If no translation is found for the requested language, the application may fallback to the legacy fields in the master `articles` record.
