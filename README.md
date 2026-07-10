# News Explorer

A server-side rendered Nuxt 3 application that fetches articles from a mock
API and presents them resiliently — through missing fields, empty datasets,
and outright API failures.

Built for the Web Developer Challenge (Fishermen Services and Solutions).

## 1. Project setup instructions

**Requirements:** Node.js 20.x+ (the Nuxt 3 CLI relies on a `node:util` export
that Node 18 doesn't have), npm.

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (SSR, Nitro node-server preset)
npm run preview    # run the production build locally
npm run typecheck  # strict TypeScript check via vue-tsc
```

**Configuration.** The API base URL is a runtime-config value, not a
hardcoded string, so it can be swapped without touching code:

```bash
cp .env.example .env
# NUXT_PUBLIC_ARTICLES_API_URL=https://mocki.io/v1/38c57ea8-5688-4a36-9629-8c9616754eb8
```

If unset, it defaults to the URL given in the challenge brief (see
`nuxt.config.ts`).

## 2. Project structure

```
components/
  ui/          Pure, app-agnostic UI primitives (BaseButton, BaseSkeleton,
               BaseSpinner, BaseBadge). No app/business knowledge — could be
               dropped into any project unchanged.
  common/      Feature components that know about `Article`: AppHeader,
               ArticleCard, ArticleCardSkeleton, ArticleGrid, ErrorState,
               EmptyState.
composables/
  useApi.ts        Centralized API communication. The ONLY file allowed to
                   call `useFetch` directly. Normalizes every failure into
                   an `AppError`.
  useArticles.ts   Feature composable: fetches + maps articles, exposes
                   typed methods (`fetchArticles`, `findArticleById`).
models/
  api/         Raw shapes exactly as the wire sends them (nullable fields).
  domain/      UI-friendly `Article` model with fallbacks already resolved.
pages/
  index.vue           Article list (SSR, loading/empty/error states).
  articles/[id].vue   Article detail (SSR, 404-safe).
stores/
  articles.store.ts   Pinia store: shared list state + status, so navigating
                       list -> detail -> list doesn't re-fetch.
utils/
  articleId.ts     Pure: derive a stable, URL-safe id from an article URL.
  formatDate.ts    Pure: parse/format `publishedAt` defensively.
  mapArticle.ts    Pure: ApiArticle -> Article mapping with fallbacks.
types/
  index.ts     Shared enums (`RequestStatus`, `ApiErrorKind`) and the
               `AppError` / `ApiResult<T>` contracts every composable returns.
```

## 3. API & composables strategy

- **`useApi.ts`** wraps Nuxt's native `useFetch` once, in one place. It
  passes an explicit `key` (the URL) so the SSR payload is reused on the
  client instead of re-fetching after hydration, and it never throws —
  every outcome comes back as `{ data, error }`, with `error` already
  classified into `ApiErrorKind` (`network`, `not_found`, `invalid_response`,
  `unknown`).
- **`useArticles.ts`** is the only thing that knows the mock API's shape.
  It calls `useApi`, validates the response actually has an `articles`
  array, and maps every item through `mapApiArticleToDomain` before
  handing anything to a page or store. Pages and components never see
  `ApiArticle`, `useFetch`, or a raw fetch error.
- Pages never call `useFetch`/`$fetch` directly — that's a hard rule of
  the challenge and it's enforced structurally: the only import of
  `useFetch` in the codebase is inside `useApi.ts`.

## 4. Typing & modeling decisions

- **Two-model split (`api` vs `domain`).** The raw `ApiArticle` mirrors the
  wire format exactly, including everywhere it can be `null` — because in
  the live payload, `author`, `urlToImage`, `description`, and `source.id`
  really are sometimes missing. The domain `Article` is what components
  render: every field is either a real value or a named, centralized
  fallback (`ARTICLE_FALLBACKS`), so no template ever has to write
  `article.author ?? 'Unknown'` inline.
- **No `any` anywhere** (`strict: true` in `nuxt.config.ts`, plus
  `noUncheckedIndexedAccess`). `npm run typecheck` is clean.
- **Stable ids without a real API endpoint.** The mock API has no article
  id, only a `url`. Using the array index as an id would break the moment
  ordering or filtering changes, and would make `/articles/2` a silently
  wrong link if the list is later paginated or sorted. Instead,
  `utils/articleId.ts` base64url-encodes the article's own `url` into a
  route-safe id, and the detail page decodes-by-matching against the
  fetched list.
- **`AppError` / `ApiResult<T>`** give every composable the same
  discriminated-union-ish return shape, so `ErrorState.vue` can render
  appropriately worded copy per `ApiErrorKind` instead of a single generic
  "error occurred" message everywhere.

## 5. Error-handling approach

- `useApi.ts` classifies failures (HTTP 404, 5xx, other status codes, or a
  connection-level failure with no status at all) into an `AppError` with
  a short, user-facing `message` — never a raw stack trace or fetch
  exception reaches a template.
- Pages branch on `store.isLoading` / `store.hasError` / `store.isEmpty`
  and render `ArticleCardSkeleton`, `ErrorState`, or `EmptyState`
  accordingly; the "happy path" grid is the final `v-else`, so there's no
  way to reach it with incomplete data.
- The article detail page treats "id not found in the list" as its own
  not-found `AppError` (distinct from a network failure) and sets the SSR
  response status to `404` via `useRequestEvent()`, so crawlers/monitoring
  see the correct HTTP status even though the app renders its own styled
  fallback UI instead of Nuxt's default error page.
- A top-level `error.vue` still exists as a last-resort catch for anything
  unhandled (e.g. a route that doesn't match any page), reusing the same
  `ErrorState` component for visual consistency.
- Images that fail to load (`urlToImage` present but broken) fall back to
  a placeholder icon via an `@error` handler on the `<img>`, rather than
  showing a broken-image icon.

## 6. Assumptions made

- The mock API's shape matches a NewsAPI-style `{ status, totalResults,
  articles: [...] }` payload — confirmed by fetching the provided URL
  directly rather than guessing from the PDF alone.
- An article with an empty/missing `url` is unusable (can't be linked to,
  can't get a stable id) and is filtered out during mapping rather than
  shown with a dead link.
- The `content` field's NewsAPI-style `"... [+1234 chars]"` truncation
  suffix is a display artifact, not real content, and is stripped.
- "Avoid duplicate client-side requests" is satisfied by (a) `useFetch`'s
  built-in key-based dedupe/payload-reuse across the SSR→client boundary,
  and (b) the Pinia store short-circuiting `load()` once data is already
  cached for client-side navigation between list and detail views.
- No dedicated backend/BFF was introduced — the brief describes an
  "internal API" but provides only a public mock URL, so `useApi`/`useArticles`
  talk to it directly. Swapping in a real internal API later only means
  changing `NUXT_PUBLIC_ARTICLES_API_URL` and, if auth is required, adding
  headers inside `useApi.ts` — the one file that owns the fetch call.

## 7. What I'd improve with more time

- Add unit tests for the pure functions (`mapArticle`, `articleId`,
  `formatDate`) and component tests for the loading/empty/error branches
  of `pages/index.vue`.
- Category/search filtering backed by a second Pinia getter, since the
  store already holds the full list client-side.
- Real pagination/infinite scroll if the underlying API supported it (the
  mock returns a fixed set).
- An `<ErrorBoundary>`-style wrapper (via `<NuxtErrorBoundary>`) around the
  article grid so a rendering error in a single card can't take down the
  whole page.
- Lighthouse pass for image `sizes`/`srcset` once real, variable-size
  images are available (the mock API's `urlToImage` is a single fixed
  size).
- CI (GitHub Actions) running `typecheck` + `build` on every push.
