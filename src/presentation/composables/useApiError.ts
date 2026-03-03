/**
 * ============================================
 * COMPOSABLE: useApiError
 * ============================================
 *
 * Maps domain errors to user-facing messages and handles redirections.
 */

import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { DomainError } from '@domain/errors/domain-error.base.js';
import { ForbiddenError, InsufficientPermissionsError } from '@domain/errors/authorization.errors.js';
import { OrganizationNotFoundError } from '@domain/errors/organization.errors.js';

export interface ApiErrorResult {
  message: string;
  redirectTo?: string;
}

export function useApiError() {
  const { t } = useI18n();
  const router = useRouter();

  function handleError(error: unknown): ApiErrorResult {
    if (!(error instanceof DomainError)) {
      return { message: t('errors.unknown') || 'An unexpected error occurred' };
    }

    if (error instanceof ForbiddenError) {
      return {
        message: t('errors.forbidden'),
        redirectTo: '/dashboard',
      };
    }

    if (error instanceof InsufficientPermissionsError) {
      return {
        message: t('errors.insufficientPermissions'),
      };
    }

    if (error instanceof OrganizationNotFoundError) {
      return {
        message: t('errors.organizationNotFound'),
        redirectTo: '/admin/organizations',
      };
    }

    return { message: error.message };
  }

  function handleErrorAndRedirect(error: unknown): string {
    const result = handleError(error);
    if (result.redirectTo) {
      router.push(result.redirectTo);
    }
    return result.message;
  }

  return {
    handleError,
    handleErrorAndRedirect,
  };
}
