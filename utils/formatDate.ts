/**
 * Parses an ISO date string defensively and renders a short, readable label.
 * Returns null when the input is missing or unparsable so callers can fall
 * back to copy defined in one place (see ARTICLE_FALLBACKS).
 */
export function parsePublishedAt(value: string | null): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Short "24 Oct, 2021" style label used on article list cards. */
export function formatPublishedAt(date: Date | null): string | null {
  if (!date) return null
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * Relative "10h ago" style label used on the article detail page.
 * Falls back to the short absolute date once an article is more than a
 * week old, since "42d ago" stops being a useful unit at that point.
 */
export function formatRelativeTime(date: Date | null, now: Date = new Date()): string | null {
  if (!date) return null

  const diffMs = now.getTime() - date.getTime()
  if (diffMs < 0) return formatPublishedAt(date)

  if (diffMs < MINUTE) return 'Just now'
  if (diffMs < HOUR) return `${Math.floor(diffMs / MINUTE)}m ago`
  if (diffMs < DAY) return `${Math.floor(diffMs / HOUR)}h ago`

  const days = Math.floor(diffMs / DAY)
  if (days < 7) return `${days}d ago`

  return formatPublishedAt(date)
}
