/**
 * ============================================
 * UNIT TEST: OrganizationType Value Object
 * ============================================
 */

import { describe, it, expect } from 'vitest';
import {
  OrganizationType,
  isValidOrganizationType,
} from '@domain/value-objects/organization-type.value-object.js';

describe('OrganizationType Value Object', () => {
  it('should have HOSPITAL type', () => {
    expect(OrganizationType.HOSPITAL).toBe('hospital');
  });

  it('should have CLINIC type', () => {
    expect(OrganizationType.CLINIC).toBe('clinic');
  });

  it('should have HEALTH_CENTER type', () => {
    expect(OrganizationType.HEALTH_CENTER).toBe('health_center');
  });

  it('should have LABORATORY type', () => {
    expect(OrganizationType.LABORATORY).toBe('laboratory');
  });

  it('should have PHARMACY type', () => {
    expect(OrganizationType.PHARMACY).toBe('pharmacy');
  });

  it('should have OTHER type', () => {
    expect(OrganizationType.OTHER).toBe('other');
  });

  it('should have exactly 6 type values', () => {
    expect(Object.values(OrganizationType)).toHaveLength(6);
  });

  it('should validate valid organization types', () => {
    expect(isValidOrganizationType('hospital')).toBe(true);
    expect(isValidOrganizationType('clinic')).toBe(true);
    expect(isValidOrganizationType('health_center')).toBe(true);
    expect(isValidOrganizationType('laboratory')).toBe(true);
    expect(isValidOrganizationType('pharmacy')).toBe(true);
    expect(isValidOrganizationType('other')).toBe(true);
  });

  it('should reject invalid organization types', () => {
    expect(isValidOrganizationType('school')).toBe(false);
    expect(isValidOrganizationType('')).toBe(false);
    expect(isValidOrganizationType('HOSPITAL')).toBe(false);
  });
});
