<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type PaddingSize = 'none' | 'sm' | 'md' | 'lg';
type ShadowSize = 'none' | 'sm' | 'md' | 'lg';

interface Props {
  padding?: PaddingSize;
  shadow?: ShadowSize;
  hoverable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  shadow: 'md',
  hoverable: false,
});

const paddingClasses = computed(() => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  return paddings[props.padding];
});

const shadowClasses = computed(() => {
  const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };
  return shadows[props.shadow];
});

const cardClasses = computed(() => {
  return [
    // Base styles
    'bg-white',
    'dark:bg-gray-800',
    'border',
    'border-gray-200',
    'dark:border-gray-700',
    'rounded-lg',

    // Padding
    paddingClasses.value,

    // Shadow
    shadowClasses.value,

    // Hoverable
    props.hoverable && [
      'hover:shadow-lg',
      'transition-shadow',
      'duration-200',
      'cursor-pointer',
    ],
  ];
});
</script>
