/**
 * ============================================
 * TEST: Password Strength Utility
 * ============================================
 *
 * Tests for password strength calculation.
 */

import { describe, it, expect } from 'vitest';
import {
  calculatePasswordStrength,
  type PasswordStrengthResult,
} from '@shared/utils/password-strength.util.js';

describe('Password Strength Utility', () => {
  describe('calculatePasswordStrength', () => {
    it('should return score 0 for empty password', () => {
      const result = calculatePasswordStrength('');

      expect(result.score).toBe(0);
      expect(result.feedback).toContain('Enter a password');
    });

    it('should return score 1 for very weak password (too short)', () => {
      const result = calculatePasswordStrength('abc');

      expect(result.score).toBe(1);
      expect(result.feedback.join(' ')).toContain('Too short');
    });

    it('should return score 2 for weak password (only lowercase)', () => {
      const result = calculatePasswordStrength('abcdefgh');

      expect(result.score).toBe(2);
      expect(result.feedback.join(' ')).toContain('Add uppercase');
    });

    it('should return score 3 for medium password (lowercase + uppercase)', () => {
      const result = calculatePasswordStrength('Abcdefgh');

      expect(result.score).toBe(3);
      expect(result.feedback.join(' ')).toContain('Add numbers');
    });

    it('should return score 4 for strong password (lowercase + uppercase + numbers)', () => {
      const result = calculatePasswordStrength('Abcdefgh123');

      expect(result.score).toBe(4);
      expect(result.feedback.join(' ')).toContain('Add special');
    });

    it('should return score 5 for very strong password (all requirements met)', () => {
      const result = calculatePasswordStrength('Abcdefgh123!');

      expect(result.score).toBe(5);
      expect(result.feedback.join(' ')).toContain('Very strong');
    });

    it('should return score 5 for complex password with all character types', () => {
      const result = calculatePasswordStrength('MyP@ssw0rd!2024');

      expect(result.score).toBe(5);
      expect(result.feedback.join(' ')).toContain('Very strong');
    });

    it('should handle password with multiple special characters', () => {
      const result = calculatePasswordStrength('Test123!@#$');

      expect(result.score).toBe(5);
    });

    it('should give higher score for longer passwords', () => {
      const shortPassword = calculatePasswordStrength('Ab1!');
      const longPassword = calculatePasswordStrength('Abcdefgh123!@#');

      expect(longPassword.score).toBeGreaterThan(shortPassword.score);
    });

    it('should return appropriate feedback for each strength level', () => {
      const weak = calculatePasswordStrength('abc');
      const medium = calculatePasswordStrength('Abcdefgh');
      const strong = calculatePasswordStrength('Abcdefgh123!');

      expect(weak.feedback.length).toBeGreaterThan(0);
      expect(medium.feedback.length).toBeGreaterThan(0);
      expect(strong.feedback.length).toBeGreaterThan(0);
    });
  });
});
