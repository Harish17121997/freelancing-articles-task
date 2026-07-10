<script setup lang="ts">
import { ApiErrorKind } from '~/types'

const route = useRoute()
const router = useRouter()
const store = useArticlesStore()

const id = computed(() => String(route.params.id))

await store.load()

const article = computed(() => store.findById(id.value))
const isFavorite = ref(false)

const notFoundError = {
  kind: ApiErrorKind.NotFound,
  message: 'This article may have been removed or the link is incorrect.'
}

if (!store.hasError && !store.isLoading && !article.value) {
  // Keep the HTTP status honest for SSR/crawlers even though we render our own UI.
  const event = useRequestEvent()
  if (event) event.node.res.statusCode = 404
}

function goBack() {
  router.back()
}

useSeoMeta({
  title: () => article.value?.title ?? 'Article not found — News Explorer',
  description: () => article.value?.description
})
</script>

<template>
  <div>
    <div class="bg-night px-4 pb-16 pt-5 text-white sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl">
        <div class="flex items-center justify-between">
          <BaseIconButton ariaLabel="Go back" tone="light" @click="goBack">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </BaseIconButton>

          <span class="text-base font-medium">Article</span>

          <BaseIconButton
            :ariaLabel="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
            :aria-pressed="isFavorite"
            tone="light"
            @click="isFavorite = !isFavorite"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="isFavorite ? 'currentColor' : 'none'" class="h-5 w-5" aria-hidden="true">
              <path
                d="M12 21s-7-4.35-9.5-8.5C1 9 2 5 6 5c2 0 3.5 1.2 4 2.4.5-1.2 2-2.4 4-2.4 4 0 5 4 3.5 7.5C19 16.65 12 21 12 21Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>
          </BaseIconButton>
        </div>

        <div v-if="store.isLoading" class="mt-6 space-y-3" aria-busy="true" aria-label="Loading article">
          <BaseSkeleton height-class="h-7" width-class="w-3/4" tone="onDark" />
          <BaseSkeleton height-class="h-4" width-class="w-1/3" tone="onDark" />
        </div>

        <div v-else-if="article" class="mt-6 space-y-2">
          <h1 class="text-2xl font-bold leading-snug sm:text-3xl">{{ article.title }}</h1>
          <div class="flex items-center gap-1.5 text-sm text-white/70">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" />
              <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <span>{{ article.publishedAtRelativeLabel }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto -mt-10 max-w-3xl px-4 pb-12 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="mb-4 inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink">
        &larr; Back to all articles
      </NuxtLink>

      <div v-if="store.isLoading" class="space-y-4" aria-hidden="true">
        <BaseSkeleton height-class="aspect-[16/10] h-auto" shape="2xl" />
        <BaseSkeleton v-for="n in 4" :key="n" height-class="h-4" width-class="w-full" />
      </div>

      <ErrorState v-else-if="store.hasError && store.error" :error="store.error" @retry="store.load(true)" />

      <ErrorState v-else-if="!article" :error="notFoundError" @retry="navigateTo('/')" />

      <article v-else class="space-y-6">
        <div v-if="article.imageUrl" class="overflow-hidden rounded-2xl shadow-lg shadow-ink/10">
          <img :src="article.imageUrl" :alt="article.title" class="aspect-[16/10] w-full object-cover" />
        </div>

        <p class="whitespace-pre-line text-base leading-relaxed text-ink-soft sm:text-lg">{{ article.contentPreview }}</p>

        <a
          :href="article.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
        >
          Read the full story at {{ article.sourceName }} &rarr;
        </a>
      </article>
    </div>
  </div>
</template>
