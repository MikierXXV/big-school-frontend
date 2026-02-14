<template>
  <div class="space-y-1">
    <!-- Label -->
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>

    <!-- Input Container -->
    <div class="relative">
      <input
        :id="inputId"
        :value="modelValue"
        :type="currentType"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-invalid="hasError ? 'true' : undefined"
        :class="inputClasses"
        @input="handleInput"
      />

      <!-- Password Toggle Button -->
      <button
        v-if="type === 'password'"
        type="button"
        data-testid="password-toggle"
        aria-label="Toggle password visibility"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
        @click="togglePasswordVisibility"
      >
        <svg
          v-if="currentType === 'password'"
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <svg
          v-else
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>
      </button>
    </div>

    <!-- Error Message -->
    <p v-if="error && error.length > 0" class="text-sm text-error-600 dark:text-error-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  modelValue?: string;
  type?: 'text' | 'email' | 'password';
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  success?: boolean;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  success: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

// Password visibility toggle
const showPassword = ref(false);
const currentType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text';
  }
  return props.type;
});

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

// Input ID generation
const inputId = computed(() => {
  return props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
});

// Error state
const hasError = computed(() => {
  return Boolean(props.error && props.error.length > 0);
});

// Input classes
const inputClasses = computed(() => {
  return [
    // Base styles
    'w-full',
    'px-4',
    'py-2',
    'text-sm',
    'rounded-md',
    'border',
    'transition-colors',
    'duration-200',

    // Focus styles
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-0',

    // Dark mode base
    'dark:bg-gray-800',
    'dark:text-gray-100',

    // State-specific styles
    hasError.value
      ? [
          'border-error-500',
          'focus:ring-error-500',
          'dark:border-error-500',
        ]
      : props.success
        ? [
            'border-success-500',
            'focus:ring-success-500',
            'dark:border-success-500',
          ]
        : [
            'border-gray-300',
            'focus:ring-primary-500',
            'dark:border-gray-600',
            'dark:focus:ring-primary-400',
          ],

    // Disabled styles
    props.disabled && [
      'opacity-50',
      'cursor-not-allowed',
      'bg-gray-50',
      'dark:bg-gray-900',
    ],

    // Password input padding for toggle button
    props.type === 'password' && 'pr-10',
  ];
});

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>
