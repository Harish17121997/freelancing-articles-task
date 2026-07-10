<script setup lang="ts">
interface Props {
  /** Tailwind height class, e.g. "h-4". Kept explicit so callers control layout, avoiding shift. */
  heightClass?: string
  widthClass?: string
  shape?: 'sm' | 'full' | '2xl'
  /** Use on a dark surface (e.g. the article-detail hero) instead of the default light background. */
  tone?: 'default' | 'onDark'
}

withDefaults(defineProps<Props>(), {
  heightClass: 'h-4',
  widthClass: 'w-full',
  shape: 'sm',
  tone: 'default'
})

const shapeClasses: Record<NonNullable<Props['shape']>, string> = {
  sm: 'rounded-sm',
  full: 'rounded-full',
  '2xl': 'rounded-2xl'
}
</script>

<template>
  <div
    class="animate-pulse"
    :class="[heightClass, widthClass, shapeClasses[shape], tone === 'onDark' ? 'bg-white/20' : 'bg-line/60']"
    role="presentation"
    aria-hidden="true"
  />
</template>
