<script setup lang="ts">
interface Props {
  ariaLabel: string
  /** 'dark' = for use on the white top bar / light backgrounds. 'light' = for use on dark surfaces (the hero header). */
  tone?: 'dark' | 'light'
}

withDefaults(defineProps<Props>(), {
  tone: 'dark'
})

defineEmits<{ click: [MouseEvent] }>()
</script>

<template>
  <button
    type="button"
    :aria-label="ariaLabel"
    class="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    :class="tone === 'dark' ? 'text-ink hover:bg-paper-dim' : 'text-white hover:bg-white/10'"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
