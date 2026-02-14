/**
 * ============================================
 * TEST: Validation Utilities
 * ============================================
 *
 * Tests for form validation rules.
 */

import { describe, it, expect } from 'vitest';
import {
  required,
  email,
  minLength,
  maxLength,
  passwordMatch,
  passwordStrength,
} from '@shared/utils/validation.util.js';

describe('Validation Utilities', () => {
  describe('required', () => {
    it('should return error message when value is empty string', () => {
      const result = required('');
      expect(result).toBe('This field is required');
    });

    it('should return error message when value is null', () => {
      const result = required(null);
      expect(result).toBe('This field is required');
    });

    it('should return error message when value is undefined', () => {
      const result = required(undefined);
      expect(result).toBe('This field is required');
    });

    it('should return empty string when value is valid', () => {
      const result = required('valid value');
      expect(result).toBe('');
    });

    it('should return custom error message when provided', () => {
      const result = required('', 'Custom error');
      expect(result).toBe('Custom error');
    });
  });

  describe('email', () => {
    it('should return error message when email is invalid', () => {
      const result = email('notanemail');
      expect(result).toBe('Please enter a valid email address');
    });

    it('should return error message when email has no @', () => {
      const result = email('userdomain.com');
      expect(result).toBe('Please enter a valid email address');
    });

    it('should return error message when email has no domain', () => {
      const result = email('user@');
      expect(result).toBe('Please enter a valid email address');
    });

    it('should return empty string when email is valid', () => {
      const result = email('user@example.com');
      expect(result).toBe('');
    });

    it('should return empty string when value is empty (required validator handles this)', () => {
      const result = email('');
      expect(result).toBe('');
    });

    it('should return custom error message when provided', () => {
      const result = email('invalid', 'Custom email error');
      expect(result).toBe('Custom email error');
    });
  });

  describe('minLength', () => {
    it('should return error message when value is too short', () => {
      const result = minLength(5)('abc');
      expect(result).toBe('Must be at least 5 characters');
    });

    it('should return empty string when value meets minimum length', () => {
      const result = minLength(5)('abcde');
      expect(result).toBe('');
    });

    it('should return empty string when value exceeds minimum length', () => {
      const result = minLength(5)('abcdef');
      expect(result).toBe('');
    });

    it('should return empty string when value is empty (required validator handles this)', () => {
      const result = minLength(5)('');
      expect(result).toBe('');
    });

    it('should return custom error message when provided', () => {
      const result = minLength(5, 'Custom min length error')('abc');
      expect(result).toBe('Custom min length error');
    });
  });

  describe('maxLength', () => {
    it('should return error message when value is too long', () => {
      const result = maxLength(5)('abcdef');
      expect(result).toBe('Must be at most 5 characters');
    });

    it('should return empty string when value meets maximum length', () => {
      const result = maxLength(5)('abcde');
      expect(result).toBe('');
    });

    it('should return empty string when value is below maximum length', () => {
      const result = maxLength(5)('abc');
      expect(result).toBe('');
    });

    it('should return empty string when value is empty', () => {
      const result = maxLength(5)('');
      expect(result).toBe('');
    });

    it('should return custom error message when provided', () => {
      const result = maxLength(5, 'Custom max length error')('abcdef');
      expect(result).toBe('Custom max length error');
    });
  });

  describe('passwordMatch', () => {
    it('should return error message when passwords do not match', () => {
      const result = passwordMatch('password123')('password456');
      expect(result).toBe('Passwords do not match');
    });

    it('should return empty string when passwords match', () => {
      const result = passwordMatch('password123')('password123');
      expect(result).toBe('');
    });

    it('should return empty string when both values are empty', () => {
      const result = passwordMatch('')('');
      expect(result).toBe('');
    });

    it('should return custom error message when provided', () => {
      const result = passwordMatch('password123', 'Custom match error')('password456');
      expect(result).toBe('Custom match error');
    });
  });

  describe('passwordStrength', () => {
    it('should return error message when password is too weak (no uppercase)', () => {
      const result = passwordStrength('password123!');
      expect(result).toContain('uppercase');
    });

    it('should return error message when password is too weak (no lowercase)', () => {
      const result = passwordStrength('PASSWORD123!');
      expect(result).toContain('lowercase');
    });

    it('should return error message when password is too weak (no number)', () => {
      const result = passwordStrength('Password!');
      expect(result).toContain('number');
    });

    it('should return error message when password is too weak (no special char)', () => {
      const result = passwordStrength('Password123');
      expect(result).toContain('special character');
    });

    it('should return error message when password is too short', () => {
      const result = passwordStrength('Pass1!');
      expect(result).toContain('at least 8 characters');
    });

    it('should return empty string when password is strong', () => {
      const result = passwordStrength('Password123!');
      expect(result).toBe('');
    });

    it('should return empty string when value is empty (required validator handles this)', () => {
      const result = passwordStrength('');
      expect(result).toBe('');
    });

    it('should return custom error message when provided', () => {
      const result = passwordStrength('weak', 'Custom strength error');
      expect(result).toBe('Custom strength error');
    });
  });
});
