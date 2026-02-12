/**
 * ============================================
 * UNIT TEST: Password Value Object
 * ============================================
 *
 * Tests para validación de fortaleza de contraseña.
 *
 * REQUISITOS (según backend):
 * - Mínimo 8 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 * - Al menos un carácter especial (!@#$%^&*(),.?":{}|<>)
 */

import { describe, it, expect } from 'vitest';
import { Password } from '@domain/value-objects/password.value-object.js';

describe('Password Value Object', () => {
  describe('validate() - Valid passwords', () => {
    it('should validate a strong password with all requirements', () => {
      const result = Password.validate('SecurePass123!');

      expect(result.isValid).toBe(true);
      expect(result.missingRequirements).toHaveLength(0);
    });

    it('should accept password with different special characters', () => {
      expect(Password.validate('P@ssw0rd').isValid).toBe(true);
      expect(Password.validate('Pass#123').isValid).toBe(true);
      expect(Password.validate('Te$t1234').isValid).toBe(true);
      expect(Password.validate('Valid&99').isValid).toBe(true);
    });

    it('should accept password with exactly 8 characters', () => {
      const result = Password.validate('Pass123!');
      expect(result.isValid).toBe(true);
    });

    it('should accept very long password', () => {
      const longPassword = 'VeryLongSecureP@ssw0rd1234567890!';
      const result = Password.validate(longPassword);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validate() - Invalid passwords', () => {
    it('should reject password with less than 8 characters', () => {
      const result = Password.validate('Pass1!');

      expect(result.isValid).toBe(false);
      expect(result.missingRequirements).toContain('Minimum 8 characters');
    });

    it('should reject password without uppercase letter', () => {
      const result = Password.validate('password123!');

      expect(result.isValid).toBe(false);
      expect(result.missingRequirements).toContain('At least one uppercase letter');
    });

    it('should reject password without lowercase letter', () => {
      const result = Password.validate('PASSWORD123!');

      expect(result.isValid).toBe(false);
      expect(result.missingRequirements).toContain('At least one lowercase letter');
    });

    it('should reject password without number', () => {
      const result = Password.validate('Password!');

      expect(result.isValid).toBe(false);
      expect(result.missingRequirements).toContain('At least one number');
    });

    it('should reject password without special character', () => {
      const result = Password.validate('Password123');

      expect(result.isValid).toBe(false);
      expect(result.missingRequirements).toContain('At least one special character');
    });

    it('should reject password missing multiple requirements', () => {
      const result = Password.validate('pass');

      expect(result.isValid).toBe(false);
      expect(result.missingRequirements).toContain('Minimum 8 characters');
      expect(result.missingRequirements).toContain('At least one uppercase letter');
      expect(result.missingRequirements).toContain('At least one number');
      expect(result.missingRequirements).toContain('At least one special character');
    });

    it('should reject empty password', () => {
      const result = Password.validate('');

      expect(result.isValid).toBe(false);
      expect(result.missingRequirements.length).toBeGreaterThan(0);
    });
  });

  describe('getStrength()', () => {
    it('should return VERY_WEAK for password missing all requirements', () => {
      const strength = Password.getStrength('abc');
      expect(strength).toBe('VERY_WEAK');
    });

    it('should return WEAK for password meeting 1-2 requirements', () => {
      const strength = Password.getStrength('password');
      expect(strength).toBe('WEAK');
    });

    it('should return MEDIUM for password meeting 3 requirements', () => {
      const strength = Password.getStrength('Password');
      expect(strength).toBe('MEDIUM');
    });

    it('should return STRONG for password meeting 4 requirements', () => {
      const strength = Password.getStrength('Password1');
      expect(strength).toBe('STRONG');
    });

    it('should return VERY_STRONG for password meeting all 5 requirements', () => {
      const strength = Password.getStrength('Password1!');
      expect(strength).toBe('VERY_STRONG');
    });
  });

  describe('calculateScore()', () => {
    it('should return 0 for empty password', () => {
      const score = Password.calculateScore('');
      expect(score).toBe(0);
    });

    it('should return low score for weak password', () => {
      const score = Password.calculateScore('abc');
      expect(score).toBeLessThan(40);
    });

    it('should return medium score for password with some requirements', () => {
      const score = Password.calculateScore('Password');
      expect(score).toBeGreaterThanOrEqual(40);
      expect(score).toBeLessThan(70);
    });

    it('should return high score for strong password', () => {
      const score = Password.calculateScore('Password1!');
      expect(score).toBeGreaterThanOrEqual(70);
    });

    it('should return 100 for very strong long password', () => {
      const score = Password.calculateScore('VerySecureP@ssw0rd123!WithExtraLength');
      expect(score).toBe(100);
    });
  });

  describe('getRequirements()', () => {
    it('should return all 5 requirements', () => {
      const requirements = Password.getRequirements();

      expect(requirements).toHaveLength(5);
      expect(requirements).toContain('Minimum 8 characters');
      expect(requirements).toContain('At least one uppercase letter');
      expect(requirements).toContain('At least one lowercase letter');
      expect(requirements).toContain('At least one number');
      expect(requirements).toContain('At least one special character');
    });
  });
});
