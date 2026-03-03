/**
 * ============================================
 * UNIT TEST: Organization Entity
 * ============================================
 */

import { describe, it, expect } from 'vitest';
import { Organization } from '@domain/entities/organization.entity.js';
import { OrganizationType } from '@domain/value-objects/organization-type.value-object.js';

describe('Organization Entity', () => {
  const validProps = {
    id: 'org-001',
    name: 'Hospital Central',
    type: OrganizationType.HOSPITAL,
    description: 'Main hospital',
    address: '123 Main St',
    contactEmail: 'contact@hospital.com',
    contactPhone: '+34 600 000 000',
    active: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  };

  describe('fromPersistence()', () => {
    it('should create an organization from persistence data', () => {
      const org = Organization.fromPersistence(validProps);

      expect(org.id).toBe('org-001');
      expect(org.name).toBe('Hospital Central');
      expect(org.type).toBe(OrganizationType.HOSPITAL);
    });
  });

  describe('getters', () => {
    it('should return all properties correctly', () => {
      const org = Organization.fromPersistence(validProps);

      expect(org.id).toBe('org-001');
      expect(org.name).toBe('Hospital Central');
      expect(org.type).toBe(OrganizationType.HOSPITAL);
      expect(org.description).toBe('Main hospital');
      expect(org.address).toBe('123 Main St');
      expect(org.contactEmail).toBe('contact@hospital.com');
      expect(org.contactPhone).toBe('+34 600 000 000');
      expect(org.active).toBe(true);
    });

    it('should return date copies', () => {
      const org = Organization.fromPersistence(validProps);

      const createdAt = org.createdAt;
      const updatedAt = org.updatedAt;

      expect(createdAt).toEqual(new Date('2024-01-01'));
      expect(updatedAt).toEqual(new Date('2024-01-15'));
      expect(createdAt).not.toBe(validProps.createdAt);
    });
  });

  describe('isActive()', () => {
    it('should return true for active organizations', () => {
      const org = Organization.fromPersistence(validProps);
      expect(org.isActive()).toBe(true);
    });

    it('should return false for inactive organizations', () => {
      const org = Organization.fromPersistence({ ...validProps, active: false });
      expect(org.isActive()).toBe(false);
    });
  });

  describe('different organization types', () => {
    it('should support all organization types', () => {
      const types = Object.values(OrganizationType);

      types.forEach((type) => {
        const org = Organization.fromPersistence({ ...validProps, type });
        expect(org.type).toBe(type);
      });
    });
  });
});
