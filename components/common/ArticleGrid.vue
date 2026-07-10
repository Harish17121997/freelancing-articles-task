<script setup lang="ts">
import type { Article } from '~/models/domain/article.model'

defineProps<{ articles: Article[] }>()
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
  </div>
</template>
