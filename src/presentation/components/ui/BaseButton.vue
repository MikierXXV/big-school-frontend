<template>
  <button
    ref="buttonRef"
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
import { computed, ref } from 'vue';
import type { SizeVariant } from '@shared/constants/design-tokens.constants.js';
import BaseSpinner from './BaseSpinner.vue';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

interface Props {
  variant?: ButtonVariant;
  size?: SizeVariant;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ripple?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
  ripple: true,
});

const buttonRef = ref<HTMLButtonElement | null>(null);

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

function createRipple(event: MouseEvent) {
  if (!props.ripple || !buttonRef.value) return;

  const button = buttonRef.value;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add('ripple');

  const ripple = button.querySelector('.ripple');
  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);

  // Remove ripple after animation
  setTimeout(() => {
    circle.remove();
  }, 600);
}

function handleClick(event: MouseEvent) {
  if (!isDisabled.value) {
    createRipple(event);
    emit('click', event);
  }
}
</script>

<style scoped>
button {
  overflow: hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  transform: scale(0);
  animation: ripple-animation 0.6s ease-out;
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
