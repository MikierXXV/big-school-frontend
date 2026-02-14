<template>
  <div data-testid="password-strength-meter" class="space-y-2">
    <!-- Progress Bar -->
    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
      <div
        role="progressbar"
        aria-label="Password strength indicator"
        :aria-valuenow="percentage"
        aria-valuemin="0"
        aria-valuemax="100"
        :class="barClasses"
        :style="{ width: `${percentage}%` }"
        class="h-full transition-all duration-300 ease-in-out"
      />
    </div>

    <!-- Feedback Messages -->
    <div v-if="feedback.length > 0" class="text-sm">
      <p
        v-for="(message, index) in feedback"
        :key="index"
        :class="textClasses"
      >
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePasswordStrength } from '@presentation/composables/usePasswordStrength.js';
import { toRef } from 'vue';

interface Props {
  password: string;
}

const props = defineProps<Props>();

const passwordRef = toRef(props, 'password');
const { score, feedback } = usePasswordStrength(passwordRef);

/**
 * Calculate percentage based on score (0-5)
 * 0 -> 0%, 1 -> 20%, 2 -> 40%, 3 -> 60%, 4 -> 80%, 5 -> 100%
 */
const percentage = computed(() => {
  return (score.value / 5) * 100;
});

/**
 * Color classes based on score
 */
const barClasses = computed(() => {
  const colors = {
    0: 'bg-gray-300 dark:bg-gray-600',
    1: 'bg-error-500',
    2: 'bg-warning-500',
    3: 'bg-warning-400',
    4: 'bg-success-400',
    5: 'bg-success-500',
  };
  return colors[score.value as keyof typeof colors] || colors[0];
});

/**
 * Text color classes based on score
 */
const textClasses = computed(() => {
  const colors = {
    0: 'text-gray-600 dark:text-gray-400',
    1: 'text-error-600 dark:text-error-400',
    2: 'text-warning-600 dark:text-warning-400',
    3: 'text-warning-600 dark:text-warning-400',
    4: 'text-success-600 dark:text-success-400',
    5: 'text-success-600 dark:text-success-400',
  };
  return colors[score.value as keyof typeof colors] || colors[0];
});
</script>
