/**
 * ============================================
 * UNIT TEST: Email Value Object
 * ============================================
 *
 * Tests unitarios para el Value Object Email.
 * Valida formato, normalización y reglas de negocio.
 */

import { describe, it, expect } from 'vitest';
import { Email } from '@domain/value-objects/email.value-object.js';

describe('Email Value Object', () => {
  describe('create() - Valid emails', () => {
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

    it('should accept email with numbers', () => {
      const email = Email.create('user123@example.com');
      expect(email.value).toBe('user123@example.com');
    });

    it('should accept email with dots in local part', () => {
      const email = Email.create('user.name@example.com');
      expect(email.value).toBe('user.name@example.com');
    });

    it('should accept email with plus sign', () => {
      const email = Email.create('user+tag@example.com');
      expect(email.value).toBe('user+tag@example.com');
    });

    it('should accept email with subdomain', () => {
      const email = Email.create('user@mail.example.com');
      expect(email.value).toBe('user@mail.example.com');
    });
  });

  describe('create() - Invalid emails', () => {
    it('should throw error when email is empty', () => {
      expect(() => Email.create('')).toThrow('Email cannot be empty');
    });

    it('should throw error when email is only whitespace', () => {
      expect(() => Email.create('   ')).toThrow('Email cannot be empty');
    });

    it('should throw error when email has no @ symbol', () => {
      expect(() => Email.create('userexample.com')).toThrow('Invalid email format');
    });

    it('should throw error when email has no domain', () => {
      expect(() => Email.create('user@')).toThrow('Invalid email format');
    });

    it('should throw error when email has no local part', () => {
      expect(() => Email.create('@example.com')).toThrow('Invalid email format');
    });

    it('should throw error when email has no TLD', () => {
      expect(() => Email.create('user@example')).toThrow('Invalid email format');
    });

    it('should throw error when email exceeds max length (254 chars)', () => {
      const longLocal = 'a'.repeat(250);
      const longEmail = `${longLocal}@example.com`;
      expect(() => Email.create(longEmail)).toThrow('Email exceeds maximum length');
    });

    it('should throw error when email has invalid characters', () => {
      expect(() => Email.create('user name@example.com')).toThrow('Invalid email format');
    });
  });

  describe('localPart getter', () => {
    it('should return the local part of the email', () => {
      const email = Email.create('user@example.com');
      expect(email.localPart).toBe('user');
    });

    it('should return local part with dots', () => {
      const email = Email.create('user.name@example.com');
      expect(email.localPart).toBe('user.name');
    });
  });

  describe('domain getter', () => {
    it('should return the domain of the email', () => {
      const email = Email.create('user@example.com');
      expect(email.domain).toBe('example.com');
    });

    it('should return domain with subdomain', () => {
      const email = Email.create('user@mail.example.com');
      expect(email.domain).toBe('mail.example.com');
    });
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

    it('should return true for emails with different casing (normalized)', () => {
      const email1 = Email.create('USER@EXAMPLE.COM');
      const email2 = Email.create('user@example.com');
      expect(email1.equals(email2)).toBe(true);
    });
  });

  describe('toString()', () => {
    it('should return string representation of email', () => {
      const email = Email.create('user@example.com');
      expect(email.toString()).toBe('user@example.com');
    });
  });
});
