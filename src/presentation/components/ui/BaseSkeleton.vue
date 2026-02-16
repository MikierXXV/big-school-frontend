<!--
  ============================================
  COMPONENT: BaseSkeleton
  ============================================

  Loading skeleton component for content placeholders.

  Props:
  - variant: 'text' | 'circular' | 'rectangular'
  - width: CSS width value
  - height: CSS height value
  - count: Number of skeleton lines (for text variant)
-->

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  width: '100%',
  height: '1rem',
  count: 1,
});

const skeletonClasses = computed(() => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return `${baseClasses} ${variantClasses[props.variant]}`;
});

const skeletonStyle = computed(() => ({
  width: props.width,
  height: props.height,
}));
</script>

<template>
  <div class="skeleton-container">
    <div
      v-for="index in count"
      :key="index"
      :class="[skeletonClasses, { 'mb-2': count > 1 && index < count }]"
      :style="skeletonStyle"
      data-testid="skeleton-item"
    />
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
