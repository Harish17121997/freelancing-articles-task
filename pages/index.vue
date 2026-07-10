<script setup lang="ts">
const store = useArticlesStore()

// Runs on the server during SSR, so the list is present on first render.
// `store.load()` is a no-op if the data is already cached (e.g. client-side
// navigation back to "/"), which avoids a duplicate request.
await store.load()

// A cookie (not a Pinia store) because it's a single-page display preference,
// not shared/cross-page app state — but it still needs to survive both
// client-side navigation away-and-back AND a full page refresh, which a
// plain `ref` cannot do (it's re-created every time this page component
// mounts). `useCookie` is SSR-safe, so there's no hydration mismatch either.
const viewMode = useCookie<'grid' | 'list'>('article-view-mode', {
  default: () => 'grid',
  maxAge: 60 * 60 * 24 * 365,
  sameSite: 'lax'
})
if (viewMode.value !== 'grid' && viewMode.value !== 'list') viewMode.value = 'grid'

const showSearch = ref(false)
const searchQuery = ref('')

function toggleViewMode() {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

function toggleSearch() {
  showSearch.value = !showSearch.value
  if (!showSearch.value) searchQuery.value = ''
}

const filteredArticles = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return store.articles
  return store.articles.filter((article) => article.title.toLowerCase().includes(query))
})

const noSearchResults = computed(
  () => !store.isLoading && !store.hasError && searchQuery.value.trim() !== '' && filteredArticles.value.length === 0
)

useSeoMeta({
  title: 'News Explorer — Latest articles',
  description: 'Browse the latest articles, resiliently.'
})
</script>

<template>
  <div>
    <AppHeader title="Articles">
      <template #actions>
        <BaseIconButton :ariaLabel="viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'" @click="toggleViewMode">
          <svg v-if="viewMode === 'grid'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </BaseIconButton>

        <BaseIconButton ariaLabel="Search articles" @click="toggleSearch">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
            <path d="m21 21-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </BaseIconButton>
      </template>
    </AppHeader>

    <div class="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div v-if="showSearch" class="mb-6">
        <label class="relative block">
          <span class="sr-only">Search articles by title</span>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search articles by title…"
            class="w-full rounded-full border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-brand focus:outline-none"
            autofocus
          />
        </label>
      </div>

      <div
        v-if="store.isLoading"
        class="grid gap-4 sm:gap-6"
        :class="viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3'"
        aria-busy="true"
        aria-label="Loading articles"
      >
        <ArticleCardSkeleton v-for="n in 10" :key="n" :layout="viewMode" />
      </div>

      <ErrorState v-else-if="store.hasError && store.error" :error="store.error" @retry="store.load(true)" />

      <EmptyState v-else-if="store.isEmpty">Nothing has been published yet. Check back soon.</EmptyState>

      <EmptyState v-else-if="noSearchResults">No articles match "{{ searchQuery }}".</EmptyState>

      <ArticleGrid v-else :articles="filteredArticles" :layout="viewMode" />
    </div>
  </div>
</template>
