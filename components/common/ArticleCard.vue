<script setup lang="ts">
import type { Article } from '~/models/domain/article.model'

defineProps<{ article: Article }>()

const imageFailed = ref(false)
</script>

<template>
  <NuxtLink
    :to="`/articles/${article.id}`"
    class="group flex flex-col overflow-hidden rounded-sm border border-line bg-paper transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wire"
  >
    <div class="aspect-[16/9] w-full overflow-hidden bg-paper-dim">
      <img
        v-if="article.imageUrl && !imageFailed"
        :src="article.imageUrl"
        :alt="article.title"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        @error="imageFailed = true"
      />
      <div v-else class="flex h-full w-full items-center justify-center bg-paper-dim text-ink-soft" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-8 w-8 opacity-40">
          <path
            d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm0 12 5-5 3 3 4-5 4 5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-4">
      <BaseBadge>{{ article.sourceName }}</BaseBadge>

      <h3 class="font-display text-lg font-semibold leading-snug text-ink">
        {{ article.title }}
      </h3>

      <p class="line-clamp-3 flex-1 text-sm text-ink-soft">
        {{ article.description }}
      </p>

      <div class="flex items-center justify-between text-xs text-ink-soft">
        <span class="truncate">{{ article.author }}</span>
        <time>{{ article.publishedAtLabel }}</time>
      </div>
    </div>
  </NuxtLink>
</template>
