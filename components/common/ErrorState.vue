<script setup lang="ts">
import { ApiErrorKind, type AppError } from '~/types'

const props = defineProps<{ error: AppError }>()
defineEmits<{ retry: [] }>()

const heading = computed(() => {
  switch (props.error.kind) {
    case ApiErrorKind.NotFound:
      return "We couldn't find that"
    case ApiErrorKind.Network:
      return "We couldn't connect"
    default:
      return 'Something went wrong'
  }
})
</script>

<template>
  <div class="flex flex-col items-center gap-4 rounded-sm border border-line bg-paper-dim px-6 py-14 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-10 w-10 text-wire" aria-hidden="true">
      <path
        d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <h2 class="font-display text-xl font-semibold">{{ heading }}</h2>
    <p class="max-w-sm text-sm text-ink-soft">{{ error.message }}</p>
    <BaseButton variant="primary" @click="$emit('retry')">Try again</BaseButton>
  </div>
</template>
