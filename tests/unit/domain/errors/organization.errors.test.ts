/**
 * ============================================
 * UNIT TEST: Organization Errors
 * ============================================
 */

import { describe, it, expect } from 'vitest';
import {
  OrganizationNotFoundError,
  OrganizationAlreadyExistsError,
  MemberAlreadyExistsError,
  MemberNotFoundError,
} from '@domain/errors/organization.errors.js';
import { DomainError } from '@domain/errors/domain-error.base.js';

describe('Organization Errors', () => {
  describe('OrganizationNotFoundError', () => {
    it('should create with organization ID', () => {
      const error = new OrganizationNotFoundError('org-123');
      expect(error.message).toContain('org-123');
      expect(error.code).toBe('ORGANIZATION_NOT_FOUND');
      expect(error.organizationId).toBe('org-123');
    });

    it('should be instance of DomainError', () => {
      const error = new OrganizationNotFoundError('org-123');
      expect(error).toBeInstanceOf(DomainError);
    });
  });

  describe('OrganizationAlreadyExistsError', () => {
    it('should create with organization name', () => {
      const error = new OrganizationAlreadyExistsError('Hospital Central');
      expect(error.message).toContain('Hospital Central');
      expect(error.code).toBe('ORGANIZATION_ALREADY_EXISTS');
      expect(error.name).toBe('Hospital Central');
    });
  });

  describe('MemberAlreadyExistsError', () => {
    it('should create with user and organization IDs', () => {
      const error = new MemberAlreadyExistsError('user-1', 'org-1');
      expect(error.message).toContain('user-1');
      expect(error.message).toContain('org-1');
      expect(error.code).toBe('MEMBER_ALREADY_EXISTS');
      expect(error.userId).toBe('user-1');
      expect(error.organizationId).toBe('org-1');
    });
  });

  describe('MemberNotFoundError', () => {
    it('should create with user and organization IDs', () => {
      const error = new MemberNotFoundError('user-2', 'org-2');
      expect(error.message).toContain('user-2');
      expect(error.message).toContain('org-2');
      expect(error.code).toBe('MEMBER_NOT_FOUND');
      expect(error.userId).toBe('user-2');
      expect(error.organizationId).toBe('org-2');
    });

    it('should be instance of DomainError', () => {
      const error = new MemberNotFoundError('user-2', 'org-2');
      expect(error).toBeInstanceOf(DomainError);
    });
  });
});
