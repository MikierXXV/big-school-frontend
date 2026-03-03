<!--
  ============================================
  COMPONENT: BaseBadge
  ============================================

  Badge component for displaying roles, statuses, and labels.
-->

<script setup lang="ts">
import { computed } from 'vue';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md';

interface Props {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
});

const classes = computed(() => {
  const base = 'inline-flex items-center font-medium rounded-full';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
  };

  const variantClasses = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  return [base, sizeClasses[props.size], variantClasses[props.variant]];
});
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
