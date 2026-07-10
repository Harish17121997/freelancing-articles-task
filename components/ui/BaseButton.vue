<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'ghost' | 'accent'
  /** Pill = fully rounded (the Figma CTA/retry style). Default keeps a subtle rounded-sm corner. */
  pill?: boolean
  type?: 'button' | 'submit'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  pill: false,
  type: 'button'
})

defineEmits<{ click: [MouseEvent] }>()

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-ink text-white hover:bg-ink-soft',
  ghost: 'border border-line bg-white text-ink hover:border-ink',
  accent: 'bg-brand text-white hover:bg-brand-soft'
}
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold transition-colors active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
    :class="[pill ? 'rounded-full' : 'rounded-sm', variantClasses[variant]]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
