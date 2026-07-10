<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<template>
  <header class="border-b border-line bg-white">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="text-2xl font-extrabold tracking-tight text-ink">{{ title }}</NuxtLink>
      <div class="flex items-center gap-1">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>
