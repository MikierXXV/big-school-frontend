/**
 * ============================================
 * UNIT TEST: Authorization Errors
 * ============================================
 */

import { describe, it, expect } from 'vitest';
import {
  ForbiddenError,
  InsufficientPermissionsError,
} from '@domain/errors/authorization.errors.js';
import { DomainError } from '@domain/errors/domain-error.base.js';

describe('Authorization Errors', () => {
  describe('ForbiddenError', () => {
    it('should create with default message', () => {
      const error = new ForbiddenError();
      expect(error.message).toBe('Access denied');
      expect(error.code).toBe('FORBIDDEN');
    });

    it('should create with custom message', () => {
      const error = new ForbiddenError('Not allowed to access this resource');
      expect(error.message).toBe('Not allowed to access this resource');
      expect(error.code).toBe('FORBIDDEN');
    });

    it('should be instance of DomainError', () => {
      const error = new ForbiddenError();
      expect(error).toBeInstanceOf(DomainError);
    });
  });

  describe('InsufficientPermissionsError', () => {
    it('should create with required permission', () => {
      const error = new InsufficientPermissionsError('manage_users');
      expect(error.message).toContain('manage_users');
      expect(error.code).toBe('INSUFFICIENT_PERMISSIONS');
      expect(error.requiredPermission).toBe('manage_users');
    });

    it('should be instance of DomainError', () => {
      const error = new InsufficientPermissionsError('view_all_data');
      expect(error).toBeInstanceOf(DomainError);
    });
  });
});
