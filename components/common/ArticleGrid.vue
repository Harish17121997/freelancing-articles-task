<script setup lang="ts">
import type { Article } from '~/models/domain/article.model'

interface Props {
  articles: Article[]
  layout?: 'grid' | 'list'
}

withDefaults(defineProps<Props>(), {
  layout: 'grid'
})
</script>

<template>
  <div
    class="grid gap-4 sm:gap-6"
    :class="layout === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1 lg:grid-cols-2'"
  >
    <ArticleCard v-for="article in articles" :key="article.id" :article="article" :layout="layout" />
  </div>
</template>
