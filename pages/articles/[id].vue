<script setup lang="ts">
import { ApiErrorKind } from '~/types'

const route = useRoute()
const store = useArticlesStore()

const id = computed(() => String(route.params.id))

await store.load()

const article = computed(() => store.findById(id.value))

const notFoundError = {
  kind: ApiErrorKind.NotFound,
  message: 'This article may have been removed or the link is incorrect.'
}

if (!store.hasError && !store.isLoading && !article.value) {
  // Keep the HTTP status honest for SSR/crawlers even though we render our own UI.
  const event = useRequestEvent()
  if (event) event.node.res.statusCode = 404
}

useSeoMeta({
  title: () => article.value?.title ?? 'Article not found — News Explorer',
  description: () => article.value?.description
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
    <NuxtLink to="/" class="mb-6 inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink">
      &larr; Back to all articles
    </NuxtLink>

    <div v-if="store.isLoading" class="space-y-4" aria-busy="true" aria-label="Loading article">
      <BaseSkeleton height-class="h-8" width-class="w-3/4" />
      <BaseSkeleton height-class="h-4" width-class="w-1/3" />
      <BaseSkeleton height-class="aspect-[16/9] h-auto" width-class="w-full" />
      <BaseSkeleton v-for="n in 4" :key="n" height-class="h-4" width-class="w-full" />
    </div>

    <ErrorState v-else-if="store.hasError && store.error" :error="store.error" @retry="store.load(true)" />

    <ErrorState v-else-if="!article" :error="notFoundError" @retry="navigateTo('/')" />

    <article v-else class="space-y-6">
      <header class="space-y-3">
        <BaseBadge>{{ article.sourceName }}</BaseBadge>
        <h1 class="font-display text-3xl font-semibold leading-tight sm:text-4xl">{{ article.title }}</h1>
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
          <span>{{ article.author }}</span>
          <span aria-hidden="true">&middot;</span>
          <time>{{ article.publishedAtLabel }}</time>
        </div>
      </header>

      <img
        v-if="article.imageUrl"
        :src="article.imageUrl"
        :alt="article.title"
        class="aspect-[16/9] w-full rounded-sm object-cover"
      />

      <p class="whitespace-pre-line text-lg leading-relaxed text-ink">{{ article.contentPreview }}</p>

      <a
        :href="article.url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-sm font-medium text-wire hover:underline"
      >
        Read the full story at {{ article.sourceName }} &rarr;
      </a>
    </article>
  </div>
</template>
