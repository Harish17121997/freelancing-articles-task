<template>
  <div class="flex flex-col items-center gap-3 rounded-sm border border-dashed border-line px-6 py-14 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="h-10 w-10 text-ink-soft" aria-hidden="true">
      <path
        d="M4 5h16v14H4z M4 9h16"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <h2 class="font-display text-xl font-semibold">No articles yet</h2>
    <p class="max-w-sm text-sm text-ink-soft">
      <slot>The feed came back empty. Check again in a little while.</slot>
    </p>
  </div>
</template>
