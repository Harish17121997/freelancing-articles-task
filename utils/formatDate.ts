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

export function formatPublishedAt(date: Date | null): string | null {
  if (!date) return null
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date)
}
