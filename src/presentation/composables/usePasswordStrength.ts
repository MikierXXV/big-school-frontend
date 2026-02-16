/**
 * ============================================
 * COMPOSABLE: usePasswordStrength
 * ============================================
 *
 * Reactive password strength calculator.
 */

import { computed, type Ref } from 'vue';
import { calculatePasswordStrength } from '@shared/utils/password-strength.util.js';

export function usePasswordStrength(password: Ref<string>) {
  const result = computed(() => calculatePasswordStrength(password.value));

  const score = computed(() => result.value.score);
  const feedback = computed(() => result.value.feedback);

  return {
    score,
    feedback,
  };
}
