import type { ApiArticlesResponse } from '~/models/api/article.model'
import type { Article } from '~/models/domain/article.model'
import { ApiErrorKind, type ApiResult } from '~/types'
import { mapApiArticlesToDomain } from '~/utils/mapArticle'

/**
 * All article data-access for the app goes through this composable.
 * Pages/components never call `useFetch` or touch `ApiArticle` directly —
 * they only ever see the mapped `Article` domain model.
 */
export function useArticles() {
  const { apiFetch } = useApi()
  const config = useRuntimeConfig()

  /**
   * Fetches the full article list via SSR-safe native useFetch and maps it
   * to the domain model. Articles missing a usable `url` are dropped by the
   * mapper (they can't be linked to or given a stable id).
   */
  async function fetchArticles(): Promise<ApiResult<Article[]>> {
    const result = await apiFetch<ApiArticlesResponse>(config.public.articlesApiUrl)

    if (result.error || !result.data) {
      return { data: null, error: result.error }
    }

    if (!Array.isArray(result.data.articles)) {
      return {
        data: null,
        error: { kind: ApiErrorKind.InvalidResponse, message: 'The API response did not contain an articles list.' }
      }
    }

    return { data: mapApiArticlesToDomain(result.data.articles), error: null }
  }

  /**
   * Looks up a single article by id from a previously-fetched list.
   * There is no per-article API endpoint, so the detail page fetches the
   * full list (same cached request as the home page, via the shared
   * `useFetch` key) and finds the match client- and server-side alike.
   */
  function findArticleById(articles: Article[], id: string): Article | null {
    return articles.find((article) => article.id === id) ?? null
  }

  return { fetchArticles, findArticleById }
}
