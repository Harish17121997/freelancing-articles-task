<script setup lang="ts">
interface Props {
  label?: string
}

withDefaults(defineProps<Props>(), {
  label: 'Loading'
})
</script>

<template>
  <div class="flex items-center gap-3" role="status" :aria-label="label">
    <span
      class="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-wire"
      aria-hidden="true"
    />
    <span class="text-sm text-ink-soft">{{ label }}</span>
  </div>
</template>
