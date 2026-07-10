<template>
  <div class="flex flex-col overflow-hidden rounded-sm border border-line bg-paper" aria-hidden="true">
    <BaseSkeleton height-class="aspect-[16/9] h-auto" />
    <div class="flex flex-col gap-3 p-4">
      <BaseSkeleton height-class="h-4" width-class="w-20" rounded />
      <BaseSkeleton height-class="h-5" width-class="w-full" />
      <BaseSkeleton height-class="h-4" width-class="w-5/6" />
      <BaseSkeleton height-class="h-4" width-class="w-2/3" />
    </div>
  </div>
</template>
