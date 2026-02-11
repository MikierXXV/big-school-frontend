/**
 * ============================================
 * UNIT TEST: Email Value Object
 * ============================================
 *
 * Tests unitarios para el Value Object Email.
 *
 * TODO: Implementar tests completos
 */

import { describe, it, expect } from 'vitest';
import { Email } from '@domain/value-objects/email.value-object.js';

describe('Email Value Object', () => {
  describe('create()', () => {
    it('should create an Email with a valid email address', () => {
      const email = Email.create('user@example.com');
      expect(email.value).toBe('user@example.com');
    });

    it('should normalize email to lowercase', () => {
      const email = Email.create('USER@EXAMPLE.COM');
      expect(email.value).toBe('user@example.com');
    });

    it('should trim whitespace', () => {
      const email = Email.create('  user@example.com  ');
      expect(email.value).toBe('user@example.com');
    });

    // TODO: Agregar mas tests de validacion
  });

  describe('equals()', () => {
    it('should return true for equal emails', () => {
      const email1 = Email.create('user@example.com');
      const email2 = Email.create('user@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = Email.create('user1@example.com');
      const email2 = Email.create('user2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });
  });
});
