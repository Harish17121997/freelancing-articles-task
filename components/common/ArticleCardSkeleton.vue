<script setup lang="ts">
interface Props {
  layout?: 'grid' | 'list'
}

withDefaults(defineProps<Props>(), {
  layout: 'grid'
})
</script>

<template>
  <div
    class="flex overflow-hidden rounded-2xl bg-paper-dim"
    :class="layout === 'grid' ? 'flex-col' : 'flex-col sm:flex-row sm:items-stretch'"
    aria-hidden="true"
  >
    <BaseSkeleton
      class="shrink-0"
      :height-class="layout === 'grid' ? 'aspect-square h-auto' : 'aspect-[16/10] h-auto sm:aspect-auto sm:w-56'"
    />
    <div class="flex flex-1 flex-col justify-center gap-3 p-4">
      <BaseSkeleton height-class="h-4" width-class="w-full" />
      <BaseSkeleton height-class="h-4" width-class="w-2/3" />
      <BaseSkeleton v-if="layout === 'list'" height-class="h-8" width-class="w-full" shape="full" />
    </div>
  </div>
</template>
