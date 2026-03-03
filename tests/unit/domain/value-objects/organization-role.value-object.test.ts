/**
 * ============================================
 * UNIT TEST: OrganizationRole Value Object
 * ============================================
 */

import { describe, it, expect } from 'vitest';
import {
  OrganizationRole,
  isValidOrganizationRole,
} from '@domain/value-objects/organization-role.value-object.js';

describe('OrganizationRole Value Object', () => {
  it('should have ORG_ADMIN role', () => {
    expect(OrganizationRole.ORG_ADMIN).toBe('org_admin');
  });

  it('should have DOCTOR role', () => {
    expect(OrganizationRole.DOCTOR).toBe('doctor');
  });

  it('should have NURSE role', () => {
    expect(OrganizationRole.NURSE).toBe('nurse');
  });

  it('should have SPECIALIST role', () => {
    expect(OrganizationRole.SPECIALIST).toBe('specialist');
  });

  it('should have STAFF role', () => {
    expect(OrganizationRole.STAFF).toBe('staff');
  });

  it('should have GUEST role', () => {
    expect(OrganizationRole.GUEST).toBe('guest');
  });

  it('should have exactly 6 role values', () => {
    expect(Object.values(OrganizationRole)).toHaveLength(6);
  });

  it('should validate valid organization roles', () => {
    expect(isValidOrganizationRole('org_admin')).toBe(true);
    expect(isValidOrganizationRole('doctor')).toBe(true);
    expect(isValidOrganizationRole('nurse')).toBe(true);
    expect(isValidOrganizationRole('specialist')).toBe(true);
    expect(isValidOrganizationRole('staff')).toBe(true);
    expect(isValidOrganizationRole('guest')).toBe(true);
  });

  it('should reject invalid organization roles', () => {
    expect(isValidOrganizationRole('manager')).toBe(false);
    expect(isValidOrganizationRole('')).toBe(false);
    expect(isValidOrganizationRole('DOCTOR')).toBe(false);
  });
});
