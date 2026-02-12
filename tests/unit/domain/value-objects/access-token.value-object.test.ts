/**
 * ============================================
 * UNIT TEST: AccessToken Value Object
 * ============================================
 *
 * Tests para el token de acceso JWT.
 */

import { describe, it, expect } from 'vitest';
import { AccessToken } from '@domain/value-objects/access-token.value-object.js';

describe('AccessToken Value Object', () => {
  describe('create', () => {
    it('should create an AccessToken with valid token string', () => {
      const tokenString = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
      const token = AccessToken.create(tokenString);

      expect(token.value).toBe(tokenString);
    });

    it('should trim whitespace from token', () => {
      const tokenString = '  valid-token-here  ';
      const token = AccessToken.create(tokenString);

      expect(token.value).toBe('valid-token-here');
    });

    it('should throw error for empty token', () => {
      expect(() => AccessToken.create('')).toThrow('Access token cannot be empty');
    });

    it('should throw error for whitespace-only token', () => {
      expect(() => AccessToken.create('   ')).toThrow('Access token cannot be empty');
    });
  });

  describe('equals', () => {
    it('should return true for equal tokens', () => {
      const tokenString = 'same-token';
      const token1 = AccessToken.create(tokenString);
      const token2 = AccessToken.create(tokenString);

      expect(token1.equals(token2)).toBe(true);
    });

    it('should return false for different tokens', () => {
      const token1 = AccessToken.create('token-1');
      const token2 = AccessToken.create('token-2');

      expect(token1.equals(token2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const tokenString = 'my-token';
      const token = AccessToken.create(tokenString);

      expect(token.toString()).toBe(tokenString);
    });
  });
});
