/**
 * Shared, app-wide types and enums.
 * Feature-specific data shapes live in `models/api` and `models/domain` instead.
 */

/** Lifecycle of any async resource fetched from the API. */
export enum RequestStatus {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error'
}

/** Discriminates *why* a request failed so the UI can react appropriately. */
export enum ApiErrorKind {
  Network = 'network',
  NotFound = 'not_found',
  InvalidResponse = 'invalid_response',
  Unknown = 'unknown'
}

/** Normalized application-level error. Never throw raw fetch errors past a composable. */
export interface AppError {
  kind: ApiErrorKind
  message: string
  status?: number
}

/** Generic wrapper mirroring how every composable in this app returns data. */
export interface ApiResult<T> {
  data: T | null
  error: AppError | null
}
