<template>
  <button
    type="button"
    :disabled="loading"
    :class="[
      'relative w-full inline-flex items-center justify-center gap-3',
      'px-4 py-2.5 text-sm font-medium rounded-md',
      'border border-gray-300 dark:border-gray-600',
      'bg-white dark:bg-gray-800',
      'text-gray-700 dark:text-gray-200',
      'hover:bg-gray-50 dark:hover:bg-gray-700',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
      'transition-colors duration-200',
      loading && 'opacity-50 cursor-not-allowed pointer-events-none',
    ]"
    :data-testid="`oauth-btn-${provider}`"
    @click="$emit('click')"
  >
    <!-- Google icon -->
    <svg
      v-if="provider === 'google'"
      class="w-5 h-5 flex-shrink-0"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>

    <!-- Microsoft icon -->
    <svg
      v-else-if="provider === 'microsoft'"
      class="w-5 h-5 flex-shrink-0"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="11" height="11" fill="#F25022" />
      <rect x="13" y="0" width="11" height="11" fill="#7FBA00" />
      <rect x="0" y="13" width="11" height="11" fill="#00A4EF" />
      <rect x="13" y="13" width="11" height="11" fill="#FFB900" />
    </svg>

    <span v-if="loading">Connecting…</span>
    <span v-else>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  provider: 'google' | 'microsoft';
  label: string;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
});

defineEmits<{ click: [] }>();
</script>
