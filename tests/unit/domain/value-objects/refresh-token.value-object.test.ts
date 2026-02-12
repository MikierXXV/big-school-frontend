/**
 * ============================================
 * UNIT TEST: RefreshToken Value Object
 * ============================================
 *
 * Tests para el token de refresco JWT.
 * Duración: 3 días (según backend).
 * Usa rotación de tokens para seguridad.
 */

import { describe, it, expect } from 'vitest';
import { RefreshToken } from '@domain/value-objects/refresh-token.value-object.js';

describe('RefreshToken Value Object', () => {
  describe('create', () => {
    it('should create a RefreshToken with valid token string', () => {
      const tokenString = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
      const token = RefreshToken.create(tokenString);

      expect(token.value).toBe(tokenString);
    });

    it('should trim whitespace from token', () => {
      const tokenString = '  valid-refresh-token  ';
      const token = RefreshToken.create(tokenString);

      expect(token.value).toBe('valid-refresh-token');
    });

    it('should throw error for empty token', () => {
      expect(() => RefreshToken.create('')).toThrow('Refresh token cannot be empty');
    });

    it('should throw error for whitespace-only token', () => {
      expect(() => RefreshToken.create('   ')).toThrow('Refresh token cannot be empty');
    });
  });

  describe('equals', () => {
    it('should return true for equal tokens', () => {
      const tokenString = 'same-refresh-token';
      const token1 = RefreshToken.create(tokenString);
      const token2 = RefreshToken.create(tokenString);

      expect(token1.equals(token2)).toBe(true);
    });

    it('should return false for different tokens', () => {
      const token1 = RefreshToken.create('refresh-token-1');
      const token2 = RefreshToken.create('refresh-token-2');

      expect(token1.equals(token2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const tokenString = 'my-refresh-token';
      const token = RefreshToken.create(tokenString);

      expect(token.toString()).toBe(tokenString);
    });
  });
});
