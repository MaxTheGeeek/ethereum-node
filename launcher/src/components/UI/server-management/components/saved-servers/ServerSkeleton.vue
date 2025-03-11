<template>
  <div class="w-full h-[55px] bg-white rounded-md p-2 flex justify-start items-center space-x-3 animate-pulse border border-gray-500">
    <div class="w-8 h-8 bg-gray-600 rounded-full shrink-0"></div>

    <div class="flex flex-col space-y-2 flex-1">
      <div class="h-2 bg-gray-600 rounded-full w-24"></div>
      <div class="h-2 bg-gray-600/50 rounded-full w-24"></div>
    </div>
  </div>
</template>

<script setup>
// No props or logic needed
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
