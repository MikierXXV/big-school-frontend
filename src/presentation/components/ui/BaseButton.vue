<template>
  <button
    :type="type"
    :disabled="isDisabled"
    :class="buttonClasses"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <BaseSpinner
      v-if="loading"
      :size="spinnerSize"
      color="primary"
      class="absolute"
    />

    <!-- Button Content -->
    <span :class="['button-content', { invisible: loading }]">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SizeVariant } from '@shared/constants/design-tokens.constants.js';
import BaseSpinner from './BaseSpinner.vue';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

interface Props {
  variant?: ButtonVariant;
  size?: SizeVariant;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const isDisabled = computed(() => props.disabled || props.loading);

const variantClasses = computed(() => {
  const variants = {
    primary: [
      'bg-primary-600',
      'hover:bg-primary-700',
      'text-white',
      'shadow-sm',
    ],
    secondary: [
      'bg-gray-600',
      'hover:bg-gray-700',
      'text-white',
      'shadow-sm',
    ],
    outline: [
      'border-2',
      'border-primary-600',
      'text-primary-600',
      'hover:bg-primary-50',
      'dark:border-primary-400',
      'dark:text-primary-400',
      'dark:hover:bg-primary-950',
    ],
    ghost: [
      'text-gray-700',
      'hover:bg-gray-100',
      'dark:text-gray-200',
      'dark:hover:bg-gray-700',
    ],
    danger: [
      'bg-error-600',
      'hover:bg-error-700',
      'text-white',
      'shadow-sm',
    ],
  };
  return variants[props.variant];
});

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return sizes[props.size];
});

const spinnerSize = computed(() => {
  const sizes: Record<SizeVariant, SizeVariant> = {
    sm: 'xs',
    md: 'sm',
    lg: 'md',
  };
  return sizes[props.size];
});

const buttonClasses = computed(() => {
  return [
    // Base styles
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-md',
    'transition-all',
    'duration-200',

    // Focus styles
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-primary-500',
    'focus:ring-offset-2',
    'dark:focus:ring-offset-gray-900',

    // Variant styles
    ...variantClasses.value,

    // Size styles
    sizeClasses.value,

    // Disabled styles
    isDisabled.value && [
      'opacity-50',
      'cursor-not-allowed',
      'pointer-events-none',
    ],
  ];
});

function handleClick(event: MouseEvent) {
  if (!isDisabled.value) {
    emit('click', event);
  }
}
</script>
