<template>
  <div role="status" :class="spinnerClasses">
    <span class="sr-only">Loading...</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ColorVariant, SizeVariant } from '@shared/constants/design-tokens.constants.js';

interface Props {
  size?: SizeVariant;
  color?: ColorVariant;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
});

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'h-3 w-3 border-2',
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };
  return sizes[props.size];
});

const colorClasses = computed(() => {
  const colors = {
    primary: 'border-primary-600',
    success: 'border-success-600',
    error: 'border-error-600',
    warning: 'border-warning-600',
    info: 'border-info-600',
  };
  return colors[props.color];
});

const spinnerClasses = computed(() => {
  return [
    'inline-block',
    'rounded-full',
    'border-solid',
    'border-t-transparent',
    'animate-spin',
    sizeClasses.value,
    colorClasses.value,
  ];
});
</script>
