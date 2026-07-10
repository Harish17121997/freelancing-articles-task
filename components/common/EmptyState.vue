<template>
  <div class="flex flex-col items-center gap-3 rounded-2xl bg-paper-dim px-6 py-16 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-10 w-10 text-ink-soft" aria-hidden="true">
      <path
        d="m4 17 4-9 3 4 3-6 6 11H4Z M4 17h16"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
    </svg>
    <h2 class="text-lg font-bold text-ink">No articles found</h2>
    <p class="max-w-sm text-sm text-ink-soft">
      <slot>The feed came back empty. Check again in a little while.</slot>
    </p>
  </div>
</template>
