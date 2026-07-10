/**
 * The mock API has no per-article identifier, only a `url`. We derive a
 * stable, URL-safe id from that url (base64url) instead of using the
 * array index, which would break as soon as ordering or filtering changes.
 */

function base64UrlEncode(input: string): string {
  const base64 = typeof window === 'undefined' ? Buffer.from(input, 'utf-8').toString('base64') : window.btoa(unescape(encodeURIComponent(input)))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(input.length + ((4 - (input.length % 4)) % 4), '=')
  return typeof window === 'undefined' ? Buffer.from(padded, 'base64').toString('utf-8') : decodeURIComponent(escape(window.atob(padded)))
}

export function encodeArticleId(sourceUrl: string): string {
  return base64UrlEncode(sourceUrl)
}

export function decodeArticleId(id: string): string | null {
  try {
    return base64UrlDecode(id)
  } catch {
    return null
  }
}
