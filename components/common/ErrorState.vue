<script setup lang="ts">
import { ApiErrorKind, type AppError } from '~/types'

const props = defineProps<{ error: AppError }>()
defineEmits<{ retry: [] }>()

const heading = computed(() => {
  switch (props.error.kind) {
    case ApiErrorKind.Network:
      return "You're offline"
    case ApiErrorKind.NotFound:
      return "We couldn't find that"
    default:
      return 'Something went wrong'
  }
})
</script>

<template>
  <div class="flex flex-col items-center gap-3 rounded-2xl bg-paper-dim px-6 py-16 text-center">
    <svg
      v-if="error.kind === ApiErrorKind.Network"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      class="h-10 w-10 text-ink"
      aria-hidden="true"
    >
      <path
        d="M1 1l22 22M16.72 11.06a10.94 10.94 0 0 1 2.28 1.49M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-10 w-10 text-ink" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" />
      <path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>

    <h2 class="text-lg font-bold text-ink">{{ heading }}</h2>
    <p class="max-w-sm text-sm text-ink-soft">{{ error.message }}</p>

    <BaseButton variant="ghost" pill @click="$emit('retry')">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
        <path
          d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Retry
    </BaseButton>
  </div>
</template>
