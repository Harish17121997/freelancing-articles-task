import type { RouterConfig } from '@nuxt/schema'

/**
 * Restores scroll position when navigating back/forward (e.g. detail -> list),
 * and scrolls to top for a fresh navigation (e.g. list -> detail). Without
 * this, the article list would jump back to the top on every "back" tap.
 */
export default <RouterConfig>{
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  }
}
