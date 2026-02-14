/**
 * ============================================
 * TEST: usePasswordStrength Composable
 * ============================================
 *
 * Tests for password strength composable.
 */

import { describe, it, expect } from 'vitest';
import { usePasswordStrength } from '@presentation/composables/usePasswordStrength.js';
import { ref } from 'vue';

describe('usePasswordStrength', () => {
  it('should return score 0 for empty password', () => {
    const password = ref('');
    const { score, feedback } = usePasswordStrength(password);

    expect(score.value).toBe(0);
    expect(feedback.value.length).toBeGreaterThan(0);
  });

  it('should return score 1 for very weak password', () => {
    const password = ref('abc');
    const { score, feedback } = usePasswordStrength(password);

    expect(score.value).toBe(1);
    expect(feedback.value.join(' ')).toContain('Too short');
  });

  it('should return score 5 for very strong password', () => {
    const password = ref('MyP@ssw0rd!2024');
    const { score, feedback } = usePasswordStrength(password);

    expect(score.value).toBe(5);
    expect(feedback.value.join(' ')).toContain('Very strong');
  });

  it('should reactively update score when password changes', () => {
    const password = ref('weak');
    const { score } = usePasswordStrength(password);

    expect(score.value).toBe(1);

    password.value = 'StrongP@ss123';
    expect(score.value).toBe(5);
  });

  it('should reactively update feedback when password changes', () => {
    const password = ref('');
    const { feedback } = usePasswordStrength(password);

    expect(feedback.value.join(' ')).toContain('Enter a password');

    password.value = 'Abcdefgh123!';
    expect(feedback.value.join(' ')).toContain('Very strong');
  });
});
