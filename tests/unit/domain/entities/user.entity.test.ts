/**
 * ============================================
 * UNIT TEST: User Entity
 * ============================================
 *
 * Tests para la entidad User (Aggregate Root).
 * Versión simplificada para frontend (sin password hash ni lockout fields).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { User } from '@domain/entities/user.entity.js';
import { UserId, Email, UserStatus } from '@domain/value-objects/index.js';

describe('User Entity', () => {
  let validUserId: UserId;
  let validEmail: Email;

  beforeEach(() => {
    validUserId = UserId.create('f47ac10b-58cc-4372-a567-0e02b2c3d479');
    validEmail = Email.create('user@example.com');
  });

  describe('create', () => {
    it('should create a new User in PENDING_VERIFICATION status', () => {
      const user = User.create({
        id: validUserId,
        email: validEmail,
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(user.id).toBe(validUserId);
      expect(user.email).toBe(validEmail);
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.status).toBe(UserStatus.PENDING_VERIFICATION);
      expect(user.emailVerifiedAt).toBeNull();
      expect(user.lastLoginAt).toBeNull();
    });

    it('should set createdAt and updatedAt to current date', () => {
      const before = new Date();
      const user = User.create({
        id: validUserId,
        email: validEmail,
        firstName: 'John',
        lastName: 'Doe',
      });
      const after = new Date();

      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(user.updatedAt.getTime()).toEqual(user.createdAt.getTime());
    });
  });

  describe('fromPersistence', () => {
    it('should reconstruct User from persistence data', () => {
      const now = new Date();
      const user = User.fromPersistence({
        id: validUserId,
        email: validEmail,
        firstName: 'Jane',
        lastName: 'Smith',
        status: UserStatus.ACTIVE,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
        emailVerifiedAt: now,
      });

      expect(user.id).toBe(validUserId);
      expect(user.email).toBe(validEmail);
      expect(user.firstName).toBe('Jane');
      expect(user.lastName).toBe('Smith');
      expect(user.status).toBe(UserStatus.ACTIVE);
      expect(user.emailVerifiedAt).not.toBeNull();
    });
  });

  describe('fullName', () => {
    it('should return concatenated first and last name', () => {
      const user = User.create({
        id: validUserId,
        email: validEmail,
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(user.fullName).toBe('John Doe');
    });
  });

  describe('isEmailVerified', () => {
    it('should return false for new user', () => {
      const user = User.create({
        id: validUserId,
        email: validEmail,
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(user.isEmailVerified()).toBe(false);
    });

    it('should return true when email is verified', () => {
      const user = User.fromPersistence({
        id: validUserId,
        email: validEmail,
        firstName: 'John',
        lastName: 'Doe',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
        emailVerifiedAt: new Date(),
      });

      expect(user.isEmailVerified()).toBe(true);
    });
  });

  describe('isActive', () => {
    it('should return false for pending user', () => {
      const user = User.create({
        id: validUserId,
        email: validEmail,
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(user.isActive()).toBe(false);
    });

    it('should return true for active user', () => {
      const user = User.fromPersistence({
        id: validUserId,
        email: validEmail,
        firstName: 'John',
        lastName: 'Doe',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
        emailVerifiedAt: new Date(),
      });

      expect(user.isActive()).toBe(true);
    });

    it('should return false for suspended user', () => {
      const user = User.fromPersistence({
        id: validUserId,
        email: validEmail,
        firstName: 'John',
        lastName: 'Doe',
        status: UserStatus.SUSPENDED,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
        emailVerifiedAt: new Date(),
      });

      expect(user.isActive()).toBe(false);
    });
  });

  describe('canLogin', () => {
    it('should return false for pending user', () => {
      const user = User.create({
        id: validUserId,
        email: validEmail,
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(user.canLogin()).toBe(false);
    });

    it('should return false for active user without email verification', () => {
      const user = User.fromPersistence({
        id: validUserId,
        email: validEmail,
        firstName: 'John',
        lastName: 'Doe',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
        emailVerifiedAt: null, // Not verified
      });

      expect(user.canLogin()).toBe(false);
    });

    it('should return true for active and verified user', () => {
      const user = User.fromPersistence({
        id: validUserId,
        email: validEmail,
        firstName: 'John',
        lastName: 'Doe',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
        emailVerifiedAt: new Date(),
      });

      expect(user.canLogin()).toBe(true);
    });

    it('should return false for suspended user even if verified', () => {
      const user = User.fromPersistence({
        id: validUserId,
        email: validEmail,
        firstName: 'John',
        lastName: 'Doe',
        status: UserStatus.SUSPENDED,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
        emailVerifiedAt: new Date(),
      });

      expect(user.canLogin()).toBe(false);
    });
  });
});
