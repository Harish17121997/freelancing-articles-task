<script setup lang="ts">
import { ApiErrorKind } from '~/types'

const props = defineProps<{ error: { statusCode?: number; statusMessage?: string } }>()

const appError = {
  kind: props.error.statusCode === 404 ? ApiErrorKind.NotFound : ApiErrorKind.Unknown,
  message: props.error.statusMessage || 'An unexpected error occurred.'
}

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 text-center">
    <ErrorState :error="appError" @retry="goHome" />
  </div>
</template>
