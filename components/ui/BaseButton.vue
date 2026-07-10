<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'ghost'
  type?: 'button' | 'submit'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button'
})

defineEmits<{ click: [MouseEvent] }>()
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wire disabled:cursor-not-allowed disabled:opacity-50"
    :class="
      variant === 'primary'
        ? 'bg-ink text-paper hover:bg-ink-soft'
        : 'border border-line bg-transparent text-ink hover:border-ink'
    "
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
