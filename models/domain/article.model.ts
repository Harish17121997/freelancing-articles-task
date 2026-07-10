/**
 * Domain model consumed by components, stores, and pages.
 * All "maybe missing" wire fields are resolved here into safe,
 * always-present values (with explicit `has*` flags where the
 * distinction still matters to the UI, e.g. whether to render an image).
 */
export interface Article {
  /** Stable, URL-safe identifier derived from the source URL. Never from array index. */
  id: string
  title: string
  description: string
  contentPreview: string
  sourceName: string
  author: string
  url: string
  imageUrl: string | null
  publishedAt: Date | null
  publishedAtLabel: string
}

/** Values substituted in the UI when the API omits a field. Centralized so copy stays consistent. */
export const ARTICLE_FALLBACKS = {
  title: 'Untitled article',
  description: 'No description was provided for this article.',
  author: 'Unknown author',
  sourceName: 'Unknown source',
  publishedAtLabel: 'Date unavailable'
} as const
