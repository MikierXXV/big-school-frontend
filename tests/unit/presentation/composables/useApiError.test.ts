/**
 * ============================================
 * TEST: useApiError Composable
 * ============================================
 */

import { describe, it, expect, vi } from 'vitest';
import { useApiError } from '@presentation/composables/useApiError.js';
import { DomainError } from '@domain/errors/domain-error.base.js';
import { ForbiddenError, InsufficientPermissionsError } from '@domain/errors/authorization.errors.js';
import { OrganizationNotFoundError } from '@domain/errors/organization.errors.js';

const mockPush = vi.fn();

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'errors.forbidden': 'Access denied',
        'errors.insufficientPermissions': 'Insufficient permissions',
        'errors.organizationNotFound': 'Organization not found',
        'errors.unknown': 'An unexpected error occurred',
      };
      return map[key] || key;
    },
  }),
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('useApiError', () => {
  describe('handleError', () => {
    it('should map ForbiddenError to forbidden message with redirect', () => {
      const { handleError } = useApiError();
      const result = handleError(new ForbiddenError());
      expect(result.message).toBe('Access denied');
      expect(result.redirectTo).toBe('/dashboard');
    });

    it('should map InsufficientPermissionsError to permissions message', () => {
      const { handleError } = useApiError();
      const result = handleError(new InsufficientPermissionsError('manage_users'));
      expect(result.message).toBe('Insufficient permissions');
      expect(result.redirectTo).toBeUndefined();
    });

    it('should map OrganizationNotFoundError to not found message with redirect', () => {
      const { handleError } = useApiError();
      const result = handleError(new OrganizationNotFoundError('org-1'));
      expect(result.message).toBe('Organization not found');
      expect(result.redirectTo).toBe('/admin/organizations');
    });

    it('should handle generic DomainError', () => {
      const { handleError } = useApiError();
      const result = handleError(new DomainError('Custom error', 'CUSTOM'));
      expect(result.message).toBe('Custom error');
    });

    it('should handle non-DomainError', () => {
      const { handleError } = useApiError();
      const result = handleError(new Error('Something went wrong'));
      expect(result.message).toBe('An unexpected error occurred');
    });

    it('should handle unknown error types', () => {
      const { handleError } = useApiError();
      const result = handleError('string error');
      expect(result.message).toBe('An unexpected error occurred');
    });
  });

  describe('handleErrorAndRedirect', () => {
    it('should redirect for ForbiddenError', () => {
      mockPush.mockClear();
      const { handleErrorAndRedirect } = useApiError();
      const message = handleErrorAndRedirect(new ForbiddenError());
      expect(message).toBe('Access denied');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('should redirect for OrganizationNotFoundError', () => {
      mockPush.mockClear();
      const { handleErrorAndRedirect } = useApiError();
      const message = handleErrorAndRedirect(new OrganizationNotFoundError('org-1'));
      expect(message).toBe('Organization not found');
      expect(mockPush).toHaveBeenCalledWith('/admin/organizations');
    });

    it('should not redirect for InsufficientPermissionsError', () => {
      mockPush.mockClear();
      const { handleErrorAndRedirect } = useApiError();
      const message = handleErrorAndRedirect(new InsufficientPermissionsError('manage_users'));
      expect(message).toBe('Insufficient permissions');
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should not redirect for generic errors', () => {
      mockPush.mockClear();
      const { handleErrorAndRedirect } = useApiError();
      const message = handleErrorAndRedirect(new DomainError('Test', 'TEST'));
      expect(message).toBe('Test');
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
