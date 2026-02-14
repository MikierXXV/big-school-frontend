<template>
  <div v-if="!isDismissed" role="alert" :class="alertClasses">
    <!-- Icon -->
    <div v-if="showIcon" class="flex-shrink-0">
      <svg :class="iconClasses" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <!-- Info Icon -->
        <path
          v-if="variant === 'info'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <!-- Success Icon -->
        <path
          v-else-if="variant === 'success'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <!-- Warning Icon -->
        <path
          v-else-if="variant === 'warning'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
        <!-- Error Icon -->
        <path
          v-else-if="variant === 'error'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>

    <!-- Content -->
    <div class="flex-1">
      <slot />
    </div>

    <!-- Close Button -->
    <button
      v-if="dismissible"
      type="button"
      aria-label="Close alert"
      :class="closeButtonClasses"
      @click="handleClose"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface Props {
  variant?: AlertVariant;
  showIcon?: boolean;
  dismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  showIcon: true,
  dismissible: false,
});

const emit = defineEmits<{
  close: [];
}>();

const isDismissed = ref(false);

const variantClasses = computed(() => {
  const variants = {
    info: [
      'bg-info-50',
      'border-info-200',
      'text-info-800',
      'dark:bg-info-900',
      'dark:border-info-700',
      'dark:text-info-200',
    ],
    success: [
      'bg-success-50',
      'border-success-200',
      'text-success-800',
      'dark:bg-success-900',
      'dark:border-success-700',
      'dark:text-success-200',
    ],
    warning: [
      'bg-warning-50',
      'border-warning-200',
      'text-warning-800',
      'dark:bg-warning-900',
      'dark:border-warning-700',
      'dark:text-warning-200',
    ],
    error: [
      'bg-error-50',
      'border-error-200',
      'text-error-800',
      'dark:bg-error-900',
      'dark:border-error-700',
      'dark:text-error-200',
    ],
  };
  return variants[props.variant];
});

const iconClasses = computed(() => {
  const colors = {
    info: 'text-info-600 dark:text-info-400',
    success: 'text-success-600 dark:text-success-400',
    warning: 'text-warning-600 dark:text-warning-400',
    error: 'text-error-600 dark:text-error-400',
  };
  return ['h-5', 'w-5', colors[props.variant]];
});

const closeButtonClasses = computed(() => {
  const colors = {
    info: 'text-info-600 hover:text-info-800 dark:text-info-400 dark:hover:text-info-200',
    success:
      'text-success-600 hover:text-success-800 dark:text-success-400 dark:hover:text-success-200',
    warning:
      'text-warning-600 hover:text-warning-800 dark:text-warning-400 dark:hover:text-warning-200',
    error: 'text-error-600 hover:text-error-800 dark:text-error-400 dark:hover:text-error-200',
  };
  return [
    'flex-shrink-0',
    'rounded-md',
    'p-1',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    colors[props.variant],
  ];
});

const alertClasses = computed(() => {
  return [
    'flex',
    'items-start',
    'gap-3',
    'p-4',
    'border',
    'rounded-md',
    ...variantClasses.value,
  ];
});

function handleClose() {
  isDismissed.value = true;
  emit('close');
}
</script>
