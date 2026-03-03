/**
 * ============================================
 * UNIT TEST: SystemRole Value Object
 * ============================================
 */

import { describe, it, expect } from 'vitest';
import { SystemRole, isValidSystemRole } from '@domain/value-objects/system-role.value-object.js';

describe('SystemRole Value Object', () => {
  it('should have SUPER_ADMIN role', () => {
    expect(SystemRole.SUPER_ADMIN).toBe('super_admin');
  });

  it('should have ADMIN role', () => {
    expect(SystemRole.ADMIN).toBe('admin');
  });

  it('should have USER role', () => {
    expect(SystemRole.USER).toBe('user');
  });

  it('should have exactly 3 role values', () => {
    expect(Object.values(SystemRole)).toHaveLength(3);
  });

  it('should validate valid system roles', () => {
    expect(isValidSystemRole('super_admin')).toBe(true);
    expect(isValidSystemRole('admin')).toBe(true);
    expect(isValidSystemRole('user')).toBe(true);
  });

  it('should reject invalid system roles', () => {
    expect(isValidSystemRole('moderator')).toBe(false);
    expect(isValidSystemRole('')).toBe(false);
    expect(isValidSystemRole('ADMIN')).toBe(false);
  });
});
