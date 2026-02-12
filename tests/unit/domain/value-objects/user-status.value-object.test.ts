/**
 * ============================================
 * UNIT TEST: UserStatus Value Object
 * ============================================
 *
 * Tests para el enum UserStatus.
 */

import { describe, it, expect } from 'vitest';
import { UserStatus } from '@domain/value-objects/user-status.value-object.js';

describe('UserStatus Value Object', () => {
  it('should have PENDING_VERIFICATION status', () => {
    expect(UserStatus.PENDING_VERIFICATION).toBe('PENDING_VERIFICATION');
  });

  it('should have ACTIVE status', () => {
    expect(UserStatus.ACTIVE).toBe('ACTIVE');
  });

  it('should have SUSPENDED status', () => {
    expect(UserStatus.SUSPENDED).toBe('SUSPENDED');
  });

  it('should have DEACTIVATED status', () => {
    expect(UserStatus.DEACTIVATED).toBe('DEACTIVATED');
  });

  it('should have exactly 4 status values', () => {
    const statusValues = Object.values(UserStatus);
    expect(statusValues).toHaveLength(4);
  });
});
