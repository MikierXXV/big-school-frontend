/**
 * ============================================
 * UNIT TEST: AdminPermission Value Object
 * ============================================
 */

import { describe, it, expect } from 'vitest';
import {
  AdminPermission,
  isValidAdminPermission,
} from '@domain/value-objects/admin-permission.value-object.js';

describe('AdminPermission Value Object', () => {
  it('should have MANAGE_ORGANIZATIONS permission', () => {
    expect(AdminPermission.MANAGE_ORGANIZATIONS).toBe('manage_organizations');
  });

  it('should have VIEW_ALL_DATA permission', () => {
    expect(AdminPermission.VIEW_ALL_DATA).toBe('view_all_data');
  });

  it('should have exactly 2 permission values', () => {
    expect(Object.values(AdminPermission)).toHaveLength(2);
  });

  it('should validate valid admin permissions', () => {
    expect(isValidAdminPermission('manage_organizations')).toBe(true);
    expect(isValidAdminPermission('view_all_data')).toBe(true);
  });

  it('should reject invalid admin permissions', () => {
    expect(isValidAdminPermission('manage_users')).toBe(false);
    expect(isValidAdminPermission('assign_members')).toBe(false);
    expect(isValidAdminPermission('delete_all')).toBe(false);
    expect(isValidAdminPermission('')).toBe(false);
    expect(isValidAdminPermission('MANAGE_ORGANIZATIONS')).toBe(false);
  });
});
