/**
 * Raw shapes exactly as returned by the mock articles API.
 * These intentionally mark most fields as nullable/optional: the challenge
 * spec calls out incomplete/inconsistent data, and the live payload does
 * in fact omit `author`, `urlToImage`, `description`, and `source.id` on
 * some items. Never trust the wire format further than this.
 */

export interface ApiArticleSource {
  id: string | null
  name: string | null
}

export interface ApiArticle {
  source: ApiArticleSource | null
  author: string | null
  title: string | null
  description: string | null
  url: string | null
  urlToImage: string | null
  publishedAt: string | null
  content: string | null
}

export interface ApiArticlesResponse {
  status: string
  totalResults: number
  articles: ApiArticle[]
}
