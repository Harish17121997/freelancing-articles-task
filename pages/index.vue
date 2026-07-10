<script setup lang="ts">
const store = useArticlesStore()

// Runs on the server during SSR, so the list is present on first render.
// `store.load()` is a no-op if the data is already cached (e.g. client-side
// navigation back to "/"), which avoids a duplicate request.
await store.load()

useSeoMeta({
  title: 'News Explorer — Latest articles',
  description: 'Browse the latest articles, resiliently.'
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Latest articles</h1>
      <p class="mt-2 text-ink-soft">A running feed, gracefully handling whatever the wire sends.</p>
    </div>

    <div
      v-if="store.isLoading"
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-busy="true"
      aria-label="Loading articles"
    >
      <ArticleCardSkeleton v-for="n in 8" :key="n" />
    </div>

    <ErrorState v-else-if="store.hasError && store.error" :error="store.error" @retry="store.load(true)" />

    <EmptyState v-else-if="store.isEmpty" />

    <ArticleGrid v-else :articles="store.articles" />
  </div>
</template>
