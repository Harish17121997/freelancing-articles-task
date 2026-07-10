import { defineStore } from 'pinia'
import type { Article } from '~/models/domain/article.model'
import { RequestStatus, type AppError } from '~/types'

interface ArticlesState {
  articles: Article[]
  status: RequestStatus
  error: AppError | null
}

/**
 * Holds the article list as shared state so that navigating from the list
 * to a detail page (and back) doesn't re-trigger a fresh network request —
 * genuinely global, cross-page state, unlike e.g. per-component UI toggles
 * which stay local and don't belong in Pinia.
 */
export const useArticlesStore = defineStore('articles', {
  state: (): ArticlesState => ({
    articles: [],
    status: RequestStatus.Idle,
    error: null
  }),

  getters: {
    isLoading: (state) => state.status === RequestStatus.Loading,
    hasError: (state) => state.status === RequestStatus.Error,
    isEmpty: (state) => state.status === RequestStatus.Success && state.articles.length === 0
  },

  actions: {
    /**
     * Loads the article list once and caches it for the session.
     * Pass `force: true` to bypass the cache (e.g. a manual "retry" action).
     */
    async load(force = false): Promise<void> {
      if (!force && this.status === RequestStatus.Success) return

      this.status = RequestStatus.Loading
      this.error = null

      const { fetchArticles } = useArticles()
      const { data, error } = await fetchArticles()

      if (error || !data) {
        this.status = RequestStatus.Error
        this.error = error
        return
      }

      this.articles = data
      this.status = RequestStatus.Success
    },

    findById(id: string): Article | null {
      const { findArticleById } = useArticles()
      return findArticleById(this.articles, id)
    }
  }
})
