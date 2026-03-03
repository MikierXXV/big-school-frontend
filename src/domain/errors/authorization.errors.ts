/**
 * ============================================
 * DOMAIN ERRORS: Authorization
 * ============================================
 *
 * Errores de autorización y permisos.
 */

import { DomainError } from './domain-error.base.js';

export class ForbiddenError extends DomainError {
  constructor(message = 'Access denied') {
    super(message, 'FORBIDDEN');
  }
}

export class InsufficientPermissionsError extends DomainError {
  constructor(public readonly requiredPermission: string) {
    super(
      `Insufficient permissions. Required: ${requiredPermission}`,
      'INSUFFICIENT_PERMISSIONS'
    );
  }
}
