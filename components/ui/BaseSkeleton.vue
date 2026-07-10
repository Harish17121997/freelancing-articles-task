<script setup lang="ts">
interface Props {
  /** Tailwind height class, e.g. "h-4". Kept explicit so callers control layout, avoiding shift. */
  heightClass?: string
  widthClass?: string
  rounded?: boolean
}

withDefaults(defineProps<Props>(), {
  heightClass: 'h-4',
  widthClass: 'w-full',
  rounded: false
})
</script>

<template>
  <div
    class="animate-pulse bg-line/60"
    :class="[heightClass, widthClass, rounded ? 'rounded-full' : 'rounded-sm']"
    role="presentation"
    aria-hidden="true"
  />
</template>
