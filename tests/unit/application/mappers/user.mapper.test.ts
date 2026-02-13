/**
 * ============================================
 * UNIT TEST: UserMapper
 * ============================================
 *
 * Tests para el mapper de User entity.
 */

import { describe, it, expect } from 'vitest';
import { UserMapper } from '@application/mappers/user.mapper.js';
import { User } from '@domain/entities/user.entity.js';
import { UserId } from '@domain/value-objects/user-id.value-object.js';
import { Email } from '@domain/value-objects/email.value-object.js';
import { UserStatus } from '@domain/value-objects/user-status.value-object.js';

describe('UserMapper', () => {
  describe('fromApi', () => {
    it('should map complete API data to User entity', () => {
      const apiData = {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        status: 'ACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        emailVerifiedAt: '2024-01-01T00:00:00Z',
        lastLoginAt: null,
      };

      const user = UserMapper.fromApi(apiData);

      expect(user).toBeInstanceOf(User);
      expect(user.id.value).toBe(apiData.id);
      expect(user.email.value).toBe(apiData.email);
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.isEmailVerified()).toBe(true);
    });

    it('should handle null dates correctly', () => {
      const apiData = {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        status: 'PENDING_VERIFICATION',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        emailVerifiedAt: null,
        lastLoginAt: null,
      };

      const user = UserMapper.fromApi(apiData);

      expect(user.emailVerifiedAt).toBeNull();
      expect(user.lastLoginAt).toBeNull();
      expect(user.isEmailVerified()).toBe(false);
    });

    it('should throw when email is invalid', () => {
      const apiData = {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        email: 'invalid-email',
        firstName: 'John',
        lastName: 'Doe',
        status: 'ACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        emailVerifiedAt: null,
        lastLoginAt: null,
      };

      expect(() => UserMapper.fromApi(apiData)).toThrow();
    });

    it('should throw when ID is invalid', () => {
      const apiData = {
        id: 'invalid-uuid',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        status: 'ACTIVE',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        emailVerifiedAt: null,
        lastLoginAt: null,
      };

      expect(() => UserMapper.fromApi(apiData)).toThrow();
    });
  });

  describe('toApi', () => {
    it('should map User entity to DTO', () => {
      const user = User.create({
        id: UserId.create('f47ac10b-58cc-4372-a567-0e02b2c3d479'),
        email: Email.create('john@example.com'),
        firstName: 'John',
        lastName: 'Doe',
      });

      const dto = UserMapper.toApi(user);

      expect(dto.id).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479');
      expect(dto.email).toBe('john@example.com');
      expect(dto.firstName).toBe('John');
      expect(dto.lastName).toBe('Doe');
      expect(dto.emailVerified).toBe(false);
      expect(dto.status).toBe('PENDING_VERIFICATION');
      expect(typeof dto.createdAt).toBe('string');
      expect(typeof dto.updatedAt).toBe('string');
    });

    it('should map User entity with verified email to DTO', () => {
      const user = User.fromPersistence({
        id: UserId.create('f47ac10b-58cc-4372-a567-0e02b2c3d479'),
        email: Email.create('john@example.com'),
        firstName: 'John',
        lastName: 'Doe',
        status: UserStatus.ACTIVE,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
        emailVerifiedAt: new Date('2024-01-01T01:00:00Z'),
        lastLoginAt: null,
      });

      const dto = UserMapper.toApi(user);

      expect(dto.emailVerified).toBe(true);
      expect(dto.status).toBe('ACTIVE');
    });
  });
});
