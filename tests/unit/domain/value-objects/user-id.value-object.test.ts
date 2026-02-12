import { describe, it, expect } from 'vitest';
import { UserId } from '@domain/value-objects/user-id.value-object.js';

describe('UserId Value Object', () => {
  describe('create', () => {
    it('should create a UserId with a valid UUID v4', () => {
      const validUuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const userId = UserId.create(validUuid);

      expect(userId.value).toBe(validUuid);
    });

    it('should throw error when creating UserId with invalid UUID format', () => {
      const invalidUuid = 'not-a-valid-uuid';

      expect(() => UserId.create(invalidUuid)).toThrow('Invalid user ID format');
    });

    it('should throw error when creating UserId with empty string', () => {
      expect(() => UserId.create('')).toThrow('Invalid user ID format');
    });

    it('should throw error when creating UserId with non-UUID string', () => {
      const nonUuid = '12345';

      expect(() => UserId.create(nonUuid)).toThrow('Invalid user ID format');
    });

    it('should accept UUID with different casing', () => {
      const upperUuid = 'F47AC10B-58CC-4372-A567-0E02B2C3D479';
      const userId = UserId.create(upperUuid);

      // Should normalize to lowercase
      expect(userId.value).toBe(upperUuid.toLowerCase());
    });
  });

  describe('equals', () => {
    it('should return true when comparing two UserIds with same value', () => {
      const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const userId1 = UserId.create(uuid);
      const userId2 = UserId.create(uuid);

      expect(userId1.equals(userId2)).toBe(true);
    });

    it('should return false when comparing two UserIds with different values', () => {
      const userId1 = UserId.create('f47ac10b-58cc-4372-a567-0e02b2c3d479');
      const userId2 = UserId.create('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d');

      expect(userId1.equals(userId2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return string representation of UserId', () => {
      const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const userId = UserId.create(uuid);

      expect(userId.toString()).toBe(uuid);
    });
  });
});
