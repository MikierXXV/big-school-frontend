/**
 * ============================================
 * UNIT TEST: OrganizationMembership Entity
 * ============================================
 */

import { describe, it, expect } from 'vitest';
import { OrganizationMembership } from '@domain/entities/organization-membership.entity.js';
import { OrganizationRole } from '@domain/value-objects/organization-role.value-object.js';

describe('OrganizationMembership Entity', () => {
  const validProps = {
    id: 'mem-001',
    userId: 'user-001',
    organizationId: 'org-001',
    role: OrganizationRole.DOCTOR,
    joinedAt: new Date('2024-01-15'),
    leftAt: null,
    createdBy: 'admin-001',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  };

  describe('fromPersistence()', () => {
    it('should create a membership from persistence data', () => {
      const membership = OrganizationMembership.fromPersistence(validProps);

      expect(membership.id).toBe('mem-001');
      expect(membership.userId).toBe('user-001');
      expect(membership.organizationId).toBe('org-001');
      expect(membership.role).toBe(OrganizationRole.DOCTOR);
    });
  });

  describe('getters', () => {
    it('should return all properties correctly', () => {
      const membership = OrganizationMembership.fromPersistence(validProps);

      expect(membership.id).toBe('mem-001');
      expect(membership.userId).toBe('user-001');
      expect(membership.organizationId).toBe('org-001');
      expect(membership.role).toBe(OrganizationRole.DOCTOR);
      expect(membership.createdBy).toBe('admin-001');
    });

    it('should return null for leftAt when active', () => {
      const membership = OrganizationMembership.fromPersistence(validProps);
      expect(membership.leftAt).toBeNull();
    });

    it('should return date for leftAt when inactive', () => {
      const leftDate = new Date('2024-06-01');
      const membership = OrganizationMembership.fromPersistence({
        ...validProps,
        leftAt: leftDate,
      });
      expect(membership.leftAt).toEqual(leftDate);
    });

    it('should return date copies', () => {
      const membership = OrganizationMembership.fromPersistence(validProps);
      expect(membership.joinedAt).toEqual(new Date('2024-01-15'));
      expect(membership.joinedAt).not.toBe(validProps.joinedAt);
    });
  });

  describe('isActive()', () => {
    it('should return true when leftAt is null', () => {
      const membership = OrganizationMembership.fromPersistence(validProps);
      expect(membership.isActive()).toBe(true);
    });

    it('should return false when leftAt is set', () => {
      const membership = OrganizationMembership.fromPersistence({
        ...validProps,
        leftAt: new Date('2024-06-01'),
      });
      expect(membership.isActive()).toBe(false);
    });
  });

  describe('different roles', () => {
    it('should support all organization roles', () => {
      const roles = Object.values(OrganizationRole);

      roles.forEach((role) => {
        const membership = OrganizationMembership.fromPersistence({
          ...validProps,
          role,
        });
        expect(membership.role).toBe(role);
      });
    });
  });
});
