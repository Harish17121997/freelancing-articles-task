import type { ApiArticle } from '~/models/api/article.model'
import { ARTICLE_FALLBACKS, type Article } from '~/models/domain/article.model'
import { encodeArticleId } from '~/utils/articleId'
import { formatPublishedAt, formatRelativeTime, parsePublishedAt } from '~/utils/formatDate'

/**
 * Strips the "[+1234 chars]" / lorem-ipsum truncation suffix the mock API
 * appends to `content`, so the UI never renders that artifact.
 */
function cleanContent(content: string | null): string {
  if (!content) return ''
  return content.replace(/\s*\[\+\d+\s*chars?].*$/is, '').trim()
}

/**
 * An article with no usable url can't be linked to or given a stable id,
 * so it is filtered out upstream rather than mapped. Every other missing
 * field gets a safe, explicit fallback instead of leaking `null`/`undefined`
 * into templates.
 */
export function mapApiArticleToDomain(raw: ApiArticle): Article | null {
  const url = raw.url?.trim()
  if (!url) return null

  const publishedAt = parsePublishedAt(raw.publishedAt)
  const content = cleanContent(raw.content)

  return {
    id: encodeArticleId(url),
    title: raw.title?.trim() || ARTICLE_FALLBACKS.title,
    description: raw.description?.trim() || ARTICLE_FALLBACKS.description,
    contentPreview: content || raw.description?.trim() || ARTICLE_FALLBACKS.description,
    sourceName: raw.source?.name?.trim() || ARTICLE_FALLBACKS.sourceName,
    author: raw.author?.trim() || ARTICLE_FALLBACKS.author,
    url,
    imageUrl: raw.urlToImage?.trim() ? raw.urlToImage.trim() : null,
    publishedAt,
    publishedAtLabel: formatPublishedAt(publishedAt) ?? ARTICLE_FALLBACKS.publishedAtLabel,
    publishedAtRelativeLabel: formatRelativeTime(publishedAt) ?? ARTICLE_FALLBACKS.publishedAtLabel
  }
}

export function mapApiArticlesToDomain(rawArticles: ApiArticle[]): Article[] {
  return rawArticles.reduce<Article[]>((acc, raw) => {
    const mapped = mapApiArticleToDomain(raw)
    if (mapped) acc.push(mapped)
    return acc
  }, [])
}
