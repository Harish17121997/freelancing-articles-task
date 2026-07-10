<script setup lang="ts">
import type { Article } from '~/models/domain/article.model'

interface Props {
  article: Article
  layout?: 'grid' | 'list'
}

withDefaults(defineProps<Props>(), {
  layout: 'grid'
})

const imageFailed = ref(false)
</script>

<template>
  <NuxtLink
    :to="`/articles/${article.id}`"
    class="group flex overflow-hidden rounded-2xl bg-night transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    :class="layout === 'grid' ? 'flex-col hover:-translate-y-0.5' : 'flex-col sm:flex-row sm:items-stretch'"
  >
    <div
      class="w-full shrink-0 overflow-hidden bg-night-soft"
      :class="layout === 'grid' ? 'aspect-square' : 'aspect-[16/10] sm:aspect-auto sm:w-56'"
    >
      <img
        v-if="article.imageUrl && !imageFailed"
        :src="article.imageUrl"
        :alt="article.title"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        @error="imageFailed = true"
      />
      <div v-else class="flex h-full w-full items-center justify-center bg-paper-dim text-ink-soft" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-8 w-8 opacity-50">
          <path
            d="m4 17 4-9 3 4 3-6 6 11H4Z M4 17h16"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <div class="flex flex-1 flex-col justify-center gap-3 p-4">
      <h3
        class="font-semibold leading-snug text-white"
        :class="layout === 'grid' ? 'line-clamp-2 text-sm' : 'line-clamp-2 text-base sm:text-lg'"
      >
        {{ article.title }}
      </h3>

      <div v-if="layout === 'list'" class="mt-auto flex items-center justify-between gap-3">
        <span class="flex items-center gap-1.5 text-xs text-white/70">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.5" />
            <path d="M16 3v4M8 3v4M3 10h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          {{ article.publishedAtLabel }}
        </span>

        <span
          aria-hidden="true"
          class="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand py-2 pl-4 pr-2 text-sm font-semibold text-white"
        >
          Read More
          <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-3 w-3">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
