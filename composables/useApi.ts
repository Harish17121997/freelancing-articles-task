import { ApiErrorKind, type ApiResult, type AppError } from '~/types'

/**
 * Thin, typed wrapper around Nuxt's native `useFetch`.
 *
 * This is the *only* place in the app allowed to call `useFetch` directly.
 * Every composable that needs data goes through `apiFetch`, which:
 *  - keeps SSR-safe caching/dedupe behaviour of `useFetch` intact
 *  - normalizes every failure mode into an `AppError` the UI can render
 *  - never throws, so callers can rely on a plain `{ data, error }` shape
 */
export function useApi() {
  async function apiFetch<T>(url: string, key?: string): Promise<ApiResult<T>> {
    const { data, error, status } = await useFetch<T>(url, {
      // Native useFetch dedupes/reuses this key across server and client,
      // avoiding a duplicate client-side request after SSR hydration.
      key: key ?? url
    })

    if (error.value) {
      return { data: null, error: toAppError(error.value) }
    }

    if (status.value === 'error' || data.value === null || data.value === undefined) {
      return {
        data: null,
        error: {
          kind: ApiErrorKind.InvalidResponse,
          message: 'The server returned an unexpected or empty response.'
        }
      }
    }

    return { data: data.value as T, error: null }
  }

  function toAppError(error: unknown): AppError {
    const fetchError = error as { statusCode?: number; message?: string } | null

    const httpStatus = fetchError?.statusCode
    if (httpStatus === 404) {
      return { kind: ApiErrorKind.NotFound, message: 'The requested resource was not found.', status: httpStatus }
    }
    if (typeof httpStatus === 'number' && httpStatus >= 500) {
      return { kind: ApiErrorKind.Network, message: 'The server is currently unavailable. Please try again shortly.', status: httpStatus }
    }
    if (typeof httpStatus === 'number') {
      return { kind: ApiErrorKind.Unknown, message: fetchError?.message ?? 'Something went wrong while fetching data.', status: httpStatus }
    }

    // No status code usually means a network-level failure (offline, DNS, CORS, timeout).
    return { kind: ApiErrorKind.Network, message: 'Could not reach the server. Check your connection and try again.' }
  }

  return { apiFetch }
}
